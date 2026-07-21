"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { VisitorAiChatbot } from "@/components/VisitorAiChatbot";
import { getLocalAuthState, setLocalAuthState, UserProfile, DevlogEntry } from "@/lib/supabase/client";
import { Video, Lock, Unlock, Play, FileText, ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";

export default function DevJourneyPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const devlogs: DevlogEntry[] = [
    {
      id: "1",
      title: "Devlog #14: Architecture of VOID OS, Supabase RLS & Dual AI Banks",
      slug: "devlog-14-architecture-ai-banks",
      content_md: `Welcome to Devlog #14! In this post and unlisted video, we walk through how we built the **Next.js + Supabase + Tailwind CSS** architecture for VOID OS.

### Key Topics Covered Today:
1. **Data Sovereignty:** Structuring Supabase PostgreSQL schemas with Row Level Security (RLS) so users own their habit data.
2. **Dual Credit-Bank AI Tracking:** Implementing Bank 1 (Monthly Token Allowance) and Bank 2 (Non-expiring Top-Up Credits) for the $10/mo SaaS AI Upgrade.
3. **Gideon Public & Admin AI Assistant:** Wiring transcript logging for visitor objection analytics.`,
      youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      is_locked: true,
      created_at: "2026-07-21",
    },
    {
      id: "2",
      title: "Devlog #13: Daily Ops & Battle Board Simulator Engine",
      slug: "devlog-13-daily-ops-battle-board",
      content_md: `In Devlog #13, we break down the modular engine powering the Daily Ops task runner and the 4x3 Battle Board Bingo grid. We cover touch target optimization, XP math formulas, and streak counters!`,
      youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      is_locked: true,
      created_at: "2026-07-14",
    },
  ];

  useEffect(() => {
    const existing = getLocalAuthState();
    if (existing) {
      setUser(existing);
      if (existing.has_dev_pass || existing.role === "admin") {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleSimulatePurchase = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    const updated: UserProfile = { ...user, has_dev_pass: true };
    setLocalAuthState(updated);
    setUser(updated);
    setIsUnlocked(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-void-purple selection:text-white">
      <Header
        mode="developer"
        onModeChange={() => {}}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setLocalAuthState(null);
          setUser(null);
          setIsUnlocked(false);
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-void-purple font-bold text-xs uppercase tracking-widest">
              <Video className="w-4 h-4 text-purple-400" /> Watch-The-Dev Portal
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white mt-1">Dave's Developer Journey</h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Unfiltered video devlogs, unlisted YouTube deep dives, and written engineering logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Unlock className="w-4 h-4 text-emerald-400" /> Pass Unlocked
              </span>
            ) : (
              <button
                onClick={handleSimulatePurchase}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs glow-purple hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" /> Unlock Builder Pass ($15)
              </button>
            )}
          </div>
        </div>

        {/* Devlog Entries Feed */}
        <div className="space-y-8">
          {devlogs.map((log) => (
            <article key={log.id} className="bg-[#100f1a] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                <span className="text-void-cyan font-bold">{log.created_at}</span>
                <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px]">Weekly Video Devlog</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{log.title}</h2>

              {/* Video Player Box */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800 aspect-video mb-6 flex items-center justify-center">
                {isUnlocked ? (
                  <iframe
                    src={log.youtube_url}
                    title={log.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-void-purple" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Devlog Locked</h3>
                    <p className="text-xs text-zinc-400 max-w-md mt-1 mb-4">
                      Unlock the $15 Watch-the-Dev Builder Pass to view unfiltered YouTube unlisted video logs and engineering tutorials.
                    </p>
                    <button
                      onClick={handleSimulatePurchase}
                      className="px-6 py-3 rounded-xl bg-void-purple hover:bg-purple-600 text-white font-bold text-xs glow-purple transition-all"
                    >
                      Unlock Pass for $15
                    </button>
                  </div>
                )}
              </div>

              {/* Written Blog Markdown Content */}
              <div className={`prose prose-invert max-w-none text-xs md:text-sm text-zinc-300 leading-relaxed ${!isUnlocked ? "blur-sm select-none" : ""}`}>
                <div className="whitespace-pre-line">{log.content_md}</div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <VisitorAiChatbot />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(u) => setUser(u)} />
    </div>
  );
}
