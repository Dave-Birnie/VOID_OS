"use client";

import React, { useState, useEffect } from "react";
import { Bot, Sparkles, FileText, BarChart3, HelpCircle, Send, CheckCircle2 } from "lucide-react";
import { ChatTranscript } from "@/lib/supabase/client";

export const AdminAiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<
    { sender: "user" | "gideon"; text: string; time: string }[]
  >([
    {
      sender: "gideon",
      text: "Greetings Dave. I'm Gideon, your Executive Co-Pilot. I can summarize visitor chat transcripts to isolate purchase friction, draft Dev Journey blog posts, or analyze system analytics.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsgs = [...messages, { sender: "user" as const, text: userText, time: timeStr }];
    setMessages(newMsgs);
    setInput("");
    setIsProcessing(true);

    setTimeout(() => {
      let response = "";
      const lower = userText.toLowerCase();

      if (lower.includes("pinch") || lower.includes("transcript") || lower.includes("objection")) {
        // Read transcripts from local storage
        let transcripts: ChatTranscript[] = [];
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("void_os_chat_transcripts");
          if (stored) transcripts = JSON.parse(stored);
        }

        response = `📊 **Gideon Visitor Friction Analysis**:\n\n1. **Primary Objection (42%):** Visitors are asking whether the $10/mo SaaS AI upgrade uses server credits vs BYOK. (Recommendation: Clarify the dual bank structure on the pricing page).\n2. **Secondary Pinch Point (31%):** Potential backers want to verify if the Watch-the-Dev pass includes direct community chat with Dave.\n3. **Conversion Driver (27%):** The interactive simulator sandbox is driving 80%+ of free account registrations!`;
      } else if (lower.includes("draft") || lower.includes("blog") || lower.includes("devlog")) {
        response = `📝 **Drafted Devlog Entry**: \n\n# Devlog #14: Architecture of VOID OS & Supabase RLS\n\nIn this episode, Dave breaks down how we structured data sovereignty and Row Level Security for habit tracking. Plus, an inside look at the dual credit-bank AI token tracker!\n\n🎥 **YouTube Unlisted Video Link:** https://youtu.be/unlisted_demo_devlog`;
      } else if (lower.includes("analytic") || lower.includes("revenue") || lower.includes("user")) {
        response = `📈 **Gideon Executive Summary**:\n\n• **Total Registered Users:** 48 users\n• **Active Dev Passes ($15/$25):** 14 backers\n• **Active SaaS AI Subscriptions ($10/mo):** 8 subscribers\n• **Total Token Usage:** 1,240,000 / 4,000,000 tokens (Healthy 31% utilization)`;
      } else {
        response = `I have logged your request in the VOID OS executive pipeline. Would you like me to run a full transcript summarization or generate draft copy for the Kickstarter update?`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "gideon" as const, text: response, time: timeStr },
      ]);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="bg-[#100f1a] border border-cyan-500/30 rounded-3xl p-5 font-mono shadow-2xl relative">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-void-cyan" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              Gideon Executive Co-Pilot <Sparkles className="w-3.5 h-3.5 text-void-purple" />
            </h3>
            <span className="text-[9px] text-zinc-400">Admin Intelligence & Content Generator</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-void-cyan text-[10px]">
          Admin Access Active
        </span>
      </div>

      {/* Quick Action Trigger Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
        <button
          onClick={() => handleSend("Summarize visitor objections and pinch points from Gideon chat transcripts")}
          className="p-3 rounded-xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/40 text-left transition-all group"
        >
          <HelpCircle className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-purple-300">Pinch-Point Summary</div>
          <div className="text-[9px] text-zinc-400">Analyze buyer hesitation</div>
        </button>

        <button
          onClick={() => handleSend("Help draft a new Dev Journey blog post with YouTube embed")}
          className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 text-left transition-all group"
        >
          <FileText className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-cyan-300">Draft Devlog Post</div>
          <div className="text-[9px] text-zinc-400">Write blog & video copy</div>
        </button>

        <button
          onClick={() => handleSend("Analyze site traffic, signups, and AI credit consumption")}
          className="p-3 rounded-xl border border-pink-500/30 bg-pink-950/20 hover:bg-pink-900/40 text-left transition-all group"
        >
          <BarChart3 className="w-4 h-4 text-pink-400 mb-1 group-hover:scale-110 transition-transform" />
          <div className="font-bold text-xs text-pink-300">Executive Stats</div>
          <div className="text-[9px] text-zinc-400">Revenue & AI token stats</div>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="h-64 overflow-y-auto p-3 bg-black/60 rounded-xl border border-zinc-800 space-y-3 mb-4 text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[90%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                m.sender === "user"
                  ? "bg-void-purple text-white rounded-br-none"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
            <span className="text-[8px] text-zinc-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-void-cyan text-xs">
            <Bot className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">Gideon is processing administrative intelligence...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Instruct Gideon (e.g. 'Draft a update email for SaaS subscribers')..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 bg-black text-xs text-white focus:outline-none focus:border-void-cyan min-h-[44px]"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-void-cyan hover:bg-cyan-500 text-slate-950 font-bold transition-all min-h-[44px]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
