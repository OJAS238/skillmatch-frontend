import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { Mail, Lock, Eye, EyeOff, Bolt, ArrowRight, Sparkles, User } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (data: { name: string; email: string }) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Eye movement tracking state for the cute mascots
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Calculate normalized offset from -4 to 4 pixels
    const moveX = ((clientX / width) - 0.5) * 8;
    const moveY = ((clientY / height) - 0.5) * 8;
    setMousePos({ x: moveX, y: moveY });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Email + password are kept purely for the UI/demo feel — they are not
    // sent anywhere for verification. Authentication is name-only: whatever
    // name resolves here is looked up (or created) in MongoDB.
    const finalName = isSignUp ? (name.trim() || "Alex Dev") : (localStorage.getItem("skillmatch_username") || "Alex Dev");
    const finalEmail = email.trim() || "alex.arch@skillmatch.ai";

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/name-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalName }),
      });
      const data = await response.json();

      if (!data.success) {
        console.error("Name-login failed:", data.message);
        setIsLoading(false);
        return;
      }

      const user = data.user;
      localStorage.setItem("skillmatch_token", data.token);
      localStorage.setItem("skillmatch_userId", user._id);
      localStorage.setItem("skillmatch_username", user.name);
      localStorage.setItem("skillmatch_useremail", finalEmail);

      onAuthSuccess({ name: user.name, email: finalEmail });
    } catch (err) {
      console.error("Error during name-login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Same idea as above: the Google button is cosmetic for the demo, but it
    // still hits the real name-based backend so the session is genuine.
    const finalName = localStorage.getItem("skillmatch_username") || "Alex Dev";
    const finalEmail = "alex.arch@skillmatch.ai";

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/name-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalName }),
      });
      const data = await response.json();

      if (!data.success) {
        console.error("Name-login failed:", data.message);
        setIsLoading(false);
        return;
      }

      const user = data.user;
      localStorage.setItem("skillmatch_token", data.token);
      localStorage.setItem("skillmatch_userId", user._id);
      localStorage.setItem("skillmatch_username", user.name);
      localStorage.setItem("skillmatch_useremail", finalEmail);

      onAuthSuccess({ name: user.name, email: finalEmail });
    } catch (err) {
      console.error("Error during Google name-login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#020617] text-gray-200 font-sans antialiased relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#d0bcff]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#00f1ab]/5 blur-[120px] rounded-full"></div>
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d0bcff_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* LEFT PANEL: Gamified Brand Side (Hidden on smaller screens, shown on md+) */}
      <section className="hidden md:flex flex-1 flex-col items-center justify-center p-12 relative bg-gradient-to-br from-[#070d1f] via-[#0c1324] to-[#151b2d] border-r border-white/5 overflow-hidden z-10">
        
        {/* Brand logo in top left with high z-index stacking to ensure absolute visibility over other layered grids */}
        <div className="absolute top-10 left-10 flex items-center gap-3 z-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d0bcff] to-[#a078ff] flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Bolt className="w-5 h-5 text-[#3c0091] fill-[#3c0091]" />
          </div>
          <span className="font-display text-xl text-white font-black tracking-tight">
            SkillMatch
          </span>
        </div>

        {/* Mascot Grid Wrapper with clear top padding to ensure it is not stacked under the absolute brand logo */}
        <div className="grid grid-cols-2 gap-6 max-w-sm w-full mt-12 mb-12">
          
          {/* Card 1: Purple Mascot */}
          <div 
            className="aspect-square rounded-3xl bg-[#a078ff] p-6 flex flex-col items-center justify-center relative shadow-2xl transition-all duration-300 hover:scale-105 hover:rotate-2 group cursor-pointer"
          >
            <div className="flex gap-4 mb-5">
              {/* Eye Left */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
              {/* Eye Right */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
            </div>
            {/* Mouth */}
            <div className="w-12 h-2.5 bg-slate-900/30 rounded-full group-hover:scale-y-120 transition-transform"></div>
          </div>

          {/* Card 2: Dark Slate Mascot */}
          <div 
            className="aspect-square rounded-3xl bg-[#2e3447] p-6 flex flex-col items-center justify-center relative shadow-2xl transition-all duration-300 hover:scale-105 hover:-rotate-2 group cursor-pointer"
          >
            <div className="flex gap-4 mb-4">
              {/* Eye Left */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
              {/* Eye Right */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
            </div>
            {/* Curved Smile Mouth */}
            <div className="w-8 h-4 border-b-4 border-slate-900 rounded-full transition-all duration-300 group-hover:w-10"></div>
          </div>

          {/* Card 3: Orange Mascot */}
          <div 
            className="aspect-square rounded-3xl bg-orange-400 p-6 flex flex-col items-center justify-center relative shadow-2xl transition-all duration-300 hover:scale-105 hover:-rotate-2 group cursor-pointer"
          >
            <div className="flex gap-4 mb-5">
              {/* Eye Left */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
              {/* Eye Right */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
            </div>
            {/* Cute Double Dot Mouth */}
            <div className="flex gap-1.5 justify-center items-center">
              <div className="w-2.5 h-2.5 bg-slate-900/30 rounded-full group-hover:scale-125 transition-transform"></div>
              <div className="w-2.5 h-2.5 bg-slate-900/30 rounded-full group-hover:scale-125 transition-transform"></div>
            </div>
          </div>

          {/* Card 4: Neon Green Mascot */}
          <div 
            className="aspect-square rounded-3xl bg-[#00f1ab] p-6 flex flex-col items-center justify-center relative shadow-2xl transition-all duration-300 hover:scale-105 hover:rotate-2 group cursor-pointer"
          >
            <div className="flex gap-4 mb-5">
              {/* Eye Left */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
              {/* Eye Right */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                <div 
                  className="w-3.5 h-3.5 bg-slate-900 rounded-full transition-transform duration-100 ease-out"
                  style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                />
              </div>
            </div>
            {/* Simple rounded line mouth */}
            <div className="w-10 h-3 bg-[#002114]/20 rounded-full group-hover:w-6 transition-all"></div>
          </div>

        </div>

        {/* Brand Mission Subtitles */}
        <div className="text-center max-w-sm space-y-4 px-4">
          <h2 className="font-display text-2xl md:text-3xl text-white font-extrabold tracking-tight leading-tight">
            Your career path, <br/>
            <span className="bg-gradient-to-r from-[#d0bcff] to-[#00f1ab] bg-clip-text text-transparent font-black">
              fully unlocked.
            </span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">
            Join 200,000+ professionals leveling up their skills through gamified learning and AI insights.
          </p>
        </div>

      </section>

      {/* RIGHT PANEL: Credentials Form Side */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 relative bg-[#020617] z-10">
        
        {/* Mobile Brand Header */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d0bcff] to-[#a078ff] flex items-center justify-center">
            <Bolt className="w-4 h-4 text-[#3c0091] fill-[#3c0091]" />
          </div>
          <span className="font-display text-lg text-white font-black tracking-tight">
            SkillMatch
          </span>
        </div>

        <div className="w-full max-w-md space-y-8">
          
          {/* Welcome Intro headers */}
          <div className="space-y-3">
            <h1 className="font-display text-2xl md:text-3xl text-white font-extrabold tracking-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-gray-400">
              {isSignUp ? "Join SkillMatch today to discover your cognitive learning profile." : "Enter your credentials to access your dashboard and active path."}
            </p>
          </div>

          {/* Auth Tab Switcher at the top of the form */}
          <div className="grid grid-cols-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                !isSignUp
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                isSignUp
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Credentials Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Field (Rendered Dynamically for SignUp) */}
            {isSignUp && (
              <div className="space-y-1.5 transition-all duration-300">
                <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">
                  Your Name
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d0bcff] transition-colors">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Alex Dev"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#050b18] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d0bcff] focus:ring-1 focus:ring-[#d0bcff]/40 transition-all shadow-[0_0_20px_rgba(208,188,255,0.02)]"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d0bcff] transition-colors">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050b18] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d0bcff] focus:ring-1 focus:ring-[#d0bcff]/40 transition-all shadow-[0_0_20px_rgba(208,188,255,0.02)]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                {!isSignUp && (
                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); alert("Use any mock credentials for quick testing in development."); }}
                    className="text-[11px] font-bold text-[#d0bcff] hover:text-[#00f1ab] transition-colors animate-pulse"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d0bcff] transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050b18] border border-white/5 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d0bcff] focus:ring-1 focus:ring-[#d0bcff]/40 transition-all shadow-[0_0_20px_rgba(208,188,255,0.02)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me toggle row */}
            <div className="flex items-center gap-3 py-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-[#050b18] text-[#a078ff] focus:ring-offset-[#020617] focus:ring-[#a078ff]"
              />
              <label htmlFor="remember" className="text-xs text-gray-400 font-medium cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            {/* Action submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-[#d0bcff] to-[#a078ff] hover:from-[#e9ddff] hover:to-[#bfa3ff] text-[#3c0091] font-display text-sm font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-purple-600/15 hover:shadow-purple-600/35 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#3c0091] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Log in"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Third party prompt header */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Third-party Google authenticating block */}
          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors font-medium text-sm text-gray-300 hover:text-white cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google Workspace Account
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}





