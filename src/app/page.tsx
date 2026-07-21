"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SplashScreen } from "@/components/SplashScreen";
import { AuthModal } from "@/components/AuthModal";
import { VisitorAiChatbot } from "@/components/VisitorAiChatbot";
import { Simulator } from "@/components/Simulator";
import { AiCreditWidget } from "@/components/AiCreditWidget";
import { getLocalAuthState, setLocalAuthState, UserProfile } from "@/lib/supabase/client";
import {
  Sparkles,
  Gamepad2,
  CheckCircle2,
  Cpu,
  Code2,
  ShieldCheck,
  Video,
  Zap,
  ArrowRight,
  UserCheck,
  Star,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState<"consumer" | "developer">("consumer");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [includeAiUpgrade, setIncludeAiUpgrade] = useState(true);

  useEffect(() => {
    const existingUser = getLocalAuthState();
    if (existingUser) setUser(existingUser);
  }, []);

  const handleLogout = () => {
    setLocalAuthState(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-void-purple selection:text-white">
      {/* Boot sequence splash screen */}
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}

      {/* Header Navbar */}
      <Header
        mode={mode}
        onModeChange={(m) => setMode(m)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-12 text-center relative">
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-void-purple rounded-full blur-[100px] animate-pulse"></div>
          </div>

          {/* Dynamic Mode Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-950/20 text-xs text-purple-300 text-glow mb-6 font-mono">
            <span className="w-2 h-2 rounded-full bg-void-cyan animate-ping"></span>
            <span>
              {mode === "consumer"
                ? "CONSUMER MODE: TURNKEY GAMIFIED LIFE OS & SAAS"
                : "DEVELOPER MODE: SOURCE CODE & SELF-HOSTING PASSES"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-mono leading-tight max-w-4xl mx-auto text-white">
            The Gamified Life OS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-void-purple via-indigo-400 to-void-cyan">
              You Deploy & Own.
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {mode === "consumer"
              ? "Ditch expensive subscription habit-trackers. Turnkey cloud Life OS apps with complete data sovereignty and gamified progress loops."
              : "Complete source code, Supabase database schemas, self-hosting scripts, and unfiltered weekly developer video logs."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-void-purple to-void-blue text-white hover:opacity-95 transition-all glow-purple flex items-center justify-center gap-2 min-h-[44px]"
            >
              <UserCheck className="w-4 h-4" /> Register Free Account
            </button>
            <a
              href="#pricing-section"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-bold text-xs border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white transition-all bg-black/40 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {mode === "consumer" ? "View SaaS Pricing ($10/mo)" : "View Developer Passes ($15+)"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* AI CREDIT WIDGET DISPLAY (FOR LOGGED IN USERS) */}
        {user && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <AiCreditWidget user={user} onUpdateProfile={(u) => setUser(u)} />
          </section>
        )}

        {/* DEVELOPER EXCLUSIVE ARCHITECTURE SPECS (ONLY IN DEV MODE) */}
        {mode === "developer" && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="bg-zinc-950 border border-cyan-500/30 rounded-2xl p-6 font-mono shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] text-void-cyan font-bold uppercase tracking-widest">
                    SELF-HOSTED ARCHITECTURE
                  </span>
                  <h3 className="text-xl font-bold text-white">VOID OS Developer Architecture</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-void-cyan text-xs border border-cyan-800">
                    Supabase RLS
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-purple-950 text-purple-300 text-xs border border-purple-800">
                    Next.js App Router
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-void-purple mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Data Sovereignty
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Full PostgreSQL schemas with strict Row Level Security. Export habit logs anytime to local vault.
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-void-cyan mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> BYOK AI Integration
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Supply your own API key (Claude, OpenAI, Gemini, Grok) to power workflow triggers.
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <Video className="w-4 h-4" /> Developer Devlogs
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Immediate source code packages and weekly YouTube unlisted video logs.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* INTERACTIVE PLAYABLE SIMULATOR SANDBOX */}
        <Simulator />

        {/* WATCH THE DEV PASS PROPOSITION SECTION */}
        <section id="devlog-section" className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="bg-gradient-to-br from-indigo-950/40 via-[#100f1a] to-black border border-purple-500/30 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 space-y-4 font-mono">
              <span className="text-xs uppercase tracking-widest text-void-purple font-bold">
                EXCLUSIVES IN THE LAB
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                The $15 "Watch-The-Dev" Builder Pass
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Be part of the active 3amCEO dev ecosystem. Instead of pre-ordering blindly, get lifetime access to the <strong>Watch-the-Dev Portal</strong>.
              </p>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 text-zinc-300">
                  <Video className="w-4 h-4 text-void-purple flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Weekly Unlisted YouTube Devlogs:</strong> Behind-the-scenes database logic & engineering pipeline videos.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-300">
                  <Code2 className="w-4 h-4 text-void-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Written Engineering Deep Dives:</strong> Clean blog post write-ups explaining tech decisions.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-300">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Direct Community Chat:</strong> Dedicated chat room to share ideas directly with Dave.
                  </div>
                </li>
              </ul>
            </div>

            <div className="lg:w-1/2 w-full bg-black/60 border border-zinc-800 p-6 rounded-2xl font-mono text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">LIMITED KICKSTARTER PASS</span>
              <div className="mt-2 text-3xl font-black text-white">$15 <span className="text-xs text-zinc-400 font-normal">($25 post-campaign)</span></div>
              <p className="text-xs text-zinc-400 mt-2 mb-6">Unlock immediate portal access + weekly devlogs + community chat.</p>

              <a
                href="/dev-journey"
                className="block w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-void-purple to-void-blue text-white glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all min-h-[44px] flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" /> Launch Dev Journey Portal
              </a>
            </div>
          </div>
        </section>

        {/* PRICING SECTION (CONSUMER VS DEVELOPER MODES) */}
        <section id="pricing-section" className="max-w-7xl mx-auto px-4 md:px-6 py-12 font-mono">
          {mode === "consumer" ? (
            /* CONSUMER MODE: SaaS PRICING TIERS */
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Turnkey Cloud SaaS Plans</h2>
                <p className="text-zinc-400 mt-2 text-xs md:text-sm">
                  Hosted directly on cloud web apps with zero configuration required.
                </p>

                {/* +$10/mo AI Upgrade Toggle Card */}
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-purple-500/40 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-void-cyan border border-purple-500/30">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        Add AI Upgrade <span className="text-void-cyan">+$10.00 / mo</span>
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        Uses server-side OpenAI credits with dual bank tracking (Monthly Allowance + Top-Up Credits).
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeAiUpgrade}
                    onChange={(e) => setIncludeAiUpgrade(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-700 bg-black text-void-purple focus:ring-void-purple cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Starter SaaS */}
                <div className="bg-void-card/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Starter SaaS</span>
                    <h3 className="text-xl font-bold text-white mt-1">Starter Account</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        ${10 + (includeAiUpgrade ? 10 : 0)}
                      </span>
                      <span className="text-xs text-zinc-400">/ month</span>
                    </div>
                    {includeAiUpgrade && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px]">
                        +$10 AI Upgrade Included
                      </span>
                    )}
                    <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                      Access to any 3 modular apps + standard cloud sync backups.
                    </p>
                    <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-purple" /> Any 3 Modular App Installs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-purple" /> Standard Ops Dashboard
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-purple" /> Cloud Sync Backups
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="mt-8 w-full py-3 rounded-xl border border-zinc-800 hover:border-purple-500/40 text-center font-bold text-xs text-zinc-300 hover:text-white bg-black/40 min-h-[44px]"
                  >
                    Select Starter
                  </button>
                </div>

                {/* Pro Standard */}
                <div className="bg-void-card/80 border border-purple-500/50 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl glow-purple">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-void-purple text-white text-[9px] font-bold uppercase tracking-wider">
                    MOST POPULAR
                  </span>
                  <div>
                    <span className="text-[10px] text-purple-400 uppercase font-bold">Standard SaaS</span>
                    <h3 className="text-xl font-bold text-white mt-1">Pro Standard</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        ${15 + (includeAiUpgrade ? 10 : 0)}
                      </span>
                      <span className="text-xs text-zinc-400">/ month</span>
                    </div>
                    {includeAiUpgrade && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px]">
                        +$10 AI Upgrade Included
                      </span>
                    )}
                    <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                      Access to 10 modular apps + priority cloud performance.
                    </p>
                    <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-purple" /> 10 Modular App Installs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-purple" /> Priority Sync Engine
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-purple" /> Full Battle Board Access
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs glow-purple min-h-[44px]"
                  >
                    Select Pro Standard
                  </button>
                </div>

                {/* All Access */}
                <div className="bg-void-card/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">All-Access SaaS</span>
                    <h3 className="text-xl font-bold text-white mt-1">All-Access VIP</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        ${25 + (includeAiUpgrade ? 10 : 0)}
                      </span>
                      <span className="text-xs text-zinc-400">/ month</span>
                    </div>
                    {includeAiUpgrade && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px]">
                        +$10 AI Upgrade Included
                      </span>
                    )}
                    <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                      Unlocks every app in the VOID OS ecosystem + VIP community chat.
                    </p>
                    <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-cyan" /> Unlimited Ecosystem Apps
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-cyan" /> VIP Community Chat Room
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-void-cyan" /> Executive Analytics Dashboard
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="mt-8 w-full py-3 rounded-xl border border-zinc-800 hover:border-cyan-500/40 text-center font-bold text-xs text-zinc-300 hover:text-white bg-black/40 min-h-[44px]"
                  >
                    Select All-Access
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* DEVELOPER MODE: DEVELOPER & SELF-HOSTER PASSES */
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Developer & Self-Hoster Passes</h2>
                <p className="text-zinc-400 mt-2 text-xs md:text-sm">
                  Full source code packages, self-hosting scripts, and complete data sovereignty (BYOK AI model).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Watch The Dev Pass */}
                <div className="bg-void-card/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Watch-The-Dev</span>
                    <h3 className="text-xl font-bold text-white mt-1">Builder Pass</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$15</span>
                      <span className="text-xs text-zinc-400">one-time</span>
                    </div>
                    <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                      Unfiltered weekly YouTube unlisted devlog videos + engineering blog posts + community chat.
                    </p>
                  </div>
                  <a
                    href="/dev-journey"
                    className="mt-8 block w-full py-3 rounded-xl border border-zinc-800 text-center font-bold text-xs text-zinc-300 hover:text-white bg-black/40 min-h-[44px] flex items-center justify-center"
                  >
                    Get Builder Pass
                  </a>
                </div>

                {/* Modular Pass */}
                <div className="bg-void-card/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Modular Self-Host</span>
                    <h3 className="text-xl font-bold text-white mt-1">Modular Pass</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$100</span>
                      <span className="text-xs text-zinc-400">one-time</span>
                    </div>
                    <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                      One standalone app paired with Daily Ops. BYOK AI integration included.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="mt-8 w-full py-3 rounded-xl border border-zinc-800 text-center font-bold text-xs text-zinc-300 hover:text-white bg-black/40 min-h-[44px]"
                  >
                    Get Modular Pass
                  </button>
                </div>

                {/* Extended Bundle */}
                <div className="bg-void-card/60 border border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-void-cyan uppercase font-bold">Full Bundle</span>
                    <h3 className="text-xl font-bold text-white mt-1">Extended Bundle</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$750</span>
                      <span className="text-xs text-zinc-400">one-time</span>
                    </div>
                    <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                      All 10 core apps + complete video guides/tutorials + lifetime updates.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="mt-8 w-full py-3 rounded-xl bg-void-cyan text-slate-950 font-bold text-xs min-h-[44px]"
                  >
                    Get Full Bundle
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating Public Gideon Assistant */}
      <VisitorAiChatbot />

      {/* Register/Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-4 font-mono text-center text-xs text-zinc-500 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 VOID OS — Value Oriented Infrastructure Design. All rights reserved.</div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Supabase RLS Data Sovereignty</span>
            <span>Stripe Payment Ready</span>
            <span>Gideon AI System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
