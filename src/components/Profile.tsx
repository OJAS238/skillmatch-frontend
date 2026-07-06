import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Network,
  Trophy,
  Award,
  Flame,
  Sparkles,
  Menu,
  X,
  RefreshCw,
  LogOut,
  Brain,
  Clock,
  Target,
  User,
  Mail,
  Activity,
  Milestone,
  CheckCircle2,
  ChevronRight,
  Sparkle
} from "lucide-react";

interface ProfileProps {
  onNavigate: (tab: string) => void;
  onRestart?: () => void;
  onSignOut?: () => void;
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

export default function Profile({
  onNavigate,
  onRestart,
  onSignOut,
  selectedAnswers,
  activeTab = "Profile"
}: ProfileProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fullName, setFullName] = useState(() => localStorage.getItem("skillmatch_username") || "Alex Dev");
  const [email, setEmail] = useState(() => localStorage.getItem("skillmatch_useremail") || "alex.arch@skillmatch.ai");

  // --- 📊 REAL MONGODB USER STATS ---
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [peerRank, setPeerRank] = useState<{ percentile: number; rankPosition: number; totalUsers: number } | null>(null);
  const userId = localStorage.getItem("skillmatch_userId");

  useEffect(() => {
    if (!userId) return;

    async function loadStats() {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
        const data = await response.json();
        if (data.success && data.user) {
          setUserStats(data.user);
        }
      } catch (err) {
        console.error("Failed to load user stats:", err);
      }
    }

    async function loadPeerRank() {
      try {
        const response = await fetch(`http://localhost:5000/api/leaderboard/rank/${userId}`);
        const data = await response.json();
        if (data.success) {
          setPeerRank(data);
        }
      } catch (err) {
        console.error("Failed to load peer rank:", err);
      }
    }

    loadStats();
    loadPeerRank();
  }, [userId]);

  const xpForNextLevel = userStats ? (Math.floor(userStats.xp / 1000) + 1) * 1000 : 1000;
  const xpProgressPercent = userStats ? Math.min(100, Math.round((userStats.xp / xpForNextLevel) * 100)) : 0;
  const userLevel = userStats ? Math.floor(userStats.xp / 500) + 1 : 1;
  const focusHours = userStats ? Math.round(userStats.focusTime / 60) : 0;

  // Same unlock thresholds as the Badges page, kept in sync so "Milestones
  // Unlocked" here matches what's actually shown there.
  const TOTAL_BADGES = 8;
  const unlockedBadgeCount = userStats
    ? [
        true, // Starter Badge always unlocked
        userStats.streak >= 5,
        userStats.nodesVisited >= 1,
        userStats.xp >= 100,
        userStats.nodesVisited >= 3,
        userStats.xp >= 500,
        userStats.streak >= 14,
        userStats.xp >= 1000
      ].filter(Boolean).length
    : 1;

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
      : "Kinesthetic / Tactile Learner";

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
          
          {/* XP Progress Indicator */}
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

          {/* Streak bubble */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)] shrink-0">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
            <span className="font-display text-xs text-orange-400 font-extrabold whitespace-nowrap">
              {userStats?.streak ?? 0}-Day Streak
            </span>
          </div>

          {/* Rank tag */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] shrink-0">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="font-display text-xs text-purple-400 font-extrabold whitespace-nowrap">
              {userStats?.rank ?? "Novice"}
            </span>
          </div>

          {/* Active styled Profile Avatar Container (Shows click trigger on profile tab) */}
          <button
            onClick={() => handleNav("profile")}
            className="w-10 h-10 rounded-full ring-2 ring-purple-500 border-2 border-transparent bg-[#0d1527] transition-all hover:scale-110 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.5)] overflow-hidden cursor-pointer flex items-center justify-center"
            aria-label="View profile"
          >
            <span className="font-display text-sm font-bold text-[#00f1ab]">
              {fullName.trim().charAt(0).toUpperCase()}
            </span>
          </button>

        </div>
      </header>

      <div className="flex h-screen overflow-hidden">
        
        {/* Standard left sidebar navigation structure (Profile NOT included as option) */}
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
              className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-gray-400 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 flex-grow">
            
            {/* Nav items styled as inactive since none are the Profile tab */}
            <button
              onClick={() => handleNav("dashboard")}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 text-gray-500 hover:text-gray-300 hover:bg-white/5 cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => handleNav("roadmap")}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 text-gray-500 hover:text-gray-300 hover:bg-white/5 cursor-pointer"
            >
              <Network className="w-5 h-5" />
              <span className="text-sm font-medium">Skill Tree</span>
            </button>

            <button
              onClick={() => handleNav("leaderboard")}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 text-gray-500 hover:text-gray-300 hover:bg-white/5 cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Leaderboard</span>
            </button>

            <button
              onClick={() => handleNav("badges")}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-left w-full transition-all duration-300 text-gray-500 hover:text-gray-300 hover:bg-white/5 cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Badges</span>
            </button>
          </nav>

          {/* Level up Pro promo block */}
          <div className="mt-auto p-5 rounded-2xl bg-[#111827]/80 border border-white/5 relative overflow-hidden">
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

        {/* Profile Content View */}
        <main className="flex-1 md:ml-64 h-full overflow-y-auto pt-20 pb-16 relative scroll-smooth">
          <div className="max-w-6xl mx-auto py-8 px-6">
            
            <div className="mb-10">
              <h1 className="font-display text-3xl md:text-5xl text-white font-extrabold tracking-tight mb-2">
                Cognitive Blueprint
              </h1>
              <p className="text-sm md:text-base text-gray-400">
                Refine your persona parameters and analyze your AI-driven learning trajectory.
              </p>
            </div>

            {/* Bento Grid layout for Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
              
              {/* Left Column: Account controls (User Card - 40% equivalent) */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="p-8 rounded-3xl bg-[#0f172a]/50 border border-white/5 relative overflow-hidden shadow-2xl">
                  {/* Neon border strip decoration */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>

                  <div className="flex flex-col items-center mb-8">
                    
                    {/* Glowing circular avatar framing */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-[#00f1ab]/40 to-indigo-500 shadow-[0_0_30px_rgba(168,85,247,0.25)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0d1527] border-2 border-[#020617] flex items-center justify-center">
                        <span className="font-display text-4xl font-black text-[#00f1ab]">
                          {fullName.trim().charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Verification checkmark badge */}
                      <div className="absolute -bottom-1.5 -right-1.5 w-9 h-9 bg-[#00f1ab] border-4 border-[#020617] rounded-full flex items-center justify-center shadow-lg shadow-[#00f1ab]/25">
                        <CheckCircle2 className="w-4 h-4 text-[#003825]" />
                      </div>
                    </div>

                    <h2 className="font-display text-xl font-bold text-white mt-4">{fullName}</h2>
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mt-1">
                      Level {userLevel} {userStats?.rank ?? "Novice"}
                    </p>
                  </div>

                  <div className="space-y-5">
                    
                    {/* Full name input */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-[#050b18] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                        />
                        <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Email address input */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#050b18] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                        />
                        <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Dark 'Retake Learning Assessment' action block */}
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <button
                        onClick={onRestart}
                        className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <RefreshCw className="w-4 h-4 text-purple-400" />
                        Retake Learning Assessment
                      </button>

                      {/* Subtle red Sign Out link */}
                      <button
                        onClick={onSignOut || onRestart}
                        className="w-full py-2.5 text-red-400 hover:text-red-300 transition-colors font-display text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out of SkillMatch
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* Right Column: AI Analytics & Profile Data (60% equivalent) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* AI Learner Profile summary card */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0f172a]/60 to-[#1e1b4b]/20 border border-purple-500/15 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Brain className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-black text-white">
                          AI Learner Profile
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#00f1ab] shadow-[0_0_8px_rgba(0,241,171,0.5)]"></span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Mastery Optimized
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary style display */}
                  <div className="p-5 rounded-2xl bg-[#050b18]/60 border border-white/5 relative overflow-hidden">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400 block mb-1">
                      Primary Learning style
                    </span>
                    <h2 className="font-display text-xl md:text-2xl font-black text-[#00f1ab]">
                      {learningStyleLabel}
                    </h2>
                    
                    <p className="text-xs md:text-sm text-gray-300 mt-3 leading-relaxed italic border-l-2 border-[#00f1ab]/30 pl-4 font-medium">
                      "Your layout focus velocity is <strong className="text-[#00f1ab]">15% faster</strong> when interacting with physical spatial components versus reading pure text documentation."
                    </p>
                  </div>

                  {/* Metrics Row: completion bar alongside milestones circular gauge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                    
                    {/* Platform Completion */}
                    <div className="p-5 rounded-2xl bg-[#050b18]/50 border border-white/5 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Platform Completion
                        </span>
                        <span className="text-sm font-mono font-black text-purple-400">68%</span>
                      </div>
                      <div className="h-3 w-full bg-[#121c38] rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-[#00f1ab] rounded-full relative"
                          style={{ width: "68%" }}
                        >
                          {/* Animated progress overlay effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] bg-[length:200%_100%]"></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-3 font-medium">
                        Approx. 42 hours remaining until Architect Mastery status is unlocked.
                      </p>
                    </div>

                    {/* Milestones gauge */}
                    <div className="p-5 rounded-2xl bg-[#050b18]/50 border border-white/5 flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle className="text-white/5" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="4" />
                          <circle className="text-[#00f1ab] drop-shadow-[0_0_8px_rgba(0,241,171,0.3)]" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeDasharray="150" strokeDashoffset="45" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        <span className="absolute">
                          <Milestone className="w-5 h-5 text-[#00f1ab]" />
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase block tracking-wider">
                          Milestones Unlocked
                        </span>
                        <h4 className="font-display text-lg font-black text-white">
                          {unlockedBadgeCount} / {TOTAL_BADGES} <span className="text-xs text-gray-500">Completed</span>
                        </h4>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Analytics Row: 3 metric cards */}
                <div className="grid grid-cols-3 gap-4">
                  
                  {/* Card 1: Nodes Visited */}
                  <div className="p-4 rounded-2xl bg-[#0f172a]/50 border border-white/5 text-center flex flex-col justify-between items-center group hover:border-purple-500/20 transition-all">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl mb-2">
                      <Network className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg md:text-xl font-black text-white">{userStats?.nodesVisited ?? 0}</h4>
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest block mt-0.5">
                        Nodes Visited
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Focus Time */}
                  <div className="p-4 rounded-2xl bg-[#0f172a]/50 border border-white/5 text-center flex flex-col justify-between items-center group hover:border-[#00f1ab]/20 transition-all">
                    <div className="p-2 bg-emerald-500/10 text-[#00f1ab] rounded-xl mb-2">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg md:text-xl font-black text-white">{focusHours}h</h4>
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest block mt-0.5">
                        Focus Time
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Peer Ranking */}
                  <div className="p-4 rounded-2xl bg-[#0f172a]/50 border border-white/5 text-center flex flex-col justify-between items-center group hover:border-indigo-500/20 transition-all">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl mb-2">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg md:text-xl font-black text-white">
                        {peerRank ? `Top ${peerRank.percentile}%` : "—"}
                      </h4>
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest block mt-0.5">
                        Peer Ranking
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Chart: Placeholder mock section container for Live Cognitive Load Tracking */}
                <div className="p-6 rounded-3xl bg-[#0f172a]/50 border border-white/5 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-display text-xs text-white uppercase tracking-wider font-bold flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00f1ab] animate-pulse"></span>
                      Live Cognitive Load Tracking
                    </h4>
                    <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
                      ACTIVE STATE
                    </span>
                  </div>

                  {/* Custom beautifully styled load bars */}
                  <div className="h-40 flex items-end justify-between gap-3 px-2">
                    
                    {/* Monday */}
                    <div className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-purple-500/20 group-hover:bg-purple-500/40 rounded-t-lg transition-all duration-300 relative" style={{ height: "40%" }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold whitespace-nowrap">
                          Low
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">M</span>
                    </div>

                    {/* Tuesday */}
                    <div className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-purple-500/30 group-hover:bg-purple-500/50 rounded-t-lg transition-all duration-300 relative" style={{ height: "65%" }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold whitespace-nowrap">
                          Mod
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">T</span>
                    </div>

                    {/* Wednesday */}
                    <div className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-purple-500/40 group-hover:bg-purple-500/60 rounded-t-lg transition-all duration-300 relative" style={{ height: "85%" }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold whitespace-nowrap">
                          High
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">W</span>
                    </div>

                    {/* Thursday */}
                    <div className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-[#00f1ab]/50 group-hover:bg-[#00f1ab]/70 rounded-t-lg transition-all duration-300 relative shadow-[0_0_15px_rgba(0,241,171,0.2)]" style={{ height: "95%" }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold whitespace-nowrap">
                          Peak
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">T</span>
                    </div>

                    {/* Friday */}
                    <div className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-purple-500/30 group-hover:bg-purple-500/50 rounded-t-lg transition-all duration-300 relative" style={{ height: "50%" }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold whitespace-nowrap">
                          Mod
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">F</span>
                    </div>

                    {/* Saturday */}
                    <div className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-purple-500/15 group-hover:bg-purple-500/30 rounded-t-lg transition-all duration-300 relative" style={{ height: "20%" }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold whitespace-nowrap">
                          Low
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">S</span>
                    </div>

                    {/* Sunday */}
                    <div className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-purple-500/20 group-hover:bg-purple-500/40 rounded-t-lg transition-all duration-300 relative" style={{ height: "35%" }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold whitespace-nowrap">
                          Low
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">S</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>

      </div>

      {/* Mobile Bottom Navigation Menu */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => handleNav("dashboard")}
          className="flex flex-col items-center gap-1 cursor-pointer text-gray-500"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Home</span>
        </button>

        <button
          onClick={() => handleNav("roadmap")}
          className="flex flex-col items-center gap-1 cursor-pointer text-gray-500"
        >
          <Network className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Learn</span>
        </button>

        <button
          onClick={() => handleNav("leaderboard")}
          className="flex flex-col items-center gap-1 cursor-pointer text-gray-500"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Rank</span>
        </button>

        <button
          onClick={() => handleNav("badges")}
          className="flex flex-col items-center gap-1 cursor-pointer text-gray-500"
        >
          <Award className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Badges</span>
        </button>
      </nav>

    </div>
  );
}


