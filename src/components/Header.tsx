"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Code, LogIn, LogOut, Shield, MessageSquare, Video, FileText, LayoutDashboard } from "lucide-react";
import { UserProfile, createBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface HeaderProps {
  mode: "consumer" | "developer";
  // Optional so the Header can be rendered from Server Components (gated
  // member pages) where no client mode-toggle handler is passed.
  onModeChange?: (mode: "consumer" | "developer") => void;
  // Fired when the logo or Overview is clicked (used on the landing page to
  // reset back to Consumer view). Optional on pages where it doesn't apply.
  onHome?: () => void;
  user: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({ mode, onModeChange, onHome, user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await createBrowserSupabase().auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-void-black/80 border-b border-zinc-800/80 py-3.5 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" aria-label="VOID OS home" onClick={onHome} className="flex items-center gap-3 group">
          <div className="w-9 h-9 relative">
            <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className="w-full h-full drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] group-hover:scale-105 transition-transform">
              <path d="M 100,20 A 80,80 0 0,1 175,75" fill="none" stroke="url(#logoGrad)" strokeWidth="12"/>
              <path d="M 100,20 A 80,80 0 0,0 25,75" fill="none" stroke="url(#logoGrad)" strokeWidth="12"/>
              <path d="M 25,125 A 80,80 0 0,0 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="12"/>
              <path d="M 175,125 A 80,80 0 0,1 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="12"/>
              <path d="M 30,75 L 100,165 L 170,75 L 132,75 L 100,125 L 68,75 Z" fill="url(#logoGrad)"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-void-purple via-indigo-400 to-void-cyan font-mono">
              VOID OS
            </span>
            <span className="hidden sm:block text-[8px] tracking-widest text-zinc-400 font-mono uppercase">
              Value Oriented Infrastructure Design
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-300">
          <Link href="/" onClick={onHome} className="hover:text-void-purple transition-colors">
            Overview
          </Link>
          <Link href="/blog" className="flex items-center gap-1.5 hover:text-void-purple transition-colors">
            <FileText className="w-3.5 h-3.5 text-void-purple" aria-hidden="true" />
            Blog
          </Link>
          {/* Members-only areas — shown to signed-in accounts only */}
          {user && (
            <>
              <Link href="/dev-journey" className="flex items-center gap-1.5 hover:text-void-cyan transition-colors">
                <Video className="w-3.5 h-3.5 text-void-purple" />
                Dev Journey
              </Link>
              <Link href="/community-chat" className="flex items-center gap-1.5 hover:text-void-pink transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-void-pink" />
                Community Chat
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300 transition-colors">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Admin CMS
            </Link>
          )}
        </nav>

        {/* Controls & User Profile */}
        <div className="flex items-center gap-3">
          {/* CONSUMER vs DEVELOPER Mode Toggle */}
          <div className="bg-zinc-900/90 p-1 rounded-full border border-zinc-800 flex items-center shadow-inner">
            <button
              onClick={() => onModeChange?.("consumer")}
              aria-label="Switch to Consumer mode"
              aria-pressed={mode === "consumer"}
              className={`px-3 py-1 md:px-3.5 md:py-1 rounded-full text-[10px] md:text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                mode === "consumer"
                  ? "bg-void-purple text-white shadow-md glow-purple"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <User className="w-3 h-3" aria-hidden="true" /> <span className="hidden sm:inline">Consumer</span>
            </button>
            <button
              onClick={() => onModeChange?.("developer")}
              aria-label="Switch to Developer mode"
              aria-pressed={mode === "developer"}
              className={`px-3 py-1 md:px-3.5 md:py-1 rounded-full text-[10px] md:text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                mode === "developer"
                  ? "bg-void-cyan text-slate-950 shadow-md glow-cyan"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Code className="w-3 h-3" aria-hidden="true" /> <span className="hidden sm:inline">Developer</span>
            </button>
          </div>

          {/* User Auth state */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col items-end text-right font-mono">
                <span className="text-xs font-bold text-white">{user.full_name || user.email}</span>
                <span className="text-[9px] text-void-cyan">
                  {user.role === "admin" ? "⚡ Admin Account" : user.has_dev_pass ? "⭐ Dev Pass Active" : "Free User"}
                </span>
              </div>
              <Link
                href="/dashboard"
                title="Dashboard"
                aria-label="Dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-void-purple/40 text-void-purple hover:text-white hover:border-void-purple transition-all bg-purple-950/20 text-xs font-bold"
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  title="Admin CMS"
                  aria-label="Admin CMS"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/40 text-amber-300 hover:text-amber-200 hover:border-amber-500 transition-all bg-amber-950/20 text-xs font-bold"
                >
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">CMS</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                title="Sign Out"
                aria-label="Sign out"
                className="p-2 rounded-xl border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition-all bg-black/30"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full font-mono font-bold text-xs tracking-wider uppercase transition-all bg-gradient-to-r from-void-purple to-void-blue text-white glow-purple hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
