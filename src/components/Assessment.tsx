import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  LayoutDashboard,
  Network,
  Trophy,
  Award,
  Flame,
  Eye,
  Headphones,
  Wrench,
  Check,
  User,
  GraduationCap,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Menu,
  X,
  Layers,
  Server,
  Brain,
  Lock
} from "lucide-react";

interface AssessmentProps {
  onComplete: (answers: Record<string, string>) => void;
}

interface Question {
  id: string;
  questionText: string;
  subtitle: string;
  options: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[];
  footerTip: string;
}

interface UserStats {
  name: string;
  xp: number;
  rank: string;
  streak: number;
  nodesVisited: number;
  focusTime: number;
}

export default function Assessment({ onComplete }: AssessmentProps) {
  // Navigation sidebar state for responsive menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Skill Tree");

  // Multi-question onboarding flow state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // --- 📊 REAL MONGODB USER (for the sidebar profile card) ---
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const fallbackName = localStorage.getItem("skillmatch_username") || "Explorer";
  const userId = localStorage.getItem("skillmatch_userId");

  useEffect(() => {
    if (!userId) return;
    async function loadStats() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/user/${userId}`);
        const data = await response.json();
        if (data.success && data.user) {
          setUserStats(data.user);
        }
      } catch (err) {
        console.error("Failed to load user stats:", err);
      }
    }
    loadStats();
  }, [userId]);

  const displayName = userStats?.name || fallbackName;
  const userLevel = userStats ? Math.floor(userStats.xp / 500) + 1 : 1;
  const xpForNextLevel = userStats ? (Math.floor(userStats.xp / 1000) + 1) * 1000 : 1000;
  const xpProgressPercent = userStats ? Math.min(100, Math.round((userStats.xp / xpForNextLevel) * 100)) : 0;

  const questions: Question[] = [
    {
      id: "learning_style",
      questionText: "How do you learn best?",
      subtitle: "Tell us your preferred learning style so we can tailor your Skill Tree journey.",
      options: [
        {
          id: "visual",
          title: "Visual",
          description: "I learn best through diagrams, videos, and visual mapping of complex concepts.",
          icon: Eye,
          accentColor: "#45ffba"
        },
        {
          id: "auditory",
          title: "Auditory",
          description: "I prefer listening to lectures, podcasts, and participating in group discussions.",
          icon: Headphones,
          accentColor: "#d0bcff"
        },
        {
          id: "kinesthetic",
          title: "Kinesthetic",
          description: "I am a hands-on learner. I learn by doing, building, and physical experimentation.",
          icon: Wrench,
          accentColor: "#6d3bd7"
        }
      ],
      footerTip: "You're unlocking the 'Architect' path. Keep going!"
    },
    {
      id: "primary_goal",
      questionText: "What is your primary goal?",
      subtitle: "Aligning your curriculum with your personal and professional targets.",
      options: [
        {
          id: "career",
          title: "Career Pivot",
          description: "Unlocking direct practical expertise to secure a high-paying future-tech role.",
          icon: Sparkles,
          accentColor: "#45ffba"
        },
        {
          id: "mastery",
          title: "Skill Mastery",
          description: "Deepening theoretical knowledge and optimizing existing code craft.",
          icon: GraduationCap,
          accentColor: "#d0bcff"
        },
        {
          id: "hobby",
          title: "Creative Building",
          description: "Learning to stitch together ideas and craft indie applications or startups.",
          icon: LayoutDashboard,
          accentColor: "#6d3bd7"
        }
      ],
      footerTip: "This helps customize the difficulty curve for your path."
    },
    {
      id: "commitment",
      questionText: "How much time can you commit?",
      subtitle: "We'll build a daily learning streak to keep your dopamine loop active.",
      options: [
        {
          id: "casual",
          title: "Casual (15m)",
          description: "Quick daily practice bits. Perfect for staying sharp with low cognitive load.",
          icon: Clock,
          accentColor: "#45ffba"
        },
        {
          id: "focused",
          title: "Focused (45m)",
          description: "Balanced deep-dive sessions. Optimal speed for professional transformation.",
          icon: Flame,
          accentColor: "#d0bcff"
        },
        {
          id: "intense",
          title: "Hyper Focus (2h+)",
          description: "Total immersion mode. Accelerated level-ups for rapid deployment goals.",
          icon: Trophy,
          accentColor: "#6d3bd7"
        }
      ],
     footerTip: "Consistency is key! A 5-day streak unlocks double multiplier XP."
    },
    {
      id: "course_track",
      questionText: "Choose your core track",
      subtitle: "Select a specialized path to shape your Skill Tree and unlock advanced modules.",
      options: [
        {
          id: "frontend",
          title: "Frontend Architecture",
          description: "Master React, Next.js, Tailwind, and modern UI engineering patterns.",
          icon: Layers,
          accentColor: "#45ffba"
        },
        {
          id: "backend",
          title: "Backend Engineering",
          description: "Node.js, databases, APIs, and scalable distributed system design.",
          icon: Server,
          accentColor: "#d0bcff"
        },
        {
          id: "ai",
          title: "AI & LLM Systems",
          description: "Python, vector databases, intelligent agents, and applied machine learning.",
          icon: Brain,
          accentColor: "#6d3bd7"
        }
      ],
      footerTip: "This shapes the modules and skill nodes in your generated tree."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedForCurrent = selectedOptions[currentQuestion.id];

  const handleSelectOption = (optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = () => {
    if (!selectedForCurrent) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Final question complete, execute trigger
      onComplete(selectedOptions);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans antialiased selection:bg-purple-500/30 relative overflow-x-hidden">
      {/* Dynamic Background Drift */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-3xl"></div>
      </div>

      {/* Persistent Left Sidebar - Responsive */}
      <aside
        id="sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-[#0a0a0a] border-r border-white/10 shadow-2xl z-40 flex flex-col p-6 gap-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8 mt-2 flex items-center justify-between">
          <span className="font-display text-2xl text-white font-bold tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-base">S</div>
            SkillMatch
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-gray-400"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow">
          <button
            type="button"
            disabled
            title="Complete the assessment to unlock"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full text-gray-600 opacity-50 cursor-not-allowed"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
            <Lock className="w-3.5 h-3.5 ml-auto" />
          </button>

          {/* Skill Tree Tab (Active by default matching Image) — this IS the assessment, stays live */}
          <button
            onClick={() => setActiveTab("Skill Tree")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${
              activeTab === "Skill Tree"
                ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            <Network className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">Skill Tree</span>
          </button>

          <button
            type="button"
            disabled
            title="Complete the assessment to unlock"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full text-gray-600 opacity-50 cursor-not-allowed"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-medium">Leaderboard</span>
            <Lock className="w-3.5 h-3.5 ml-auto" />
          </button>

          <button
            type="button"
            disabled
            title="Complete the assessment to unlock"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full text-gray-600 opacity-50 cursor-not-allowed"
          >
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Badges</span>
            <Lock className="w-3.5 h-3.5 ml-auto" />
          </button>
        </nav>

        {/* Profile Card at bottom */}
        <div className="mt-auto p-5 rounded-2xl bg-[#121212] border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 overflow-hidden shrink-0 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-white">
                {displayName.trim().charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm text-white font-semibold truncate">{displayName}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">LEVEL {userLevel} {userStats?.rank ?? "NOVICE"}</p>
            </div>
          </div>
          <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-purple-600/10">
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* Top Header Frame */}
      <header className="fixed top-0 w-full z-30 bg-[#121212]/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-8 py-4.5 md:pl-72 transition-all">
        {/* Left Side: Mobile Menu Button and Experience Tracker */}
        <div className="flex items-center gap-5 flex-grow max-w-xl">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 bg-[#161616] border border-white/10 rounded-xl hover:bg-[#1a1a1a] text-white"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 w-full">
            <span className="text-gray-400 font-display text-xs font-bold whitespace-nowrap">{userStats?.xp ?? 0} / {xpForNextLevel} XP</span>
            <div className="h-2 w-full bg-[#1e1e1e] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Side: Streak and Badge Status */}
        <div className="flex items-center gap-4 pl-4 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161616] rounded-full border border-white/5 shadow-inner">
            <Flame className="w-4 h-4 text-purple-400 fill-purple-400/30" />
            <span className="font-display text-xs text-purple-400 font-bold">{userStats?.streak ?? 0}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline font-display text-xs text-gray-300 px-3 py-1 bg-[#161616] rounded-md border border-white/5 font-semibold">
              Starter Badge
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-8 md:ml-64 flex flex-col items-center justify-center min-h-[calc(100vh-20px)] transition-all">
        <div className="max-w-4xl w-full my-auto">
          
          {/* Progress Header */}
          <div className="mb-10 text-center">
            <div className="mb-6 max-w-xl mx-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="font-display text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  Assessment Progress
                </span>
                <span className="font-display text-xs text-purple-400 font-bold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#161616] rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-white font-bold tracking-tight mb-3">
              {currentQuestion.questionText}
            </h1>
            <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Option Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedForCurrent === option.id;
              const IconComponent = option.icon;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`relative overflow-hidden text-left rounded-3xl p-8 border transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none cursor-pointer flex flex-col items-center text-center ${
                    isSelected
                      ? "border-purple-500 bg-[#1a1a1a] shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                      : "border-white/5 bg-[#161616] hover:border-white/20 hover:bg-[#1a1a1a]"
                  }`}
                >
                  {/* Selected Tick badge in top right */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-purple-500 text-white rounded-full p-1 shadow-md border border-[#1a1a1a]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Icon with circular background */}
                  <div
                    className={`w-14 h-14 mb-6 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                      isSelected
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg text-white font-semibold mb-3">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Action Footer Button */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              {/* Back Button (Only visible after question 1) */}
              {currentQuestionIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-display text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer active:scale-95"
                >
                  Back
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!selectedForCurrent}
                className={`px-12 py-4 text-white font-display text-xs font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 relative group cursor-pointer ${
                  selectedForCurrent
                    ? "bg-purple-600 hover:bg-purple-500 opacity-100 shadow-[0_6px_25px_rgba(168,85,247,0.45)] hover:shadow-[0_10px_35px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95"
                    : "bg-purple-600/40 opacity-40 cursor-not-allowed"
                }`}
              >
                <span>
                  {currentQuestionIndex === questions.length - 1
                    ? "Finish Assessment"
                    : "Next Question"}
                </span>
              </button>
            </div>

            {/* Micro Hint/Tip Text */}
            <p className="text-[11px] text-gray-500 tracking-wide mt-2">
              {selectedForCurrent ? (
                <span className="text-purple-400 font-medium flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                  {currentQuestion.footerTip}
                </span>
              ) : (
                "Please select an option to unlock your customized learning path."
              )}
            </p>
          </div>

        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <button
          type="button"
          disabled
          className="flex flex-col items-center gap-1 text-gray-700 opacity-50 cursor-not-allowed"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("Skill Tree")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === "Skill Tree" ? "text-purple-400" : "text-gray-500"
          }`}
        >
          <Network className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Assess</span>
        </button>

        <button
          type="button"
          disabled
          className="flex flex-col items-center gap-1 text-gray-700 opacity-50 cursor-not-allowed"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Stats</span>
        </button>
      </nav>
    </div>
  );
}









