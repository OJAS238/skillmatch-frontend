import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  LayoutDashboard,
  Network,
  Trophy,
  Award,
  Flame,
  Search,
  Lock,
  Sparkles,
  RefreshCw,
  X,
  Menu,
  Shield,
  Zap,
  Moon,
  Users,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  Rocket,
  Compass,
  Grid,
  Box,
  Palette,
  CheckSquare,
  Clock,
  Settings2,
  Brain,
  Sliders,
  CheckCircle2
} from "lucide-react";

interface BadgesProps {
  onNavigate: (tab: string) => void;
  onRestart?: () => void;
  selectedAnswers?: Record<string, string> | null;
  activeTab?: string;
}

interface UserStats {
  name: string;
  xp: number;
  streak: number;
  rank: string;
  nodesVisited: number;
  focusTime: number;
}

export default function Badges({ onNavigate, onRestart, selectedAnswers, activeTab = "Badges" }: BadgesProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- 📊 REAL MONGODB USER STATS ---
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const userId = localStorage.getItem("skillmatch_userId");

  useEffect(() => {
    if (!userId) return;
    async function loadUserStats() {
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
    loadUserStats();
  }, [userId]);

  const xpForNextLevel = userStats ? (Math.floor(userStats.xp / 1000) + 1) * 1000 : 1000;
  const xpProgressPercent = userStats ? Math.min(100, Math.round((userStats.xp / xpForNextLevel) * 100)) : 0;
  const userLevel = userStats ? Math.floor(userStats.xp / 500) + 1 : 1;

  // Local demo state for the "current challenge" progress ring — not yet
  // backed by a Mongo field, seeded from real nodesVisited so it's not a
  // pure fake number.
  const [challengeProgress, setChallengeProgress] = useState(0);
  useEffect(() => {
    if (userStats) {
      setChallengeProgress(Math.min(5, userStats.nodesVisited));
    }
  }, [userStats]);

  // Read learning style from selectedAnswers or default to "Visual"
  const learningStyle = selectedAnswers?.learning_style || "visual";
  const learningStyleLabel =
    learningStyle === "visual"
      ? "Visual Mapper"
      : learningStyle === "auditory"
      ? "Aural Listener"
      : "Kinesthetic Builder";

  // Badge definitions with a real unlock condition computed from live user
  // stats, instead of a fixed unlocked/locked split. NOTE: your User schema
  // doesn't persist individual earned badges yet — these thresholds are
  // computed live from streak/xp/nodesVisited each time the page loads. If
  // you want badges to permanently "stick" once earned (even if stats later
  // reset), that needs a `badges: [String]` field on the User model instead.
  const badgeDefs = [
    {
      id: "starter",
      title: "Starter Badge",
      icon: Rocket,
      color: "text-purple-400 border-purple-500/30",
      bgGlow: "bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.3)]",
      description: "Began your learning journey on SkillMatch AI.",
      isUnlocked: (s: UserStats) => true
    },
    {
      id: "streak",
      title: "Streak Master",
      icon: Flame,
      color: "text-emerald-400 border-emerald-500/30",
      bgGlow: "bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.3)]",
      description: "Maintained a continuous 5-day focus cycle.",
      isUnlocked: (s: UserStats) => s.streak >= 5
    },
    {
      id: "architect",
      title: "Layout Architect",
      icon: Compass,
      color: "text-purple-400 border-purple-500/30",
      bgGlow: "bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.3)]",
      description: "Mastered fundamental spacing hierarchies.",
      isUnlocked: (s: UserStats) => s.nodesVisited >= 1
    },
    {
      id: "speed",
      title: "Speed Demon",
      icon: Zap,
      color: "text-emerald-400 border-emerald-500/30",
      bgGlow: "bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.3)]",
      description: "Completed three lessons under optimal limits.",
      isUnlocked: (s: UserStats) => s.xp >= 100
    },
    {
      id: "pattern",
      title: "Pattern Hunter",
      icon: Grid,
      color: "text-blue-400 border-blue-500/30",
      bgGlow: "bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.3)]",
      description: "Recognize recurring visual layouts automatically.",
      isUnlocked: (s: UserStats) => s.nodesVisited >= 3
    },
    {
      id: "component",
      title: "Component King",
      icon: Box,
      color: "text-amber-400 border-amber-500/30",
      bgGlow: "bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.3)]",
      description: "Construct 20 custom reusable modular entities.",
      isUnlocked: (s: UserStats) => s.xp >= 500
    },
    {
      id: "color",
      title: "Color Mystic",
      icon: Palette,
      color: "text-pink-400 border-pink-500/30",
      bgGlow: "bg-pink-500/10 shadow-[0_0_25px_rgba(236,72,153,0.3)]",
      description: "Apply accessibility-certified color contrasts.",
      isUnlocked: (s: UserStats) => s.streak >= 14
    },
    {
      id: "system",
      title: "System Overlord",
      icon: Settings2,
      color: "text-red-400 border-red-500/30",
      bgGlow: "bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.3)]",
      description: "Deploy complex design systems with token configs.",
      isUnlocked: (s: UserStats) => s.xp >= 1000
    }
  ];

  const effectiveStats: UserStats = userStats || { name: "Explorer", xp: 0, streak: 0, rank: "Novice", nodesVisited: 0, focusTime: 0 };
  const unlockedBadges = badgeDefs.filter((b) => b.isUnlocked(effectiveStats));
  const lockedBadges = badgeDefs.filter((b) => !b.isUnlocked(effectiveStats));
  const nextLockedBadge = lockedBadges[0];

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 font-sans antialiased selection:bg-purple-500/30 relative overflow-x-hidden">
      
      {/* Background radial atmosphere glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 md:w-96 h-64 md:h-96 bg-purple-600/10 blur-[80px] md:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 md:w-[500px] h-80 md:h-[500px] bg-emerald-500/5 blur-[100px] md:blur-[150px] rounded-full"></div>
      </div>

      {/* Top Application Navigation Header Bar */}
      <header className="fixed top-0 w-full z-45 bg-[#070d1f]/70 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 h-16 md:h-20 md:pl-72 transition-all">
        <div className="flex items-center gap-4 flex-grow max-w-xl">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 bg-[#111827] border border-white/10 rounded-xl hover:bg-[#1f2937] text-white"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="md:hidden font-display text-lg text-white font-bold tracking-tight">SkillMatch</span>

          {/* Search bar matching style guides */}
          <div className="hidden md:flex relative w-64">
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0f172a] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-full transition-all"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Top horizontal statistics display */}
        <div className="flex items-center gap-5 shrink-0 pl-4">
          
          {/* XP Progress Indicator matching request */}
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

          {/* Streak badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)] shrink-0">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
            <span className="font-display text-xs text-orange-400 font-extrabold whitespace-nowrap">
              {userStats?.streak ?? 0}-Day Streak
            </span>
          </div>

          {/* Rank Tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] shrink-0">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="font-display text-xs text-purple-400 font-extrabold whitespace-nowrap">
              {userStats?.rank ?? "Novice"}
            </span>
          </div>

          {/* User profile avatar — no avatar field exists on the User schema yet, so we show real initials instead of a fake stock photo */}
          <button
            onClick={() => onNavigate("Profile")}
            className="w-10 h-10 rounded-full border-2 border-[#00f1ab]/50 overflow-hidden bg-[#0d1527] transition-all hover:scale-110 shrink-0 shadow-lg cursor-pointer flex items-center justify-center"
            aria-label="View profile"
          >
            <span className="font-display text-sm font-bold text-[#00f1ab]">
              {(userStats?.name || "?").trim().charAt(0).toUpperCase()}
            </span>
          </button>

        </div>
      </header>

      {/* Application sidebar + Main container */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Persistent Left Sidebar Navigation */}
        <aside
          className={`fixed left-0 top-0 h-full w-64 bg-[#0a0f1d] border-r border-white/10 shadow-2xl z-50 flex flex-col p-6 gap-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${
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
              onClick={() => {
                onNavigate("Dashboard");
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left w-full ${
                activeTab === "Dashboard" || activeTab === "Skill Tree"
                  ? "bg-purple-600/10 text-purple-400 font-semibold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => {
                onNavigate("Skill Tree");
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${
                activeTab === "Skill Tree"
                  ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Network className="w-5 h-5" />
              <span className="text-sm font-medium">Skill Tree</span>
            </button>

            <button
              onClick={() => {
                onNavigate("Leaderboard");
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${
                activeTab === "Leaderboard"
                  ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Leaderboard</span>
            </button>

            {/* Badges tab - active state heavily styled with subtle glow outline matching guidelines */}
            <button
              onClick={() => {
                onNavigate("Badges");
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 cursor-pointer ${
                activeTab === "Badges"
                  ? "bg-purple-600/15 text-purple-400 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Badges</span>
            </button>
          </nav>

          {/* Current level display + Upgrade promo card */}
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

        {/* Scrollable central viewport */}
        <main className="flex-grow md:ml-64 h-full overflow-y-auto pt-20 pb-16 scroll-smooth">
          <div className="max-w-6xl mx-auto py-8 px-6">
            
            {/* Grid layout splitting vault and current challenge focus */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Achievement Vault (8 Columns) */}
              <div className="lg:col-span-8 space-y-8">
                
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
                    Achievement Vault
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    Showcase your journey through {badgeDefs.length} possible milestones.
                  </p>
                </div>

                {/* Subtitle / Filter Header row */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs text-purple-400 font-mono font-bold">
                    {unlockedBadges.length} / {badgeDefs.length} ARCHETYPES COMPLETED
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Filter: All</span>
                    <button className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <Sliders className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid for Row 1 & Row 2 milestones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Row 1 Unlocked Badges */}
                  {unlockedBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        className={`p-5 rounded-3xl bg-[#0f172a]/40 border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 relative overflow-hidden group cursor-pointer ${badge.bgGlow}`}
                      >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>

                        {/* Large icon wrapper */}
                        <div className="w-16 h-16 rounded-full bg-[#1e293b]/60 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform relative">
                          <IconComponent className={`w-8 h-8 ${badge.color}`} />
                        </div>

                        <h3 className="font-display text-sm font-bold text-white mb-1">
                          {badge.title}
                        </h3>
                        
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#00f1ab] bg-[#00f1ab]/5 px-2.5 py-1 rounded-full border border-[#00f1ab]/20">
                          Unlocked
                        </span>

                        <p className="text-[10px] text-gray-500 mt-3.5 leading-relaxed font-medium">
                          {badge.description}
                        </p>
                      </div>
                    );
                  })}

                  {/* Row 2 Locked Milestones */}
                  {lockedBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        className="p-5 rounded-3xl bg-[#0f172a]/10 border border-white/5 flex flex-col items-center text-center transition-all opacity-40 group cursor-not-allowed"
                      >
                        {/* Large lock symbol and icon */}
                        <div className="w-16 h-16 rounded-full bg-slate-900/40 flex items-center justify-center mb-4 border border-white/5 relative">
                          <IconComponent className="w-8 h-8 text-slate-500" />
                          <div className="absolute top-0 right-0 p-1 bg-slate-950 border border-white/10 rounded-full">
                            <Lock className="w-3 h-3 text-slate-500" />
                          </div>
                        </div>

                        <h3 className="font-display text-sm font-bold text-slate-400 mb-1">
                          {badge.title}
                        </h3>

                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          LOCKED
                        </span>

                        <p className="text-[10px] text-slate-600 mt-3.5 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    );
                  })}

                </div>

                {/* Extra Stats highlight box beneath the bento list */}
                <div className="p-6 rounded-3xl bg-[#0b1329] border border-purple-500/15 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-purple-500/10 blur-2xl pointer-events-none"></div>
                  
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Keep pushing, {userStats?.name || "Explorer"}!
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                      {nextLockedBadge
                        ? <>You're on your way to unlocking the <strong className="text-white">"{nextLockedBadge.title}"</strong> milestone. Complete any active core challenge node to earn progress.</>
                        : "You've unlocked every milestone available right now — incredible work!"}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate("Skill Tree")}
                    className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
                  >
                    View Active Tree
                  </button>
                </div>

              </div>

              {/* Right Column: Current Focus Showcase Sidebar (4 Columns) */}
              <div className="lg:col-span-4 h-fit">
                
                <section className="p-6 md:p-8 rounded-3xl bg-[#0f172a]/50 border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col items-center">
                  
                  {/* Atmospheric Glow backdrop */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 blur-[80px] pointer-events-none"></div>

                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">
                    Current Focus
                  </span>

                  {/* Pulsing Concentric Circular Illustration */}
                  <div className="w-40 h-40 mx-auto relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 via-transparent to-[#00f1ab]/15 rounded-full animate-pulse border border-purple-500/20"></div>
                    <div className="absolute inset-4 bg-purple-600/5 rounded-full border border-purple-500/10 animate-[pulse_3s_infinite]"></div>
                    
                    <div className="w-24 h-24 rounded-full bg-[#030712] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)] z-10">
                      <Brain className="w-12 h-12 text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    </div>
                  </div>

                  <h2 className="font-display text-xl font-extrabold text-white text-center mb-1">
                    {learningStyleLabel}
                  </h2>

                  <p className="text-xs md:text-sm text-gray-400 text-center px-2 leading-relaxed mb-6">
                    Master the art of {learningStyle === "kinesthetic" ? "tactile, motion-driven UI components and rich spatial interactions" : learningStyle === "auditory" ? "narrated walkthroughs and verbal reasoning through complex concepts" : "structured visual maps and diagram-driven problem solving"}.
                  </p>

                  {/* Criteria completion details box */}
                  <div className="w-full space-y-5">
                    
                    <div className="p-4 rounded-2xl bg-[#030712]/60 border border-white/5 space-y-4">
                      
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/10">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Criteria</p>
                          <p className="text-xs font-bold text-white">
                            Complete 5 {learningStyleLabel} Lessons
                          </p>
                        </div>
                      </div>

                      {/* Lesson counts progress tracker bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-gray-400">{learningStyleLabel} Mastery</span>
                          <span className="text-[#00f1ab] font-mono">{challengeProgress} / 5 Lessons</span>
                        </div>
                        
                        <div className="h-2 w-full bg-[#121c38] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-[#00f1ab] rounded-full transition-all duration-500"
                            style={{ width: `${(challengeProgress / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                    </div>

                    {/* Gradient Continue Challenge Button */}
                    <button
                      onClick={() => {
                        if (challengeProgress < 5) {
                          setChallengeProgress((prev) => prev + 1);
                        } else {
                          alert("Congratulations! Challenge completely finished!");
                        }
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-purple-600/25 flex items-center justify-center gap-1.5"
                    >
                      {challengeProgress >= 5 ? "Claim Badge Reward" : "Continue Challenge"}
                    </button>

                    {/* Meta stats tags */}
                    <div className="flex justify-center gap-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        4 Days Left
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-gray-500" />
                        250 XP Reward
                      </span>
                    </div>

                  </div>

                </section>

              </div>

            </div>

          </div>
        </main>

      </div>

      {/* Mobile Bottom Navigation menu matching Dashboard / Leaderboard */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => onNavigate("Dashboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === "Dashboard" || activeTab === "Skill Tree" ? "text-purple-400" : "text-gray-500"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Home</span>
        </button>

        <button
          onClick={() => onNavigate("Skill Tree")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === "Skill Tree" ? "text-purple-400" : "text-gray-500"
          }`}
        >
          <Network className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Learn</span>
        </button>

        <button
          onClick={() => onNavigate("Leaderboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === "Leaderboard" ? "text-purple-400" : "text-gray-500"
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Rank</span>
        </button>

        <button
          onClick={() => onNavigate("Badges")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === "Badges" ? "text-purple-400" : "text-gray-500"
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Badges</span>
        </button>
      </nav>

    </div>
  );
}
