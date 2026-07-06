import { useState } from "react";
import { API_BASE_URL } from "./config";
import Assessment from "./components/Assessment";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import FocusLesson from "./components/FocusLesson";
import Badges from "./components/Badges";
import Profile from "./components/Profile";
import AuthPage from "./components/AuthPage";
import { Sparkles, Network, RefreshCw, CheckCircle2, Award, Zap, BookOpen, Layers } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("skillmatch_token") && !!localStorage.getItem("skillmatch_userId");
  });
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, string> | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState("Skill Tree");
  const [activeLessonNode, setActiveLessonNode] = useState<{ title: string; description?: string; xp?: number; topic?: string; learningStyle?: string } | null>(null);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);

  const handleAssessmentComplete = async (answers: Record<string, string>) => {
    console.log("Assessment completed with answers:", answers);
    setCompletedAnswers(answers);
    setIsGeneratingPath(true);

    // Send answers to backend to generate personalized curriculum
    try {
      const userId = localStorage.getItem("skillmatch_userId");
      if (!userId) {
        console.error("No logged-in user found — please sign in again.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          topic: answers.course_track || "React",
          learningStyle: answers.learning_style || "Visual",
          pacingPreference: answers.commitment || "Casual (15m)",
          answers
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log("Curriculum generated successfully:", data.curriculum);
        // Dashboard will fetch the freshly generated curriculum on next load
      } else {
        console.error("Failed to generate curriculum:", data.message);
      }
    } catch (err) {
      console.error("Error generating curriculum:", err);
    } finally {
      setIsGeneratingPath(false);
    }
  };

  const handleRestart = () => {
    setCompletedAnswers(null);
    setShowDashboard(false);
    setActiveTab("Skill Tree");
    setActiveLessonNode(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("skillmatch_token");
    localStorage.removeItem("skillmatch_userId");
    setIsAuthenticated(false);
    handleRestart();
  };

  // Helper to resolve user-friendly labels for selected options
  const getStyleLabel = (style: string) => {
    switch (style) {
      case "visual": return "Visual Mapper";
      case "auditory": return "Aural Listener";
      case "kinesthetic": return "Kinesthetic Builder";
      default: return "Adaptive Learner";
    }
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case "career": return "Career Transformation";
      case "mastery": return "Engineering Craft Mastery";
      case "hobby": return "Indie App Creation";
      default: return "Skill Enrichment";
    }
  };

  const getCommitmentLabel = (commit: string) => {
    switch (commit) {
      case "casual": return "15 Mins / Day (Sustained)";
      case "focused": return "45 Mins / Day (Optimal)";
      case "intense": return "2 Hours+ / Day (Sprint)";
      default: return "Self-Paced";
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthPage 
        onAuthSuccess={({ name, email }) => {
          if (name) localStorage.setItem("skillmatch_username", name);
          if (email) localStorage.setItem("skillmatch_useremail", email);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-gray-200 font-sans">
      {!completedAnswers ? (
        <Assessment onComplete={handleAssessmentComplete} />
      ) : activeLessonNode ? (
        <FocusLesson lessonNode={activeLessonNode} onClose={() => setActiveLessonNode(null)} />
      ) : showDashboard ? (
        activeTab === "Leaderboard" ? (
          <Leaderboard
            onNavigate={setActiveTab}
            onRestart={handleRestart}
            selectedAnswers={completedAnswers}
            activeTab={activeTab}
          />
        ) : activeTab === "Badges" ? (
          <Badges
            onNavigate={setActiveTab}
            onRestart={handleRestart}
            selectedAnswers={completedAnswers}
            activeTab={activeTab}
          />
        ) : activeTab === "Profile" ? (
          <Profile
            onNavigate={setActiveTab}
            onRestart={handleRestart}
            onSignOut={handleSignOut}
            selectedAnswers={completedAnswers}
            activeTab={activeTab}
          />
        ) : (
          <Dashboard
            onRestart={handleRestart}
            selectedAnswers={completedAnswers}
            activeTab={activeTab}
            onNavigate={setActiveTab}
            onStartLesson={(lessonNode) => setActiveLessonNode(lessonNode)}
          />
        )
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Ambient decorative glowing blobs */}
          <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl relative text-center">
            
            {/* Animated Glow Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>

            <span className="font-display text-[11px] text-purple-400 uppercase tracking-widest font-bold bg-purple-600/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
              Assessment Complete
            </span>

            <h1 className="font-display text-3xl md:text-5xl text-white font-extrabold tracking-tight mt-4 mb-3">
              Skill Tree Unlocked!
            </h1>
            
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
              Congratulations Alex, your learning style preferences have been processed! We've structured a bespoke learning tree tailored to your preferences.
            </p>

            {/* Genome Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
              <div className="p-4 rounded-2xl bg-[#121212] border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Learning Archetype</span>
                <span className="text-white font-display text-sm font-semibold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  {getStyleLabel(completedAnswers.learning_style)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121212] border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Target Trajectory</span>
                <span className="text-white font-display text-sm font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  {getGoalLabel(completedAnswers.primary_goal)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121212] border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Pacing & Commitment</span>
                <span className="text-white font-display text-sm font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  {getCommitmentLabel(completedAnswers.commitment)}
                </span>
              </div>
            </div>

            {/* Generated Skill Tree Preview */}
            <div className="mb-10 p-6 rounded-2xl bg-[#121212] border border-white/5 text-left">
              <h3 className="text-purple-400 font-display text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Custom Learning Path Milestone Preview
              </h3>

              <div className="relative border-l border-white/10 pl-6 ml-2 space-y-6">
                
                {/* Node 1 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]"></span>
                  <h4 className="text-sm text-white font-bold font-display">Milestone 1: Core Fundamentals</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {completedAnswers.learning_style === "visual" && "Explore multi-dimensional visual flowcharts and architecture layout blueprints."}
                    {completedAnswers.learning_style === "auditory" && "Listen to highly detailed podcast breakdowns and live code-review walkthroughs."}
                    {completedAnswers.learning_style === "kinesthetic" && "Dive directly into sandboxed developer playgrounds with instant compiling tests."}
                  </p>
                </div>

                {/* Node 2 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></span>
                  <h4 className="text-sm text-white font-bold font-display">Milestone 2: Complex System Synthesis</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Synthesize complex components and optimize reactive states with state management models.
                  </p>
                </div>

                {/* Node 3 */}
                <div className="relative">
                  <span className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-purple-600"></span>
                  <h4 className="text-sm text-white font-bold font-display">Milestone 3: Production Scale & Deployment</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Launch highly resilient custom products with robust full-stack pipelines.
                  </p>
                </div>

              </div>
            </div>

            {/* Reset Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-display text-xs font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Restart Onboarding
              </button>
              
              <button
                onClick={() => setShowDashboard(true)}
                disabled={isGeneratingPath}
                className="w-full sm:w-auto px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPath ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Your Path...
                  </>
                ) : (
                  <>
                    Enter Your Dashboard
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}




