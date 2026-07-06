import React, { useState,useEffect } from "react";
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
  ChevronRight
} from "lucide-react";

interface LeaderboardProps {
  onNavigate: (tab: string) => void;
  onRestart?: () => void;
  selectedAnswers?: Record<string, string> | null;
  activeTab?: string;
}

interface Standing {
  rank: number;
  name: string;
  role: string;
  xp: number;
  change?: string;
  avatar: string;
  isYou?: boolean;
}

interface UserStats {
  name: string;
  xp: number;
  streak: number;
  rank: string;
  nodesVisited: number;
  focusTime: number;
}

export default function Leaderboard({ onNavigate, onRestart, selectedAnswers, activeTab = "Leaderboard" }: LeaderboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [studyRoomJoined, setStudyRoomJoined] = useState(false);

  // --- 📊 REAL MONGODB USER STATS (for the header chips + Badge Case) ---
  const [userStats, setUserStats] = useState<UserStats | null>(null);
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

  const userLevel = userStats ? Math.floor(userStats.xp / 500) + 1 : 1;

  // Read learning style from selectedAnswers or default to "Visual"
  const learningStyle = selectedAnswers?.learning_style || "visual";
  const learningStyleLabel =
    learningStyle === "visual"
      ? "Visual Mapper"
      : learningStyle === "auditory"
      ? "Aural Listener"
      : "Kinesthetic Builder";

  const fallbackStandings: Standing[] = [
    {
      rank: 1,
      name: "Alex Vanguard",
      role: "UI Design Master",
      xp: 14250,
      change: "+240 today",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAZm_Nm2iWoVkUxYhKLTv6zO0aQwrmxgw5GSQYFJhy6izP1rpG5aUpKdGUzr6HFqFlp3b3gjkho9noohALh_mzULOYC1uWgF9x3rNL4U6G0X0oTVGXhG9RWt-l52Er4vR3Xn5-pNeR1WPT7ni7gB0JtZCpw2cGWWHT0fDhpjkoPjAgAZpZn5HmsBxS9xRD-O0S9bqrJjd3owqEfH-LxBpFMWoPX2JCQzHjCJXMEp4qLz54bcj30fyxBP2EKKwdioZnR4hWVztWbQ"
    },
    {
      rank: 2,
      name: "Sarah Matrix",
      role: "React Specialist",
      xp: 13900,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0kfHlT_GM3tfE8TSPz0SV6gQM_j5Lz_sWZ8jgPRi_spoYnR0m-p4vrY4yglfS2MY2TszkfyjXgPM4jcrmPPxkTt7rBqKmGjaKPpQXhrutoBAeqW4fE6Zy9Ph4v_ew1FKDUsmYKg1Z48EacYVt1haW1uqTXB6Pi5Z2zbTvksJyYt9gTcRFZCVLY0zD1u5XbFvp1ZB3m_-2flRyy_g4ZFDLGek8yec5UwJI06OY2gPsT0e-w0Vw1wkHqc0iRyQ4WeevSWnlyQm7IQ"
    },
    {
      rank: 3,
      name: "YOU",
      role: learningStyleLabel,
      xp: 12420,
      change: "580 XP TO RANK UP",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVjrMSkVlI8NwRbGv7uDRlSMrfJXT0seWwo-MY9fLOmTaP_TqO0AZKJEipd7_QC91r2SFodHEiYVoQsC5fNJay5EPfpwyxNu60aakMARgotidlNkkAwjuQC48lemCT-WRHqQ5q14ISkt7FRmmywkOYMmXEyp0TvQSwu7caTDu8Om1ZdsC_WO6Qyf3vWr_jBySG0gbe4yuXG6u9P2YbjOmzPq2doNN6-gfXt9SzKIEOP-ANhckoyHL_JLx3wDliX6PpsGncKqsKyA",
      isYou: true
    },
    {
      rank: 4,
      name: "David Cipher",
      role: "Backend Sage",
      xp: 11800,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD5wZ3XPvzwooWm1fWFBPQWEgFnh6QLyi1QU_jHSaqdRjsq1ZUxgNiLT1KcwDnAj7zKkzSWMcksc81Tru2xwXi7u77-kXyMya8YxmEWyiYZib6b8QTmktWArCR6iIieEEHiHXSbt1gt2aHjqKD2_bDqaXCDb35blGAHTofpaX8Wb4wQf5tMMAgtl53WmcPQdXLhc55jTsT__YoFjLdOf8tv8J44TOUUOHJn0kNnYzQATWaiYcmDTno6F5fxrrTJTgPtu5LxQVr7Q"
    },
    {
      rank: 5,
      name: "Elena Prompt",
      role: "System Designer",
      xp: 11210,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxu2Dq-anbuavihMqgLTSGKLcl05fO3-6OfJQbhn17HXqvEMpuBZZND24gahzfNdTZ-nlGdKc33hx7AaPrICQbsbml7RlD_BdRdG8lHcJGLNESsU1t5OjWQNUCGD-JiEUxiK1DIMZtb_SWTS6jdodSrd0KJKZ_etjuf4HfNmhlOtt1NLcoh4PDhszix9KkddRmLQ-qYBqzh_zTqdX_XpnPuhQMFI8lY2mtUfz_VYQu-Eiv5YO3Loyp1NFV_Kb6xCY4YbrEBxfvzg"
    }
  ];
 
  const [standings, setStandings] = useState<Standing[]>(fallbackStandings);
 
  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
        const data = await response.json();
        if (data.success && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
          const currentUsername = localStorage.getItem("skillmatch_username");
          const mapped: Standing[] = data.leaderboard.map((user: any, idx: number) => ({
            rank: idx + 1,
            name: user.name,
            role: user.learningStyle && user.learningStyle !== "Not Assessed"
              ? user.learningStyle
              : user.rank || "Learner",
            xp: user.xp || 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6d3bd7&color=fff`,
            isYou: user.name === currentUsername
          }));
          setStandings(mapped);
        }
      } catch (err) {
        console.error("Failed to load leaderboard, using fallback:", err);
      }
    }
    loadLeaderboard();
  }, []);

  const filteredStandings = standings.filter((standing) =>
    standing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    standing.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans antialiased selection:bg-purple-500/30 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 md:w-96 h-64 md:h-96 bg-purple-600/10 blur-[80px] md:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 md:w-[500px] h-80 md:h-[500px] bg-purple-500/5 blur-[100px] md:blur-[150px] rounded-full"></div>
      </div>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-45 bg-[#121212]/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-6 py-4.5 md:pl-72 h-16 md:h-20 transition-all">
        <div className="flex items-center gap-4 flex-grow max-w-xl">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 bg-[#161616] border border-white/10 rounded-xl hover:bg-[#1a1a1a] text-white"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="md:hidden font-display text-lg text-white font-bold tracking-tight">SkillMatch</span>

          {/* Search bar matching Image */}
          <div className="hidden md:flex relative w-64">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#161616] border border-white/5 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-full transition-all"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Top Header stats matching Image */}
        <div className="flex items-center gap-4 pl-4 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#161616] rounded-full border border-white/5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500/30" />
            <span className="font-display text-xs text-purple-400 font-bold whitespace-nowrap">{userStats?.streak ?? 0}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#161616] rounded-full border border-white/5">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="font-display text-xs text-purple-400 font-bold whitespace-nowrap">Lv. {userLevel}</span>
          </div>

          <button
            onClick={() => onNavigate("Profile")}
            className="w-9 h-9 rounded-full border-2 border-purple-500/30 overflow-hidden bg-[#1a1a1a] transition-all hover:scale-110 cursor-pointer flex items-center justify-center"
            aria-label="View profile"
          >
            <span className="font-display text-xs font-bold text-purple-300">
              {(userStats?.name || "?").trim().charAt(0).toUpperCase()}
            </span>
          </button>
        </div>
      </header>

      {/* Persistent Left Sidebar Navigation */}
      <div className="flex h-screen overflow-hidden">
        <aside
          className={`fixed left-0 top-0 h-full w-64 bg-[#0a0a0a] border-r border-white/10 shadow-2xl z-50 flex flex-col p-6 gap-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${
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
                activeTab === "Dashboard"
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

            {/* Leaderboard active state */}
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

            <button
              onClick={() => {
                onNavigate("Badges");
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left w-full ${
                activeTab === "Badges"
                  ? "bg-purple-600/10 text-purple-400 font-semibold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Badges</span>
            </button>
          </nav>

          {/* Upgrade to Pro & helper stats bottom of navigation menu */}
          <div className="mt-auto p-5 rounded-2xl bg-[#121212] border border-white/5">
            <h4 className="font-display text-sm text-white font-bold mb-1">Pro Learner</h4>
            <p className="text-xs text-gray-500 mb-4">Unlock advanced visual paths and AI mentorship.</p>
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

        {/* Main Panel Content container */}
        <main className="flex-1 md:ml-64 h-full overflow-y-auto pt-20 pb-12 relative scroll-smooth">
          <div className="max-w-5xl mx-auto py-10 px-6">
            
            {/* Top Grid Area with standouts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Leaderboard standing area */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-600/10 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-purple-400">
                      <Trophy className="w-6 h-6 fill-purple-400/20" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl md:text-3xl font-extrabold text-white">
                        Emerald League
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">Top-tier visual learners competition standings</p>
                    </div>
                  </div>
                  <span className="font-display text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-widest bg-purple-600/10 px-3.5 py-1.5 rounded-full border border-purple-500/15 shrink-0">
                    Ending in 2d 14h
                  </span>
                </div>

                {/* Standing List Row Rows */}
                <div className="space-y-3.5">
                  {filteredStandings.map((standing) => {
                    const isWinner = standing.rank === 1;
                    const isSilver = standing.rank === 2;
                    const isYou = standing.isYou;

                    return (
                      <div
                        key={standing.rank}
                        className={`p-3 md:p-4.5 rounded-2xl bg-[#111111] border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group hover:translate-y-[-2px] ${
                          isYou
                            ? "border-purple-500/30 bg-purple-600/5 shadow-[0_0_20px_rgba(168,85,247,0.06)]"
                            : "border-white/5 hover:bg-[#151515] hover:border-white/10"
                        }`}
                      >
                        {isYou && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent shimmer opacity-40 pointer-events-none"></div>
                        )}

                        {/* Rank indicator */}
                        <div className="w-8 font-display text-sm md:text-base font-bold text-gray-400 text-center">
                          {standing.rank}
                        </div>

                        {/* Medal status icons */}
                        <div className="flex items-center justify-center w-8 shrink-0">
                          {isWinner ? (
                            <Award className="w-7 h-7 text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
                          ) : isSilver ? (
                            <Award className="w-7 h-7 text-slate-300 fill-slate-300/20" />
                          ) : standing.rank === 3 ? (
                            <Award className="w-7 h-7 text-orange-400 fill-orange-400/20" />
                          ) : (
                            <div className="w-7 h-7" />
                          )}
                        </div>

                        {/* Avatar Image component */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            alt={`${standing.name} avatar`}
                            src={standing.avatar}
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* User Identity Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-sm md:text-base font-bold text-white truncate">
                              {standing.name}
                            </h3>
                            {isYou && (
                              <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-black rounded-full uppercase tracking-wider whitespace-nowrap">
                                Promotion Zone
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider truncate mt-0.5">
                            {standing.role}
                          </p>
                        </div>

                        {/* XP Stats info */}
                        <div className="text-right shrink-0">
                          <div
                            className={`font-mono text-xs md:text-sm font-bold ${
                              isYou ? "text-purple-400 font-extrabold" : "text-gray-300"
                            }`}
                          >
                            {standing.xp.toLocaleString()} XP
                          </div>
                          {standing.change && (
                            <div className="text-[9px] text-purple-400/80 uppercase font-bold tracking-wide mt-0.5">
                              {standing.change}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredStandings.length === 0 && (
                    <div className="p-12 text-center rounded-2xl bg-[#111111] border border-white/5">
                      <p className="text-gray-500 text-sm">No standings matched your search criteria.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Sidebar stats column (Badge Case & AI Peer Matchmaker) */}
              <div className="space-y-6">
                
                {/* Badge Case standouts */}
                <section className="p-6 rounded-3xl bg-[#111111] border border-white/5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display text-lg font-bold text-white">
                        Badge Case
                      </h2>
                      <p className="text-[10px] text-gray-500">Unlocked achievements status</p>
                    </div>
                    <Award className="w-5 h-5 text-purple-400 hover:rotate-12 transition-transform cursor-pointer" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Flame Master */}
                    <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-help group text-center border border-white/5">
                      <div className="w-12 h-12 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                        <Flame className="w-6 h-6 fill-orange-500/20" />
                      </div>
                      <span className="font-display text-[10px] text-gray-300 font-bold tracking-tight">
                        Flame Master
                      </span>
                      <span className="text-[8px] text-orange-400 font-medium uppercase tracking-wider">
                        {userStats?.streak ?? 0}D Streak
                      </span>
                    </div>

                    {/* Kinesthetic Guru */}
                    <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-help group text-center border border-white/5">
                      <div className="w-12 h-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <Zap className="w-6 h-6" />
                      </div>
                      <span className="font-display text-[10px] text-gray-300 font-bold tracking-tight">
                        Kinesthetic Guru
                      </span>
                      <span className="text-[8px] text-[#10B981] font-medium uppercase tracking-wider">
                        Active Sandbox
                      </span>
                    </div>

                    {/* Night Owl */}
                    <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-help group text-center border border-white/5">
                      <div className="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                        <Moon className="w-6 h-6 fill-purple-500/20" />
                      </div>
                      <span className="font-display text-[10px] text-gray-300 font-bold tracking-tight">
                        Night Owl
                      </span>
                      <span className="text-[8px] text-purple-400 font-medium uppercase tracking-wider">
                        2AM Lab Done
                      </span>
                    </div>

                    {/* Locked badge slot */}
                    <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl opacity-50 text-center border border-white/5">
                      <div className="w-12 h-12 rounded-full bg-white/5 text-gray-600 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="font-display text-[10px] text-gray-500 font-bold tracking-tight">
                        System Architect
                      </span>
                      <span className="text-[8px] text-gray-600 font-medium uppercase tracking-wider">
                        Locked
                      </span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2.5 border border-white/5 rounded-xl text-[10px] font-display uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                    View All (24 Achievements)
                  </button>
                </section>

                {/* AI Peer Matchmaking module matching Image */}
                <section className="p-6 rounded-3xl bg-[#111111] border-l-4 border-purple-500 border-t border-r border-b border-white/5 relative overflow-hidden shadow-xl">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 blur-3xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 mb-3.5">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    <h2 className="font-display text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
                      AI Matchmaker
                    </h2>
                  </div>

                  <p className="text-xs md:text-sm text-white font-medium leading-relaxed mb-4">
                    <span className="font-bold text-purple-400">2 other {learningStyleLabel}s</span> are online studying UI Fundamentals right now!
                  </p>

                  {/* Peer Avatars Stack */}
                  <div className="flex items-center -space-x-2.5 mb-5">
                    <div className="w-9 h-9 rounded-full border-2 border-[#111111] bg-slate-700 overflow-hidden relative">
                      <img
                        className="w-full h-full object-cover"
                        alt="Matchmaker Peer 1"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOgT7wV4Cw0Un5RCKEheuJtApE7V0VqG90kv1bHmxp4AA7jRTmzcv6pbpJSd0vMhFnIVxQ1e9y7j1GZ3XpisjI8jfjiS3TCk0zusOp0k7WH0tbrEEB_RIZxwNjvVaUtJ0FcdA04rxw-ETellDCS-zf5rk4mq8Y031jopb6elYRFSZqvnZysQc5PsaM4mrhPEzsQXvJKzOrF59ryk6sbElqqCFYi6rz8dWX7YdFnO3qH1czS9tyMqzi6dYFQN_kqtKqTfG1kCnbcQ"
                      />
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-[#111111] bg-slate-700 overflow-hidden relative">
                      <img
                        className="w-full h-full object-cover"
                        alt="Matchmaker Peer 2"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR37_84fDoCthtj1iALlIL6LwJ4gQu3iU4BfDqvjO_7WbyTeEW2UfS_eeOrmhY7ZRxyZLpAy4X2JuLCuBFSUS5zM1cOHElXZocpIv7dB_B4B0Xhf03K8Cnb-oG0tITFLZr5Cg_mHYnU8bb4EXmIHnTAgVAPOtJzoI8jFc_LhVuumHjzc0yGzxAoUTYgz7RGU5e8l9ghV0k_pOLTIHQKgryca1B2cgGfUe_4YGPfDghKC_N6nUtCnXBH91IkBmQJ6Jwe8uvZgH0DA"
                      />
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-[#111111] bg-purple-600/20 text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      +12
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStudyRoomJoined(true);
                      alert("Successfully connected! You have joined the UI Fundamentals Collaborative Live Study Room.");
                    }}
                    className={`w-full py-3.5 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg ${
                      studyRoomJoined
                        ? "bg-[#10B981] shadow-[#10B981]/20"
                        : "bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 shadow-purple-600/20"
                    }`}
                  >
                    {studyRoomJoined ? "In Study Room" : "Join Study Room"}
                  </button>
                </section>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation menu matching Dashboard */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => onNavigate("Dashboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === "Dashboard" ? "text-purple-400" : "text-gray-500"
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
      </nav>

    </div>
  );
}


