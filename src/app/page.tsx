"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { SplashScreen } from "@/components/SplashScreen";
import { ModeSelect } from "@/components/ModeSelect";
import { VisitorAiChatbot } from "@/components/VisitorAiChatbot";
import { Simulator } from "@/components/Simulator";
import { AiCreditWidget } from "@/components/AiCreditWidget";
import { Waitlist } from "@/components/Waitlist";
import { useSessionProfile } from "@/lib/useSessionProfile";
import {
  Gamepad2,
  CheckCircle2,
  Cpu,
  Code2,
  ShieldCheck,
  Video,
  Zap,
  ArrowRight,
  UserCheck,
  CloudCog,
  Trophy,
  KeyRound,
  Terminal,
  Boxes,
  Tag,
  Crown,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [modeChosen, setModeChosen] = useState(true);
  const [mode, setMode] = useState<"consumer" | "developer">("consumer");
  const [includeAiUpgrade, setIncludeAiUpgrade] = useState(true);

  // Real Supabase session (replaces the old localStorage demo state).
  const { profile: user } = useSessionProfile();

  // Splash + path-select are a one-time intro. The splash is marked seen the
  // moment it's dismissed, so it can never reappear on the site again.
  useEffect(() => {
    if (!localStorage.getItem("void_os_splash_seen")) setShowSplash(true);
    if (!localStorage.getItem("void_os_onboarded")) setModeChosen(false);
  }, []);

  const dismissSplash = () => {
    localStorage.setItem("void_os_splash_seen", "1");
    setShowSplash(false);
  };

  const finishOnboarding = () => {
    localStorage.setItem("void_os_onboarded", "1");
    setModeChosen(true);
  };

  const goToLogin = () => router.push("/login");

  const isDev = mode === "developer";

  // Mode-driven theming: consumer = purple, developer = blue.
  const t = {
    wash: isDev ? "mode-wash-developer" : "mode-wash-consumer",
    blob: isDev ? "bg-void-blue" : "bg-void-purple",
    badgeBorder: isDev ? "border-blue-500/40" : "border-purple-500/40",
    badgeBg: isDev ? "bg-blue-950/25" : "bg-purple-950/20",
    badgeText: isDev ? "text-blue-300" : "text-purple-300",
    heroGrad: isDev ? "from-void-blue via-sky-400 to-void-cyan" : "from-void-purple via-indigo-400 to-void-cyan",
    ctaGrad: isDev ? "from-void-blue to-void-cyan" : "from-void-purple to-void-blue",
    glow: isDev ? "glow-blue" : "glow-purple",
    accentText: isDev ? "text-void-blue" : "text-void-purple",
  };

  // Kickstarter backer tiers (one-time). Mirrors the 6-tier structure in
  // VOID_OS_Master_Plan.md. Every tier includes the PDF workflow guide +
  // discount/affiliate links.
  const devPacks = [
    {
      tag: "Supporter",
      name: "Digital Supporter",
      price: "$10",
      blurb: "Back the build and get the founder's tech-stack playbook.",
      features: ["PDF Workflow Guide", "Discount & partner links", "Wall of Fame credit"],
      highlight: false,
      vip: false,
    },
    {
      tag: "Backer",
      name: "Watch-the-Dev",
      price: "$25",
      blurb: "Everything in Supporter, plus the private dev portal and raw video logs.",
      features: ["Private Dev Portal", "Raw weekly video logs", "Everything in $10 tier"],
      highlight: false,
      vip: false,
    },
    {
      tag: "Early Bird",
      name: "Early Bird Pass",
      price: "$150",
      blurb: "The VOID OS core plus Daily Ops and one app's full source code.",
      features: ["VOID OS Core + Daily Ops", "1 App source code", "Everything in $25 tier"],
      highlight: false,
      vip: false,
    },
    {
      tag: "Builder",
      name: "Core Builder Pass",
      price: "$350–450",
      blurb: "The core plus five apps of full source code.",
      features: ["VOID OS Core", "5 Apps source code", "Everything in $25 tier"],
      highlight: true,
      vip: false,
    },
    {
      tag: "Bundle",
      name: "Extended Bundle",
      price: "$999",
      blurb: "All 10 apps plus the BYOK AI integration code.",
      features: ["All 10 Apps", "BYOK AI integration code", "Everything in $25 tier"],
      highlight: false,
      vip: false,
    },
    {
      tag: "Lifetime",
      name: "Lifetime VIP",
      price: "$2,500",
      blurb: "15 apps, multi-tenant CMS, and full resell rights. Campaign only, 5 seats.",
      features: ["15 Apps + Multi-Tenant CMS", "Resell / white-label rights", "5 seats · campaign only"],
      highlight: false,
      vip: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-void-purple selection:text-white">
      {/* Mode-tinted background wash */}
      <div className={`fixed inset-0 -z-10 pointer-events-none transition-colors duration-700 ${t.wash}`} />

      {/* Boot sequence splash screen — first visit only */}
      {showSplash && <SplashScreen onDismiss={dismissSplash} />}

      {/* After splash: choose Consumer or Developer (first visit only) */}
      {!showSplash && !modeChosen && (
        <ModeSelect
          onSelect={(m) => {
            setMode(m);
            finishOnboarding();
          }}
        />
      )}

      {/* Header Navbar — logo & Overview reset to Consumer view */}
      <Header
        mode={mode}
        onModeChange={(m) => setMode(m)}
        onHome={() => setMode("consumer")}
        user={user}
      />

      <main id="main-content" className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-12 text-center relative">
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20 pointer-events-none">
            <div className={`w-[300px] h-[300px] md:w-[500px] md:h-[500px] ${t.blob} rounded-full blur-[100px] animate-pulse transition-colors duration-700`}></div>
          </div>

          {/* Dynamic Mode Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${t.badgeBorder} ${t.badgeBg} text-xs ${t.badgeText} text-glow mb-6 font-mono`}>
            <span className="w-2 h-2 rounded-full bg-void-cyan animate-ping"></span>
            <span>
              {isDev
                ? "DEVELOPER MODE: SOURCE CODE & SELF-HOSTING PASSES"
                : "VOID ONLINE: THE READY-TO-USE GAMIFIED LIFE OS"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-mono leading-tight max-w-4xl mx-auto text-white">
            {isDev ? (
              <>
                The Gamified Life OS <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${t.heroGrad}`}>
                  You Fork & Self-Host.
                </span>
              </>
            ) : (
              <>
                The Gamified Life OS <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${t.heroGrad}`}>
                  You Deploy & Own.
                </span>
              </>
            )}
          </h1>

          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {isDev
              ? "Complete source code, Supabase database schemas, self-hosting scripts, and unfiltered weekly developer video logs — with full data sovereignty and BYOK AI."
              : "Meet VOID Online — the fully-hosted, ready-to-use version. Ditch expensive subscription habit-trackers and get gamified progress with complete data sovereignty. Zero setup, sign in and go."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <button
              onClick={goToLogin}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r ${t.ctaGrad} text-white hover:opacity-95 transition-all ${t.glow} flex items-center justify-center gap-2 min-h-[44px]`}
            >
              <UserCheck className="w-4 h-4" /> Register Free Account
            </button>
            <a
              href="#pricing-section"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-bold text-xs border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white transition-all bg-black/40 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {isDev ? "View Developer Passes ($100+)" : "View VOID Online Pricing ($10/mo)"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* AI CREDIT WIDGET DISPLAY (FOR LOGGED IN USERS) */}
        {user && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <AiCreditWidget user={user} />
          </section>
        )}

        {/* VOID ONLINE WAITLIST (CONSUMER MODE) */}
        {!isDev && <Waitlist />}

        {/* CONSUMER-EXCLUSIVE VALUE GRID */}
        {!isDev && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="bg-zinc-950 border border-purple-500/30 rounded-2xl p-6 font-mono shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] text-void-purple font-bold uppercase tracking-widest">
                    VOID ONLINE · HOSTED FOR YOU
                  </span>
                  <h3 className="text-xl font-bold text-white">Ready-to-use. Gamified. Yours.</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-purple-950 text-purple-300 text-xs border border-purple-800">
                    No Setup
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-pink-950 text-pink-300 text-xs border border-pink-800">
                    Cancel Anytime
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-void-purple mb-1 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" /> Gamified Progress
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Earn XP, level up, and clear the Battle Board. Habit-tracking that actually feels rewarding.
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-void-pink mb-1 flex items-center gap-1.5">
                    <CloudCog className="w-4 h-4" /> Hosted For You
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Cloud sync, backups, and updates handled automatically. Install any modular app in one click.
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-void-cyan mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> Optional AI Copilot
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Add server-side AI for +$10/mo with dual credit banks — no API keys to manage.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DEVELOPER EXCLUSIVE ARCHITECTURE SPECS (ONLY IN DEV MODE) */}
        {isDev && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="bg-zinc-950 border border-blue-500/30 rounded-2xl p-6 font-mono shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] text-void-blue font-bold uppercase tracking-widest">
                    SELF-HOSTED ARCHITECTURE
                  </span>
                  <h3 className="text-xl font-bold text-white">VOID OS Developer Architecture</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 text-xs border border-blue-800">
                    Supabase RLS
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-void-cyan text-xs border border-cyan-800">
                    Next.js App Router
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-void-blue mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Data Sovereignty
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Full PostgreSQL schemas with strict Row Level Security. Export habit logs anytime to local vault.
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-void-cyan mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" /> BYOK AI Integration
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Supply your own API key (Claude, OpenAI, Gemini, Grok) to power workflow triggers.
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" /> Self-Hosting Scripts
                  </h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    One-command deploy scripts, migration files, and weekly YouTube engineering devlogs.
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
                The $15 &quot;Watch-The-Dev&quot; Builder Pass
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Be part of the active 3amCEO dev ecosystem. Instead of pre-ordering blindly, get lifetime access to the <strong>Watch-the-Dev Portal</strong>.
              </p>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 text-zinc-300">
                  <Video className="w-4 h-4 text-void-purple flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Weekly Unlisted YouTube Devlogs:</strong> Behind-the-scenes database logic &amp; engineering pipeline videos.
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
          {!isDev ? (
            /* CONSUMER MODE: SaaS PRICING TIERS */
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">VOID Online Plans</h2>
                <p className="text-zinc-400 mt-2 text-xs md:text-sm">
                  Fully hosted and ready to use — sign in and start, zero configuration required.
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
                        Uses server-side AI credits with dual bank tracking (Monthly Allowance + Top-Up Credits).
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
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">VOID Online · Starter</span>
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
                    onClick={goToLogin}
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
                    <span className="text-[10px] text-purple-400 uppercase font-bold">VOID Online · Standard</span>
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
                    onClick={goToLogin}
                    className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs glow-purple min-h-[44px]"
                  >
                    Select Pro Standard
                  </button>
                </div>

                {/* All Access */}
                <div className="bg-void-card/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">VOID Online · All-Access</span>
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
                    onClick={goToLogin}
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
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Developer &amp; Self-Hoster Passes</h2>
                <p className="text-zinc-400 mt-2 text-xs md:text-sm">
                  One-time purchases with full source code, self-hosting scripts, and complete data sovereignty (BYOK AI model).
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-950/25 text-[10px] text-blue-300 uppercase tracking-widest font-bold">
                  <Tag className="w-3.5 h-3.5" /> Kickstarter prices are limited-time deals
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                {devPacks.map((pack) => (
                  <div
                    key={pack.name}
                    className={`rounded-2xl p-6 flex flex-col justify-between relative transition-all ${
                      pack.vip
                        ? "bg-gradient-to-br from-amber-950/30 via-void-card/80 to-black border border-amber-500/50 shadow-xl"
                        : pack.highlight
                        ? "bg-void-card/80 border border-blue-500/50 shadow-xl glow-blue"
                        : "bg-void-card/60 border border-zinc-800 hover:border-blue-500/40"
                    }`}
                  >
                    {pack.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-void-blue text-white text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                        BEST VALUE
                      </span>
                    )}
                    {pack.vip && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                        Campaign Only
                      </span>
                    )}
                    <div>
                      <span className={`text-[10px] uppercase font-bold ${pack.vip ? "text-amber-400" : "text-blue-400"}`}>
                        {pack.tag}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                        {pack.vip && <Crown className="w-4 h-4 text-amber-400" />}
                        {pack.name}
                      </h3>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{pack.price}</span>
                        <span className="text-[10px] text-zinc-500">one-time</span>
                      </div>

                      <p className="mt-4 text-xs text-zinc-400 leading-relaxed">{pack.blurb}</p>

                      <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                        {pack.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            {pack.vip ? (
                              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            ) : (
                              <Boxes className="w-4 h-4 text-void-blue flex-shrink-0" />
                            )}
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={goToLogin}
                      className={`mt-8 w-full py-3 rounded-xl font-bold text-xs min-h-[44px] transition-all ${
                        pack.vip
                          ? "bg-amber-500 hover:bg-amber-400 text-black"
                          : pack.highlight
                          ? "bg-gradient-to-r from-void-blue to-void-cyan text-white glow-blue"
                          : "border border-zinc-800 hover:border-blue-500/40 text-zinc-300 hover:text-white bg-black/40"
                      }`}
                    >
                      {pack.vip ? "Claim a VIP Seat" : `Back — ${pack.price}`}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-center text-[11px] text-zinc-500 font-mono">
                Every tier includes the PDF workflow guide + partner discount links.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Floating Public Gideon Assistant */}
      <VisitorAiChatbot />

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
