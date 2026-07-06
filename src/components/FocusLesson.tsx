import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  X,
  Flame,
  Heart,
  Zap,
  Lightbulb,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Undo2,
  Maximize2,
  BookOpen,
  MousePointerClick,
  Info,
  Layers,
  Sparkles,
  Loader2
} from "lucide-react";

interface LessonNode {
  title: string;
  description?: string;
  xp?: number;
  topic?: string;
  learningStyle?: string;
}

interface FocusLessonProps {
  onClose: () => void;
  lessonNode: LessonNode;
}

interface ComponentTile {
  id: string;
  name: string;
  type: string;
  color: string;
}

interface LessonContent {
  breadcrumb: string;
  headlineLine1: string;
  headlineLine2: string;
  bodyText: string;
  mentorQuote: string;
  practiceTitle: string;
  practiceDescription: string;
  hintText: string;
}

// Fallback content used if the AI call fails, so the lesson screen never breaks
const FALLBACK_CONTENT = (lessonNode: LessonNode): LessonContent => ({
  breadcrumb: lessonNode.topic || "UI Fundamentals",
  headlineLine1: "Understanding",
  headlineLine2: lessonNode.title || "This Concept",
  bodyText:
    lessonNode.description ||
    "This module builds on your existing skills with hands-on, practical concepts you can apply immediately.",
  mentorQuote: "Mastery comes from consistent, deliberate practice — one concept at a time.",
  practiceTitle: "Layout Architect Tree",
  practiceDescription: "Sequence the components to create a balanced, logical visual hierarchy from top to bottom.",
  hintText: "Correctly align sections from top (1) to bottom (4)",
});

export default function FocusLesson({ onClose, lessonNode }: FocusLessonProps) {
  // Learning States
  const [paddingSize, setPaddingSize] = useState<number>(32); // in pixels
  const [marginSize, setMarginSize] = useState<number>(24); // in pixels
  const [hearts, setHearts] = useState<number>(3);
  const [xpEarned, setXpEarned] = useState<number>(lessonNode.xp || 120);

  // Real AI-generated lesson content for this specific node
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [lessonLoading, setLessonLoading] = useState<boolean>(true);
  const [lessonError, setLessonError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function loadLessonContent() {
      setLessonLoading(true);
      setLessonError(false);
      try {
        const response = await fetch(`${API_BASE_URL}/api/quiz/lesson`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleTitle: lessonNode.title,
            moduleDescription: lessonNode.description,
            topic: lessonNode.topic,
            learningStyle: lessonNode.learningStyle,
          }),
        });
        const data = await response.json();
        if (!cancelled) {
          if (data.success && data.lesson) {
            setLessonContent(data.lesson);
          } else {
            console.error("Lesson generation failed:", data.message);
            setLessonContent(FALLBACK_CONTENT(lessonNode));
            setLessonError(true);
          }
        }
      } catch (err) {
        console.error("Error fetching lesson content:", err);
        if (!cancelled) {
          setLessonContent(FALLBACK_CONTENT(lessonNode));
          setLessonError(true);
        }
      } finally {
        if (!cancelled) setLessonLoading(false);
      }
    }

    loadLessonContent();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonNode.title]);
  
  // Interactive puzzle tiles
  const [tiles, setTiles] = useState<ComponentTile[]>([
    { id: "hero", name: "Hero Section", type: "body", color: "from-blue-600/20 to-indigo-600/10 text-blue-400 border-blue-500/30" },
    { id: "footer", name: "Footer", type: "bottom", color: "from-slate-600/20 to-zinc-600/10 text-slate-400 border-slate-500/30" },
    { id: "header", name: "Header", type: "top", color: "from-purple-600/20 to-fuchsia-600/10 text-purple-400 border-purple-500/30" },
    { id: "grid", name: "Feature Grid", type: "body", color: "from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/30" }
  ]);

  const [answeredState, setAnsweredState] = useState<"unanswered" | "correct" | "incorrect">("unanswered");
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Helper to reorder tiles
  const moveTile = (index: number, direction: "up" | "down") => {
    if (answeredState === "correct") return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tiles.length) return;

    const updatedTiles = [...tiles];
    const temp = updatedTiles[index];
    updatedTiles[index] = updatedTiles[newIndex];
    updatedTiles[newIndex] = temp;
    setTiles(updatedTiles);
    
    // Reset incorrect status on reorder to allow retrying easily
    if (answeredState === "incorrect") {
      setAnsweredState("unanswered");
    }
  };

  // Validate hierarchy sequence: Header -> Hero -> Feature Grid -> Footer
  const handleCheckAnswer = async () => {
    const correctSequence = ["header", "hero", "grid", "footer"];
    const currentSequence = tiles.map(t => t.id);
    
    const isCorrect = correctSequence.every((val, index) => val === currentSequence[index]);

    if (isCorrect) {
      setAnsweredState("correct");
      setShowExplanation(true);

      const reward = lessonNode.xp || 50;
      setXpEarned(prev => prev + reward);

      // Persist the real progress to MongoDB — this is what actually moves
      // the streak/xp/nodesVisited fields shown across the whole app.
      const userId = localStorage.getItem("skillmatch_userId");
      if (userId) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/quiz/complete-lesson`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, xpEarned: reward }),
          });
          const data = await response.json();
          if (!data.success) {
            console.error("Failed to save lesson completion:", data.message);
          }
        } catch (err) {
          console.error("Error saving lesson completion:", err);
        }
      }
    } else {
      setAnsweredState("incorrect");
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleReset = () => {
    setTiles([
      { id: "hero", name: "Hero Section", type: "body", color: "from-blue-600/20 to-indigo-600/10 text-blue-400 border-blue-500/30" },
      { id: "footer", name: "Footer", type: "bottom", color: "from-slate-600/20 to-zinc-600/10 text-slate-400 border-slate-500/30" },
      { id: "header", name: "Header", type: "top", color: "from-purple-600/20 to-fuchsia-600/10 text-purple-400 border-purple-500/30" },
      { id: "grid", name: "Feature Grid", type: "body", color: "from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/30" }
    ]);
    setAnsweredState("unanswered");
    setShowExplanation(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 font-sans antialiased flex flex-col relative overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Top Header Controls bar */}
      <header className="w-full py-4 px-6 flex flex-col gap-4 z-50 bg-[#070d1f]/80 backdrop-blur-md border-b border-white/5 shrink-0">
        
        {/* Row 1: Close button & Breadcrumbs */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
            aria-label="Close Focus Mode"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>

          <div className="flex flex-col text-center">
            <span className="font-display text-[10px] text-purple-400 uppercase tracking-widest font-black">
              {lessonContent?.breadcrumb || lessonNode.topic || "UI Fundamentals"}
            </span>
            <span className="text-sm md:text-base text-white font-bold font-display mt-0.5">
              {lessonNode.title}
            </span>
          </div>

          {/* Dummy element for symmetry */}
          <div className="w-10 h-10" />
        </div>

        {/* Row 2: Progress Tracker */}
        <div className="w-full max-w-3xl mx-auto px-2">
          <div className="w-full h-2.5 bg-[#121c38] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#00f1ab] to-emerald-400 rounded-full shadow-[0_0_15px_rgba(0,241,171,0.4)] transition-all duration-500"
              style={{ width: answeredState === "correct" ? "100%" : "65%" }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono font-bold tracking-wider">
            <span className="text-[#00f1ab]">
              MISSION PROGRESS: {answeredState === "correct" ? "100%" : "65%"}
            </span>
            <span className="text-gray-500">
              {answeredState === "correct" ? "COMPLETED" : "STAGE 5/8"}
            </span>
          </div>
        </div>

        {/* Row 3: Live Stats chip rows */}
        <div className="flex items-center justify-center gap-3 mt-1.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            <span className="font-mono text-xs text-gray-300 font-bold">5 DAY STREAK</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl">
            <Heart className={`w-4 h-4 ${hearts === 0 ? "text-gray-600" : "text-red-500 fill-red-500/20 animate-pulse"}`} />
            <span className="font-mono text-xs text-gray-300 font-bold">{hearts} LIVES</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-600/10 border border-purple-500/20 rounded-xl">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="font-mono text-xs text-purple-400 font-extrabold">+{xpEarned} XP</span>
          </div>
        </div>

      </header>

      {/* Main Focus Split panel */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Study Guide Panel - Scrollable (6 Columns) */}
        <section className="lg:col-span-6 flex flex-col gap-5 overflow-y-auto lg:h-full pr-0 lg:pr-2 scrollbar-thin">
          
          <div className="p-6 md:p-8 rounded-3xl bg-[#0f172a]/60 border border-white/5 relative overflow-hidden flex flex-col gap-6">
            
            {/* Ambient visual glowing backdrop */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-display text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                {lessonNode.learningStyle ? `${lessonNode.learningStyle} Concept` : "Visual & Kinesthetic Concept"}
              </span>
            </div>

            <h1 className="font-display text-2xl md:text-4xl text-white font-extrabold leading-tight">
              {lessonLoading ? (
                <span className="inline-flex items-center gap-2 text-xl text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Tailoring this lesson...
                </span>
              ) : (
                <>
                  {lessonContent?.headlineLine1} <br />
                  <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    {lessonContent?.headlineLine2}
                  </span>
                </>
              )}
            </h1>

            <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed">
              <p>
                {lessonLoading ? (
                  <span className="text-gray-500 italic">Generating a tailored explanation for this concept...</span>
                ) : (
                  lessonContent?.bodyText
                )}
              </p>

              {/* Interactive Sandbox sandbox simulator block */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MousePointerClick className="w-4 h-4 text-purple-400" />
                    Concept Simulator
                  </h3>
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-black">Interactive</span>
                </div>

                {/* Sizing controls */}
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Element Padding:</span>
                      <span className="font-mono text-purple-400 font-bold">{paddingSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={paddingSize}
                      onChange={(e) => setPaddingSize(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Card Gap Margin:</span>
                      <span className="font-mono text-purple-400 font-bold">{marginSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="48"
                      value={marginSize}
                      onChange={(e) => setMarginSize(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>

                {/* Real-time Layout Visualizer Box */}
                <div className="bg-[#030712] border border-white/10 rounded-xl p-4 flex flex-col relative overflow-hidden">
                  <span className="absolute top-2 right-2 text-[8px] font-mono text-gray-600 font-bold">LIVE LAYOUT PREVIEW</span>
                  
                  <div className="flex flex-col" style={{ gap: `${marginSize}px` }}>
                    <div
                      className="bg-purple-600/15 border border-purple-500/30 text-center rounded-lg transition-all"
                      style={{ padding: `${paddingSize}px 16px` }}
                    >
                      <h4 className="font-display text-xs font-black text-white">Interactive Title Block</h4>
                      <p className="text-[10px] text-purple-300 mt-1">Adjust sliders above to feel the spacing difference!</p>
                    </div>

                    <div
                      className="bg-[#111111] border border-white/5 text-center rounded-lg transition-all"
                      style={{ padding: `${paddingSize}px 16px` }}
                    >
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Secondary Content Area</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-purple-950/20 rounded-2xl border border-purple-500/10 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                  <Lightbulb className="w-5 h-5 fill-purple-400/20" />
                </div>
                <p className="text-xs md:text-sm text-gray-400 italic leading-relaxed">
                  {lessonLoading
                    ? "Loading a mentor insight for this concept..."
                    : `"${lessonContent?.mentorQuote}" — AI Mentor Lesson Highlight`}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Right Sandbox Interactive Panel (6 Columns) */}
        <section className="lg:col-span-6 flex flex-col gap-5 overflow-y-auto lg:h-full">
          
          <div className="p-6 md:p-8 rounded-3xl bg-[#0f172a]/60 border border-white/5 flex flex-col gap-6 flex-grow">
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-display text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  {lessonLoading ? "Practice Exercise" : lessonContent?.practiceTitle}
                </h2>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[9px] font-bold rounded">
                  LEVEL: INTERMEDIATE
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {lessonLoading
                  ? "Loading a tailored practice exercise..."
                  : lessonContent?.practiceDescription}
              </p>
            </div>

            {/* Simulated Interactive drag / click ordering console */}
            <div className="flex-grow bg-[#050b18] border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[300px]">
              
              {/* Dot blueprint grid backing */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

              <div className="w-full max-w-sm space-y-3 z-10">
                {tiles.map((tile, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === tiles.length - 1;

                  return (
                    <div
                      key={tile.id}
                      className={`w-full p-3.5 rounded-xl border bg-gradient-to-r ${tile.color} flex items-center justify-between transition-all duration-300 relative group`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-gray-500 font-bold shrink-0">
                          {idx + 1}.
                        </span>
                        
                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
                          <Layers className="w-4 h-4" />
                        </div>

                        <span className="font-display text-xs md:text-sm font-bold text-white uppercase tracking-wide">
                          {tile.name}
                        </span>
                      </div>

                      {/* Direction arrow controls */}
                      <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveTile(idx, "up")}
                          disabled={isFirst || answeredState === "correct"}
                          className={`p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer`}
                          title="Move Item Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveTile(idx, "down")}
                          disabled={isLast || answeredState === "correct"}
                          className={`p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer`}
                          title="Move Item Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Answer Feedbacks area */}
            {answeredState === "correct" && (
              <div className="p-4.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-3.5 animate-scale-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#00f1ab]" />
                <div>
                  <h4 className="font-display font-black text-white mb-0.5">Hierarchy Code Sequence Perfect!</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Splendid alignment! The visual tree starts with the <span className="text-white font-bold">Header</span> (Navigation), directly followed by the high impact <span className="text-white font-bold">Hero Section</span>, expanding downstream into detail with the <span className="text-white font-bold">Feature Grid</span>, and capping structural metadata in the <span className="text-white font-bold">Footer</span>.
                  </p>
                </div>
              </div>
            )}

            {answeredState === "incorrect" && (
              <div className="p-4.5 rounded-2xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs flex items-start gap-3.5 animate-bounce-subtle">
                <Undo2 className="w-5 h-5 shrink-0 text-red-400 cursor-pointer hover:rotate-45 transition-transform" onClick={handleReset} />
                <div className="flex-grow">
                  <h4 className="font-display font-black text-white mb-0.5">Incorrect Alignment sequence!</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Double check the logical flowing order. (Hint: Navigation / Header belongs at the very top, while Copyright details belong at the bottom).
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-[10px] text-purple-400 hover:underline font-bold uppercase tracking-wider"
                  >
                    Reset & try again
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/10">
                  <Lightbulb className="w-4 h-4 fill-purple-400/20" />
                </div>
                <div>
                  <p className="font-display font-bold text-xs text-white">Need a Hint?</p>
                  <p className="text-[10px] text-gray-500">{lessonContent?.hintText || "Correctly align sections from top (1) to bottom (4)"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                {answeredState === "correct" ? (
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 text-[#042f1a] rounded-xl font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Finish Lesson
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCheckAnswer}
                    className="w-full sm:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-display text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-600/20 cursor-pointer"
                  >
                    Check Answer
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


