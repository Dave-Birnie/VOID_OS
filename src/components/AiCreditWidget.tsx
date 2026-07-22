"use client";

import React, { useState } from "react";
import { Cpu, Zap, PlusCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { UserProfile } from "@/lib/supabase/client";

interface AiCreditWidgetProps {
  user: UserProfile | null;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const AiCreditWidget: React.FC<AiCreditWidgetProps> = ({ user, onUpdateProfile }) => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user) return null;

  const monthlyUsed = user.monthly_tokens_used || 124000;
  const monthlyLimit = user.monthly_token_limit || 500000;
  const extraCredits = user.extra_token_credits || 100000;
  const percentUsed = Math.min(Math.round((monthlyUsed / monthlyLimit) * 100), 100);

  const handleBuyCredits = (amount: number) => {
    const updated: UserProfile = {
      ...user,
      extra_token_credits: (user.extra_token_credits || 0) + amount,
    };
    if (onUpdateProfile) onUpdateProfile(updated);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsTopUpOpen(false);
    }, 1200);
  };

  return (
    <div className="bg-zinc-900/90 border border-purple-500/30 rounded-2xl p-4 font-mono shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-void-cyan border border-purple-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">AI Credit Banks ($10/mo Upgrade)</h4>
            <span className="text-[9px] text-zinc-400">Server-Side AI Token Allocation</span>
          </div>
        </div>
        <button
          onClick={() => setIsTopUpOpen(true)}
          className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-[10px] text-purple-300 font-bold flex items-center gap-1 transition-all glow-purple"
        >
          <PlusCircle className="w-3 h-3" /> Top Up Usage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Bank 1: Monthly Token Allowance */}
        <div className="bg-black/50 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Bank 1: Monthly Allowance
            </span>
            <span className="text-zinc-400">{percentUsed}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-gradient-to-r from-void-purple to-void-cyan h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] text-zinc-400">
            <span>{monthlyUsed.toLocaleString()} tokens used</span>
            <span>{monthlyLimit.toLocaleString()} / mo</span>
          </div>
        </div>

        {/* Bank 2: Top-Up Credits */}
        <div className="bg-black/50 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-void-cyan font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> Bank 2: Additional Credits
            </span>
            <span className="text-emerald-400 font-bold">Never Expires</span>
          </div>
          <div className="text-lg font-black text-white mt-1">
            {extraCredits.toLocaleString()} <span className="text-[10px] text-zinc-400 font-normal">Tokens</span>
          </div>
          <p className="text-[8px] text-zinc-400 mt-1">Automatically used when Bank 1 allowance depletes.</p>
        </div>
      </div>

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#100f1a] border border-cyan-500/40 rounded-2xl p-6 max-w-sm w-full font-mono text-xs">
            <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-void-cyan" /> Purchase Additional AI Usage Credits
            </h4>
            <p className="text-zinc-400 text-[11px] mb-4">
              Add non-expiring AI token credits to Bank 2. These credits are stored indefinitely and only used if your monthly allowance reaches 100%.
            </p>

            {isSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 animate-bounce" />
                <span>+500,000 Tokens Added to Bank 2!</span>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => handleBuyCredits(250000)}
                  className="w-full p-3 rounded-xl border border-zinc-800 bg-black/40 hover:border-void-cyan hover:bg-cyan-950/20 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-white">+ 250,000 AI Tokens</div>
                    <div className="text-[9px] text-zinc-400">Starter Usage Top-Up</div>
                  </div>
                  <span className="font-bold text-void-cyan text-sm">$5.00</span>
                </button>

                <button
                  onClick={() => handleBuyCredits(750000)}
                  className="w-full p-3 rounded-xl border border-purple-500/40 bg-purple-950/20 hover:border-void-purple text-left transition-all flex justify-between items-center glow-purple"
                >
                  <div>
                    <div className="font-bold text-purple-300">+ 750,000 AI Tokens</div>
                    <div className="text-[9px] text-purple-400">Popular Value Pack</div>
                  </div>
                  <span className="font-bold text-purple-300 text-sm">$12.00</span>
                </button>

                <button
                  onClick={() => handleBuyCredits(2000000)}
                  className="w-full p-3 rounded-xl border border-zinc-800 bg-black/40 hover:border-void-cyan hover:bg-cyan-950/20 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-white">+ 2,000,000 AI Tokens</div>
                    <div className="text-[9px] text-zinc-400">Power Developer Bundle</div>
                  </div>
                  <span className="font-bold text-void-cyan text-sm">$25.00</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsTopUpOpen(false)}
              className="w-full py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
