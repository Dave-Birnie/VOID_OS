"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isFading, setIsFading] = useState(false);

  const bootMessages = [
    "[SYS_INIT] Booting VOID OS Kernel v2.4.0...",
    "[SECURITY] Loading Supabase RLS Policy Handlers...",
    "[INTEGRATION] Mounting Stripe Billing Engine Hooks...",
    "[AI_CORE] Initializing Gideon Assistant & Dual Credit Banks...",
    "[STORAGE] Verifying Data Sovereignty Vaults...",
    "[SYSTEM_READY] VOID OS Active. Initializing User Interface...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootMessages.length) {
        // Capture the message synchronously. Reading bootMessages[index]
        // inside the setLogs updater would run after index++ advanced it,
        // pushing an undefined entry that later crashes the render.
        const nextMessage = bootMessages[index];
        setLogs((prev) => [...prev, nextMessage]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => triggerDismiss(), 800);
      }
    }, 350);

    // Global Key Listener: Press ANY key to skip splash immediately!
    const handleKeyDown = () => {
      triggerDismiss();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const triggerDismiss = () => {
    setIsFading(true);
    setTimeout(() => {
      onDismiss();
    }, 400);
  };

  return (
    <div
      onClick={triggerDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050409] px-4 cursor-pointer transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center w-full max-w-md text-center">
        {/* Glowing Logo Emblem */}
        <div className="relative w-36 h-36 animate-pulse mb-6">
          <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className="w-full h-full drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]">
            <defs>
              <linearGradient id="splashLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path d="M 100,20 A 80,80 0 0,1 175,75" fill="none" stroke="url(#splashLogoGrad)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 100,20 A 80,80 0 0,0 25,75" fill="none" stroke="url(#splashLogoGrad)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 25,125 A 80,80 0 0,0 100,180" fill="none" stroke="url(#splashLogoGrad)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 175,125 A 80,80 0 0,1 100,180" fill="none" stroke="url(#splashLogoGrad)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 30,75 L 100,165 L 170,75 L 132,75 L 100,125 L 68,75 Z" fill="url(#splashLogoGrad)" />
          </svg>
        </div>

        <div className="font-mono text-sm tracking-widest text-void-purple uppercase text-glow animate-pulse font-bold">
          INITIALIZING VOID OS...
        </div>

        {/* Terminal log output */}
        <div className="mt-4 font-mono text-[11px] text-zinc-400 w-full h-28 overflow-y-auto p-3 bg-black/60 rounded-xl border border-zinc-800 text-left space-y-1">
          {logs.filter(Boolean).map((msg, i) => (
            <div key={i} className="leading-snug">
              <span className="text-void-cyan font-bold">{msg.split(" ")[0]}</span> {msg.substring(msg.indexOf(" ") + 1)}
            </div>
          ))}
        </div>

        {/* Skip button prompt */}
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerDismiss();
            }}
            className="px-6 py-2.5 border border-purple-500/40 hover:border-purple-500 text-xs font-mono text-purple-300 hover:text-white rounded-full transition-all bg-purple-950/30 hover:bg-purple-900/50 flex items-center gap-1.5 glow-purple"
          >
            Skip Boot <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
            [ Press ANY key or click anywhere to skip ]
          </span>
        </div>
      </div>
    </div>
  );
};
