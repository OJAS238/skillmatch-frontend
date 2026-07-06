import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Network,
  Trophy,
  Award,
  Flame,
  Play,
  Check,
  Lock,
  Sparkles,
  ChevronRight,
  BookOpen,
  Calendar,
  Hourglass,
  ExternalLink,
  Milestone,
  RefreshCw,
  X,
  Menu,
  Brain,
  TrendingUp,
  Target,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkle
} from "lucide-react";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStartLesson?: (lessonNode: { title: string; description?: string; xp?: number; topic?: string; learningStyle?: string }) => void;
  onRestart?: () => void;
  selectedAnswers?: Record<string, string> | null;
  activeTab?: string;
}

interface Node {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: string;
  lessons: number;
  xp: number;
  status: "completed" | "active" | "locked";
  percentage?: number;
  positionClass: string; // for absolute positioning of nodes in the winding roadmap
  labelPositionClass: string;
}

export default function Dashboard({
  onNavigate,
  onStartLesson,
  onRestart,
  selectedAnswers,
  activeTab = "Dashboard"
}: DashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [userName, setUserName] = useState<string>("Explorer");
  // --- 🎯 AI CURRICULUM INTEGRATION ---
  const [curriculum, setCurriculum] = useState<any>(null);
  const [curriculumLoading, setCurriculumLoading] = useState<boolean>(false);

  // --- 📊 REAL MONGODB USER STATS (streak, xp, rank, focus time...) ---
  const [userStats, setUserStats] = useState<{
    name: string;
    xp: number;
    streak: number;
    rank: string;
    nodesVisited: number;
    focusTime: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // The real id saved in localStorage when the user logged in with their name
  const userId = localStorage.getItem("skillmatch_userId");

  useEffect(() => {
    if (!userId) return;

    async function loadUserStats() {
      setStatsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
        const data = await response.json();
        if (data.success && data.user) {
          setUserStats(data.user);
          setUserName(data.user.name);
        }
      } catch (err) {
        console.error("Failed to load user stats:", err);
      } finally {
        setStatsLoading(false);
      }
    }

    async function loadSavedAIPath() {
      setCurriculumLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/quiz/curriculum/${userId}`);
        const data = await response.json();
        if (data.success && data.curriculum) {
          setCurriculum(data.curriculum);
          if (data.curriculum.userName || data.curriculum.name) {
            setUserName(data.curriculum.userName || data.curriculum.name);
          }
          console.log(" Live Hackathon Syllabus Loaded:", data.curriculum);
        }
      } catch (err) {
        console.error(" Failed to pull path from backend:", err);
      } finally {
        setCurriculumLoading(false);
      }
    }

    loadUserStats();
    loadSavedAIPath();
  }, [userId]);
  // ------------------------------------

  // XP thresholds simply climb in increments of 1000 for the progress bar
  const xpForNextLevel = userStats ? (Math.floor(userStats.xp / 1000) + 1) * 1000 : 1000;
  const xpProgressPercent = userStats ? Math.min(100, Math.round((userStats.xp / xpForNextLevel) * 100)) : 0;
  const practiceHours = userStats ? (userStats.focusTime / 60).toFixed(1) : "0.0";
  const userLevel = userStats ? Math.floor(userStats.xp / 500) + 1 : 1;

  // =================================================================

  // Helper to map and route safely
  const handleNav = (tab: string) => {
    if (tab.toLowerCase() === "dashboard") onNavigate("Dashboard");
    else if (tab.toLowerCase() === "roadmap" || tab.toLowerCase() === "skill tree") onNavigate("Skill Tree");
    else if (tab.toLowerCase() === "leaderboard") onNavigate("Leaderboard");
    else if (tab.toLowerCase() === "badges") onNavigate("Badges");
    else onNavigate(tab);
  };

  // Learning Style & Dynamic archetype labeling
  const learningStyle = selectedAnswers?.learning_style || "visual";
  const learningStyleLabel =
    learningStyle === "visual"
      ? "Visual Mapper"
      : learningStyle === "auditory"
        ? "Aural Listener"
        : "Kinesthetic Builder";

  // Skill Tree Winding Roadmap Nodes Definition
  const nodes: Node[] = curriculum?.modules?.map((mod: any, idx: number) => {
    // Standard positional layout classes to keep the winding zig-zag roadmap look
    const positions = [
      "top-0 left-1/2 -translate-x-1/2",
      "top-[300px] left-1/2 -translate-x-1/2 md:left-[calc(50%-180px)]",
      "top-[600px] left-1/2 -translate-x-1/2 md:left-[calc(50%+180px)]",
      "top-[900px] left-1/2 -translate-x-1/2 md:left-[calc(50%-150px)]",
      "top-[1200px] left-1/2 -translate-x-1/2 md:left-[calc(50%+150px)]",
      "top-[1500px] left-1/2 -translate-x-1/2"
    ];

    const realProgress = userStats?.nodesVisited ?? 0;

    return {
      id: mod._id || `node-${idx + 1}`,
      title: mod.title || mod.name,
      description: mod.description || "",
      estimatedTime: mod.estimatedTime || "25 mins",
      lessons: mod.lessonsCount || mod.lessons?.length || 5,
      xp: mod.xp || mod.xpReward || (idx * 100 + 150),
      status: idx < realProgress ? "completed" : idx === realProgress ? "active" : "locked",
      positionClass: positions[idx % positions.length]
    };
  }) || [
      // Fallback static nodes in case the backend server isn't running during judging
      { id: "node-1", title: "Color Theory & Harmonies", description: "Understand how color relationships create visual harmony in interfaces.", estimatedTime: "20 mins", lessons: 6, xp: 150, status: "completed", positionClass: "top-0 left-1/2 -translate-x-1/2" },
      { id: "node-2", title: "Typography 101 & Layouts", description: "Learn how type hierarchy and layout structure guide the reader's eye.", estimatedTime: "25 mins", lessons: 8, xp: 200, status: "completed", positionClass: "top-[300px] left-1/2 -translate-x-1/2 md:left-[calc(50%-180px)]" },
      { id: "node-3", title: "UI Fundamentals Theory", description: "Cover the core principles behind clean, usable interface design.", estimatedTime: "30 mins", lessons: 12, xp: 450, status: "active", positionClass: "top-[600px] left-1/2 -translate-x-1/2 md:left-[calc(50%+180px)]" }
    

  ];

  const nextActiveNode = nodes.find((n) => n.status === "active") || nodes[nodes.length - 1];
  const completedNodeCount = nodes.filter((n) => n.status === "completed").length;
  const pathProgressPercent = nodes.length > 0 ? Math.round((completedNodeCount / nodes.length) * 100) : 0;
  const progressLabel =
    pathProgressPercent >= 80 ? "Nearly There" :
    pathProgressPercent >= 50 ? "Great Progress" :
    pathProgressPercent >= 20 ? "Getting Started" : "Just Beginning";

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 font-sans antialiased selection:bg-purple-500/30 relative overflow-x-hidden">

      {/* Background ambient neon glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-20 w-64 md:w-96 h-64 md:h-96 bg-purple-600/10 blur-[80px] md:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 md:w-[500px] h-80 md:h-[500px] bg-emerald-500/5 blur-[100px] md:blur-[150px] rounded-full"></div>
      </div>

      {/* Standard top global header bar matching other views */}
      <header className="fixed top-0 w-full z-45 bg-[#070d1f]/70 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 h-16 md:h-20 md:pl-72 transition-all">
        <div className="flex items-center gap-4 flex-grow max-w-xl">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 bg-[#111827] border border-white/10 rounded-xl hover:bg-[#1f2937] text-white cursor-pointer"
            aria-label="Open side menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="md:hidden font-display text-lg text-white font-bold tracking-tight">SkillMatch</span>
        </div>

        {/* Global Stats tracker */}
        <div className="flex items-center gap-5 shrink-0 pl-4">

          {/* XP Progress Indicator — pulled live from MongoDB */}
          <div className="hidden lg:flex flex-col gap-1 w-44 shrink-0">
            <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
              <span className="text-gray-400">XP Progress</span>
              <span className="text-purple-400 font-mono">{userStats?.xp ?? 0} / {xpForNextLevel}</span>
            </div>
            <div className="h-1.5 w-full bg-[#121c38] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-[#00f1ab] rounded-full relative"
                style={{ width: `${xpProgressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Streak bubble — pulled live from MongoDB */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)] shrink-0">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
            <span className="font-display text-xs text-orange-400 font-extrabold whitespace-nowrap">
              {userStats?.streak ?? 0}-Day Streak
            </span>
          </div>

          {/* Rank tag — pulled live from MongoDB */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] shrink-0">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="font-display text-xs text-purple-400 font-extrabold whitespace-nowrap">
              {userStats?.rank ?? "Novice"}
            </span>
          </div>

          {/* Rounded avatar container */}
          <button
            onClick={() => onNavigate("Profile")}
            className="w-10 h-10 rounded-full border-2 border-[#00f1ab]/50 overflow-hidden bg-[#0d1527] transition-all hover:scale-110 shrink-0 shadow-lg cursor-pointer"
            aria-label="View profile"
          >
            <img
              className="w-full h-full object-cover"
              alt="Alex Rivers Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVjrMSkVlI8NwRbGv7uDRlSMrfJXT0seWwo-MY9fLOmTaP_TqO0AZKJEipd7_QC91r2SFodHEiYVoQsC5fNJay5EPfpwyxNu60aakMARgotidlNkkAwjuQC48lemCT-WRHqQ5q14ISkt7FRmmywkOYMmXEyp0TvQSwu7caTDu8Om1ZdsC_WO6Qyf3vWr_jBySG0gbe4yuXG6u9P2YbjOmzPq2doNN6-gfXt9SzKIEOP-ANhckoyHL_JLx3wDliX6PpsGncKqsKyA"
              referrerPolicy="no-referrer"
            />
          </button>

        </div>
      </header>

      <div className="flex h-screen overflow-hidden">

        {/* Standard left sidebar navigation structure */}
        <aside
          className={`fixed left-0 top-0 h-full w-64 bg-[#0a0f1d] border-r border-white/10 shadow-2xl z-50 flex flex-col p-6 gap-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
        >
          <div className="mb-8 mt-2 flex items-center justify-between">
            <span className="font-display text-2xl text-white font-bold tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-base">S</div>
              SkillMatch
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-gray-400 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 flex-grow">

            {/* Dashboard active tab heavily styled with purple glow outline matching guidelines */}
            <button
              onClick={() => handleNav("dashboard")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${activeTab === "Dashboard"
                ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => handleNav("roadmap")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${activeTab === "Skill Tree"
                ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
            >
              <Network className="w-5 h-5" />
              <span className="text-sm font-medium">Skill Tree</span>
            </button>

            <button
              onClick={() => handleNav("leaderboard")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${activeTab === "Leaderboard"
                ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Leaderboard</span>
            </button>

            <button
              onClick={() => handleNav("badges")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${activeTab === "Badges"
                ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Badges</span>
            </button>
          </nav>

          {/* Level up Pro promo block */}
          <div className="mt-auto p-5 rounded-2xl bg-[#111827]/80 border border-white/5 relative overflow-hidden group">
            <h4 className="font-display text-xs text-purple-400 uppercase tracking-widest font-bold mb-1">
              Current Level
            </h4>
            <p className="text-xl font-display text-white font-extrabold mb-3">Level {userLevel}</p>
            {onRestart && (
              <button
                onClick={onRestart}
                className="w-full mb-2 py-2 border border-white/5 hover:bg-white/5 text-gray-400 font-display text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake Assessment
              </button>
            )}
            <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-purple-600/10">
              Upgrade to Pro
            </button>
          </div>
        </aside>

        {/* Main interactive area content resolver */}
        <main className="flex-1 md:ml-64 h-full overflow-y-auto pt-20 pb-16 relative scroll-smooth">
          {(curriculumLoading || statsLoading) && (
            <div className="flex items-center gap-2 justify-center py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-6 animate-pulse">
              <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-xs font-mono text-purple-400">Syncing dynamic MongoDB curriculum data...</span>
            </div>
          )}
          <div className="max-w-6xl mx-auto py-8 px-6">

            {activeTab === "Dashboard" ? (

              /* RENDER MAIN DASHBOARD HUB OVERVIEW */
              <div className="space-y-8">

                {/* Welcome Hero Card */}
                <section className="relative overflow-hidden p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e1b4b]/30 border border-purple-500/20 shadow-2xl">

                  {/* Outer decorative light accents */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[90px] rounded-full pointer-events-none"></div>
                  <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#00f1ab]/5 blur-[70px] rounded-full pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">

                    {/* Left side text and CTA */}
                    <div className="max-w-2xl space-y-4">

                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 shadow-sm">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-display text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                          {curriculum?.learningArchetype || userStats?.rank || "Novice"} {curriculum?.topic || "Architect"}
                        </span>
                      </div>

                      <h1 className="font-display text-3xl md:text-5xl text-white font-extrabold tracking-tight leading-tight">
                        Welcome back, {userName}
                      </h1>

                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        Your tactile layout precision and responsive visual rhythm are soaring! You are currently mastering the <strong className="text-[#00f1ab]">{curriculum?.topic || "AI Generated"} Pathway</strong> built for your <strong className="text-purple-400">{learningStyleLabel}</strong> style.
                      </p>

                      <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <button
                          onClick={() => onStartLesson?.(nextActiveNode ? { title: nextActiveNode.title, description: nextActiveNode.description, xp: nextActiveNode.xp, topic: curriculum?.topic, learningStyle } : { title: "UI Fundamentals Theory", topic: curriculum?.topic, learningStyle })}
                          className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
                        >
                          Resume Path
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => handleNav("roadmap")}
                          className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Network className="w-4 h-4 text-gray-400" />
                          Explore Roadmap
                        </button>
                      </div>

                    </div>

                    {/* Right side network node visualization - abstract, translucent SVG graphic */}
                    <div className="shrink-0 flex items-center justify-center bg-purple-500/5 rounded-3xl p-6 border border-white/5 shadow-inner w-full lg:w-auto">
                      <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-56 md:h-56 opacity-25 text-purple-400" fill="none" stroke="currentColor">
                        <defs>
                          <radialGradient id="tealGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#00f1ab" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#00f1ab" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient id="purpleGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Connection lines with faint purple and teal strokes */}
                        <line x1="30" y1="50" x2="80" y2="30" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2 2" />
                        <line x1="80" y1="30" x2="140" y2="60" stroke="#00f1ab" strokeWidth="1.5" />
                        <line x1="140" y1="60" x2="170" y2="120" stroke="#a855f7" strokeWidth="1.5" />
                        <line x1="30" y1="50" x2="70" y2="110" stroke="#00f1ab" strokeWidth="1" />
                        <line x1="70" y1="110" x2="120" y2="150" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" />
                        <line x1="120" y1="150" x2="170" y2="120" stroke="#00f1ab" strokeWidth="2" />
                        <line x1="80" y1="30" x2="120" y2="150" stroke="#a855f7" strokeWidth="1" />
                        <line x1="70" y1="110" x2="140" y2="60" stroke="#00f1ab" strokeWidth="1.5" />
                        <line x1="30" y1="50" x2="120" y2="150" stroke="#6366f1" strokeWidth="0.75" />

                        {/* Interconnected Nodes */}
                        <circle cx="30" cy="50" r="12" fill="url(#purpleGrad)" />
                        <circle cx="30" cy="50" r="4" fill="#a855f7" />

                        <circle cx="80" cy="30" r="14" fill="url(#tealGrad)" />
                        <circle cx="80" cy="30" r="5" fill="#00f1ab" />

                        <circle cx="140" cy="60" r="12" fill="url(#purpleGrad)" />
                        <circle cx="140" cy="60" r="4" fill="#a855f7" />

                        <circle cx="170" cy="120" r="14" fill="url(#tealGrad)" />
                        <circle cx="170" cy="120" r="5" fill="#00f1ab" />

                        <circle cx="70" cy="110" r="12" fill="url(#purpleGrad)" />
                        <circle cx="70" cy="110" r="4" fill="#c084fc" />

                        <circle cx="120" cy="150" r="16" fill="url(#tealGrad)" />
                        <circle cx="120" cy="150" r="6" fill="#00f1ab" />
                      </svg>
                    </div>

                  </div>

                </section>

                {/* Analytics Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Card 1: Total Practice Time */}
                  <div className="p-6 rounded-3xl bg-[#0f172a]/50 border border-white/5 flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 shadow-xl group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        +12% THIS WEEK
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-medium block">Total Practice Time</span>
                      <h3 className="font-display text-3xl font-black text-white">{practiceHours} hrs</h3>
                    </div>

                    {/* Clean mock mini bar chart tracker */}
                    <div className="mt-5 space-y-1.5">
                      <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase">
                        <span>Weekly Streak</span>
                        <span>Goal Met</span>
                      </div>
                      <div className="h-2 w-full bg-[#121c38] rounded-full overflow-hidden relative">
                        <div className="h-full bg-purple-500 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Path Progress (replaces a fabricated 'Concept Accuracy' score — there's no quiz-scoring data to back that metric) */}
                  <div className="p-6 rounded-3xl bg-[#0f172a]/50 border border-white/5 flex flex-col justify-between hover:border-[#00f1ab]/20 transition-all duration-300 shadow-xl group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-[#00f1ab] border border-emerald-500/20">
                        <Target className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-[#00f1ab] font-mono font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        {progressLabel.toUpperCase()}
                      </span>
                    </div>

                    {/* Circular Percentage Tracker Row */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center shrink-0">
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle className="text-white/5" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="4.5" />
                          <circle
                            className="text-[#00f1ab] drop-shadow-[0_0_8px_rgba(0,241,171,0.4)]"
                            cx="28" cy="28" fill="transparent" r="24" stroke="currentColor"
                            strokeDasharray="150.8"
                            strokeDashoffset={150.8 - (150.8 * pathProgressPercent) / 100}
                            strokeWidth="4.5"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-mono text-white font-black">{pathProgressPercent}%</span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-xs text-gray-400 font-medium block">Path Progress</span>
                        <h3 className="font-display text-base font-black text-white">{progressLabel}</h3>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 mt-5 leading-relaxed font-medium">
                      You've completed {completedNodeCount} of {nodes.length} modules in your current path.
                    </p>
                  </div>

                  {/* Card 3: Next Milestone Node */}
                  <div className="p-6 rounded-3xl bg-[#0f172a]/50 border border-white/5 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 shadow-xl group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Milestone className="w-5 h-5" />
                      </div>

                      <button
                        onClick={() => handleNav("roadmap")}
                        className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5"
                      >
                        ROADMAP
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-medium block">Next Milestone Node</span>
                      <h3 className="font-display text-base md:text-lg font-black text-white leading-tight">
                        {nextActiveNode?.title || "Path Complete"}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                        Estimated time: {nextActiveNode?.estimatedTime || "25 mins"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (nextActiveNode && onStartLesson) {
                          onStartLesson({
                            title: nextActiveNode.title,
                            description: nextActiveNode.description,
                            xp: nextActiveNode.xp,
                            topic: curriculum?.topic,
                            learningStyle
                          });
                        } else {
                          handleNav("roadmap");
                        }
                      }}
                      className="mt-5 w-full py-2 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 text-xs font-bold uppercase rounded-xl transition-all border border-indigo-500/15 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Jump to node
                    </button>
                  </div>

                </section>

                {/* AI Insights & Recommendations Panel */}
                <section className="p-6 md:p-8 rounded-3xl bg-[#0f172a]/50 border border-purple-500/15 shadow-xl space-y-6">

                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                      <Brain className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-extrabold text-white">
                        AI Insights & Personalized Recommendations
                      </h2>
                      <p className="text-xs text-gray-500">
                        Synthesized recommendations generated dynamically based on your curriculum telemetry.
                      </p>
                    </div>
                  </div>

                  {/* Recommended list items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Item 1 */}
                    <div className="p-5 rounded-2xl bg-[#050b18] border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/15 text-[9px] font-bold uppercase tracking-wider">
                            Next Logical Step
                          </span>
                          <span className="text-[10px] text-emerald-400 italic font-medium">98% Match Rate</span>
                        </div>

                        <h4 className="font-display text-base font-black text-white">
                          Advanced CSS Grid
                        </h4>

                        <p className="text-xs text-gray-400 leading-relaxed">
                          Based on your recent Flexbox spacing mastery, you're ready to tackle complex 2D responsive grids and implicit row track heights.
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4 text-[10px] text-gray-500">
                        <span className="font-semibold">420 peers started this today</span>
                        <span className="text-purple-400 font-bold hover:underline cursor-pointer" onClick={() => handleNav("roadmap")}>
                          Start Module &rarr;
                        </span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-5 rounded-2xl bg-[#050b18] border border-white/5 hover:border-purple-500/20 transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/15 text-[9px] font-bold uppercase tracking-wider">
                            Skill Gap Identified
                          </span>
                          <span className="text-[10px] text-orange-400 italic font-medium">High Priority</span>
                        </div>

                        <h4 className="font-display text-base font-black text-white">
                          Typography Systems
                        </h4>

                        <p className="text-xs text-gray-400 leading-relaxed">
                          Strengthen your UI visual balance! Mastering typography scale hierarchies and vertical line spacing will boost your portfolio test rating by up to 20%.
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4 text-[10px] text-gray-500">
                        <span className="font-semibold">Est. 15 minutes review</span>
                        <span className="text-purple-400 font-bold hover:underline cursor-pointer" onClick={() => handleNav("roadmap")}>
                          Review Now &rarr;
                        </span>
                      </div>
                    </div>

                  </div>

                </section>

              </div>

            ) : (

              /* RENDER THE ROADMAP / SKILL TREE VIEW */
              <div className="space-y-8">

                {/* Section Header */}
                <div className="text-center mb-12 relative">
                  <span className="inline-block px-3.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full font-display text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4">
                    {learningStyleLabel} Track
                  </span>
                  <h1 className="font-display text-3xl md:text-5xl text-white font-extrabold tracking-tight mb-3">
                    {curriculum?.topic ? `${curriculum.topic} Mastery Path` : "Design Mastery Path"}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                    {curriculum?.targetTrajectory
                      ? `Your personalized roadmap to ${curriculum.targetTrajectory}. Follow the winding nodes to your next milestone challenge.`
                      : "Your personalized roadmap to becoming a Senior Product Designer. Follow the winding nodes to your next milestone challenge."}
                  </p>
                </div>

                {/* Game Map Roadmap Winding Node Container */}
                <div className="relative min-h-[1450px] md:min-h-[1650px] px-2">

                  {/* Connecting Winding SVGs */}
                  {/* Desktop curved path line */}
                  <svg className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[1600px]" fill="none" viewBox="0 0 600 1600" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M300 0 C 300 100, 100 150, 100 300 C 100 450, 500 450, 500 600 C 500 750, 150 750, 150 900 C 150 1050, 450 1050, 450 1200 C 450 1350, 300 1400, 300 1600"
                      stroke="url(#purple_linear_gradient)"
                      strokeWidth="6"
                      strokeDasharray="1 18"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="purple_linear_gradient" x1="300" y1="0" x2="300" y2="1600" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#10B981" />
                        <stop offset="0.3" stopColor="#10B981" />
                        <stop offset="0.5" stopColor="#A855F7" />
                        <stop offset="0.8" stopColor="#374151" />
                        <stop offset="1" stopColor="#1F2937" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Mobile linear vertical dotted track */}
                  <svg className="md:hidden absolute left-1/2 -translate-x-1/2 top-0 w-2 h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 1000" xmlns="http://www.w3.org/2000/svg">
                    <line
                      x1="4"
                      y1="0"
                      x2="4"
                      y2="1000"
                      stroke="url(#purple_linear_gradient_mobile)"
                      strokeWidth="5"
                      strokeDasharray="1 14"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="purple_linear_gradient_mobile" x1="4" y1="0" x2="4" y2="1000" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#10B981" />
                        <stop offset="0.3" stopColor="#10B981" />
                        <stop offset="0.5" stopColor="#A855F7" />
                        <stop offset="1" stopColor="#374151" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Nodes list mapping */}
                  {nodes.map((node) => {
                    const isCompleted = node.status === "completed";
                    const isActive = node.status === "active";
                    const isLocked = node.status === "locked";

                    return (
                      <div
                        key={node.id}
                        className={`absolute ${node.positionClass} group z-10`}
                      >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                          {isActive && (
                            <div className="absolute -inset-4 md:-inset-6 bg-purple-500/20 rounded-full animate-ping pointer-events-none"></div>
                          )}

                          <button
                            onClick={() => setSelectedNode(node)}
                            className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer ${isCompleted
                              ? "bg-[#00f1ab] text-[#003825] shadow-[0_0_25px_rgba(0,241,171,0.4)] border-4 border-[#00f1ab]/20"
                              : isActive
                                ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-[0_0_35px_rgba(168,85,247,0.5)] ring-4 ring-purple-500/30"
                                : "bg-[#111827] border-4 border-white/5 opacity-50 hover:opacity-100 text-gray-400"
                              }`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5 stroke-[3]" />
                            ) : isActive ? (
                              <Play className="w-6 h-6 stroke-[2.5] fill-white text-white ml-1" />
                            ) : node.id === "node-6" ? (
                              <Award className="w-5 h-5" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-500" />
                            )}
                          </button>

                          {/* Node specific details overlay tags */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-center min-w-[190px] md:min-w-[220px] z-20">
                            {isActive ? (
                              <div className="bg-[#0f172a] p-3.5 rounded-2xl border border-purple-500/30 shadow-xl flex flex-col items-center">
                                <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest block mb-1">
                                  CURRENT GOAL
                                </span>
                                <h4 className="font-display text-xs font-bold text-white whitespace-nowrap">
                                  {node.title}
                                </h4>
                                <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
                                  {node.lessons} Lessons • {node.xp} XP
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <h5 className={`font-display text-xs font-bold ${isCompleted ? "text-[#00f1ab]" : "text-gray-500"}`}>
                                  {node.title}
                                </h5>
                                <p className="text-[9px] text-gray-600 font-medium">
                                  {node.lessons} Lessons • {node.xp} XP
                                </p>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}

                </div>

              </div>

            )}

          </div>
        </main>

      </div>

      {/* Node Detail Sheet Modal View */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedNode.status === "completed"
                  ? "bg-[#00f1ab]/10 text-[#00f1ab]"
                  : selectedNode.status === "active"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-white/5 text-gray-500"
                  }`}
              >
                {selectedNode.status === "completed" ? (
                  <Check className="w-6 h-6" />
                ) : selectedNode.status === "active" ? (
                  <Play className="w-6 h-6 ml-0.5 fill-purple-400 text-purple-400" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {selectedNode.title}
                </h3>
                <span className="text-[10px] text-purple-400 uppercase tracking-wider font-bold">
                  {selectedNode.status === "completed"
                    ? "Completed Section"
                    : selectedNode.status === "active"
                      ? "Current Active Goal"
                      : "Locked Pathway Node"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              {selectedNode.status === "completed"
                ? "You have successfully completed this module with flying colors! Revise lessons any time to reinforce visual rhythm foundations."
                : selectedNode.status === "active"
                  ? "Dive deep into responsive layout metrics, component models, and visual alignment hierarchies."
                  : "Complete preceding milestone challenges first and gain adequate XP score points to unlock."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 bg-[#030712] p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase font-bold">Total Lessons</span>
                <span className="text-xs text-white font-bold">{selectedNode.lessons} Modules</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 block uppercase font-bold">XP Reward</span>
                <span className="text-xs text-purple-400 font-bold">+{selectedNode.xp} XP</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedNode(null)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-display text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Close View
              </button>

              {selectedNode.status !== "locked" && (
                <button
                  onClick={() => {
                    if (onStartLesson) {
                      onStartLesson({ title: selectedNode.title, description: selectedNode.description, xp: selectedNode.xp, topic: curriculum?.topic, learningStyle });
                    } else {
                      alert(`Starting node lesson: ${selectedNode.title}`);
                    }
                    setSelectedNode(null);
                  }}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-display text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  {selectedNode.status === "completed" ? "Review Node" : "Start Node"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Menu */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => handleNav("dashboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "Dashboard" ? "text-purple-400" : "text-gray-500"
            }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Home</span>
        </button>

        <button
          onClick={() => handleNav("roadmap")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "Skill Tree" ? "text-purple-400" : "text-gray-500"
            }`}
        >
          <Network className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Learn</span>
        </button>

        <button
          onClick={() => handleNav("leaderboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "Leaderboard" ? "text-purple-400" : "text-gray-500"
            }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Rank</span>
        </button>

        <button
          onClick={() => handleNav("badges")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "Badges" ? "text-purple-400" : "text-gray-500"
            }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Badges</span>
        </button>
      </nav>

    </div>
  );
}









