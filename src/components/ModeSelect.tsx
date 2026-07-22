"use client";

import React from "react";
import { User, Code, ArrowRight, Gamepad2, ShieldCheck, Cpu, Video } from "lucide-react";

interface ModeSelectProps {
  onSelect: (mode: "consumer" | "developer") => void;
}

export const ModeSelect: React.FC<ModeSelectProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-4 py-10 bg-[#050409]/95 backdrop-blur-md overflow-y-auto">
      <div className="text-center mb-8 font-mono">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-950/20 text-[10px] text-purple-300 uppercase tracking-widest mb-5">
          <span className="w-2 h-2 rounded-full bg-void-cyan animate-ping"></span>
          Select your path
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-white">
          How do you want to run VOID OS?
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-3 max-w-lg mx-auto">
          Pick a mode to tailor the experience. You can switch anytime with the toggle in the header.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
        {/* CONSUMER — purple */}
        <button
          onClick={() => onSelect("consumer")}
          className="group text-left rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-[#120f1e] to-black p-6 md:p-7 hover:border-purple-400 hover:scale-[1.02] active:scale-[0.99] transition-all glow-purple"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-5">
            <User className="w-6 h-6 text-void-purple" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">Consumer Mode</span>
          <h2 className="text-xl font-black text-white font-mono mt-1">Turnkey Cloud SaaS</h2>
          <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
            Ready-to-use gamified Life OS apps hosted for you. Zero setup, monthly plans, optional AI upgrade.
          </p>
          <ul className="mt-4 space-y-2 text-[11px] font-mono text-zinc-300">
            <li className="flex items-center gap-2"><Gamepad2 className="w-3.5 h-3.5 text-void-purple" /> Gamified XP & Battle Board</li>
            <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-void-purple" /> Server-side AI credits</li>
          </ul>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-void-purple group-hover:gap-2.5 transition-all">
            Enter Consumer <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        {/* DEVELOPER — blue */}
        <button
          onClick={() => onSelect("developer")}
          className="group text-left rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-950/50 via-[#0b1120] to-black p-6 md:p-7 hover:border-blue-400 hover:scale-[1.02] active:scale-[0.99] transition-all glow-blue"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mb-5">
            <Code className="w-6 h-6 text-void-blue" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-300 font-bold">Developer Mode</span>
          <h2 className="text-xl font-black text-white font-mono mt-1">Source & Self-Host</h2>
          <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
            Full source code, Supabase schemas, self-hosting scripts, BYOK AI, and unfiltered weekly devlogs.
          </p>
          <ul className="mt-4 space-y-2 text-[11px] font-mono text-zinc-300">
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-void-blue" /> Complete data sovereignty</li>
            <li className="flex items-center gap-2"><Video className="w-3.5 h-3.5 text-void-blue" /> Watch-the-Dev portal access</li>
          </ul>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-void-blue group-hover:gap-2.5 transition-all">
            Enter Developer <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
};
