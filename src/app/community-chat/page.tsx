"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { VisitorAiChatbot } from "@/components/VisitorAiChatbot";
import { CommunityMessage } from "@/lib/supabase/client";
import { useSessionProfile } from "@/lib/useSessionProfile";
import { MessageSquare, Send, ArrowLeft, Shield, User } from "lucide-react";

export default function CommunityChatPage() {
  const router = useRouter();
  const { profile: user } = useSessionProfile();
  const [messages, setMessages] = useState<CommunityMessage[]>([
    {
      id: "m1",
      user_name: "Dave (Founder)",
      message: "Welcome everyone to the VOID OS Community Chat! Drop your feature ideas, UI suggestions, or app request concepts here.",
      is_admin_reply: true,
      created_at: "2026-07-21 14:00",
    },
    {
      id: "m2",
      user_name: "Alex S.",
      message: "Loving the Daily Ops XP tracker! Can we add custom category tags for gym routines?",
      is_admin_reply: false,
      created_at: "2026-07-21 14:15",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user) {
      router.push("/login?next=/community-chat");
      return;
    }

    const newMsg: CommunityMessage = {
      id: "msg_" + Date.now(),
      user_name: user.full_name || user.email.split("@")[0],
      message: input.trim(),
      is_admin_reply: user.role === "admin",
      created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-void-purple selection:text-white">
      <Header mode="consumer" onModeChange={() => {}} user={user} />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>

        <div className="border-b border-zinc-800 pb-6 mb-8">
          <div className="flex items-center gap-2 text-void-pink font-bold text-xs uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 text-void-pink" /> Community Chat Room
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white mt-1">Share Ideas & Chat with Dave</h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            Direct access idea box for VOID OS backers and community members.
          </p>
        </div>

        {/* Chat Feed */}
        <div className="bg-[#100f1a] border border-purple-500/30 rounded-3xl p-4 md:p-6 shadow-2xl h-[480px] flex flex-col justify-between">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border ${
                  m.is_admin_reply
                    ? "bg-purple-950/20 border-purple-500/40 text-purple-100"
                    : "bg-black/50 border-zinc-800 text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-white">
                    {m.is_admin_reply ? (
                      <span className="text-void-purple flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-amber-400" /> {m.user_name}
                      </span>
                    ) : (
                      <span className="text-void-cyan flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {m.user_name}
                      </span>
                    )}
                  </span>
                  <span className="text-[9px] text-zinc-500">{m.created_at}</span>
                </div>
                <p className="text-xs leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? "Type your feature idea or feedback..." : "Register free account to post messages..."}
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-800 bg-black text-xs text-white focus:outline-none focus:border-void-pink min-h-[44px]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-void-pink hover:bg-pink-600 text-white font-bold text-xs glow-pink transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      </main>

      <VisitorAiChatbot />
    </div>
  );
}
