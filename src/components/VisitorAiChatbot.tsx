"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, HelpCircle } from "lucide-react";
import { ChatTranscript } from "@/lib/supabase/client";

export const VisitorAiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "gideon"; text: string; time: string }[]
  >([
    {
      sender: "gideon",
      text: "Greetings! I'm Gideon, your VOID OS Assistant. Are you interested in VOID Online (our ready-to-use hosted version) or self-hosting as a Developer? Ask me anything about our passes, BYOK AI model, or Watch-the-Dev logs!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = "sess_" + Math.random().toString(36).substr(2, 9);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Log full conversation transcript for Admin Pinch-Point Analysis
  const logTranscript = (updatedMessages: typeof messages) => {
    if (typeof window === "undefined") return;
    const existing = localStorage.getItem("void_os_chat_transcripts");
    let transcripts: ChatTranscript[] = existing ? JSON.parse(existing) : [];

    const existingIndex = transcripts.findIndex((t) => t.session_id === sessionIdRef.current);
    const transcriptObj: ChatTranscript = {
      id: sessionIdRef.current,
      session_id: sessionIdRef.current,
      messages: updatedMessages,
      summary: "Visitor inquiring about VOID OS tiers & setup",
      pinch_points: ["Interested in SaaS vs BYOK difference", "Evaluating Watch-the-Dev pass price"],
      created_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      transcripts[existingIndex] = transcriptObj;
    } else {
      transcripts.push(transcriptObj);
    }

    localStorage.setItem("void_os_chat_transcripts", JSON.stringify(transcripts));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsgs = [...messages, { sender: "user" as const, text: userText, time: timeStr }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    // Knowledge Engine Response Logic for Gideon
    setTimeout(() => {
      let gideonReply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("price") || lower.includes("cost") || lower.includes("plan")) {
        gideonReply =
          "VOID OS offers two paths! 1) VOID Online (our hosted version) starting at $10/mo ($15/mo Pro, $25/mo All-Access) with an optional $10/mo AI Upgrade. 2) Developer Passes ranging from the $15 Watch-the-Dev Pass up to the $750 Extended Bundle & $2,500 Lifetime VIP!";
      } else if (lower.includes("ai") || lower.includes("token") || lower.includes("byok")) {
        gideonReply =
          "Every app is AI-integrated via Bring-Your-Own-Key (BYOK) — plug in your own key for Claude, OpenAI, Gemini, or Grok. The optional $10/mo VOID Online AI Upgrade uses server-side credits with two credit banks: Monthly Allowance (resets monthly) and non-expiring Top-Up Credits!";
      } else if (lower.includes("watch") || lower.includes("dev") || lower.includes("journey")) {
        gideonReply =
          "The $15 Kickstarter ($25 regular) Watch-the-Dev Pass unlocks unfiltered weekly YouTube unlisted devlog videos, written engineering deep dives, beta app testing, and community chat access directly with Dave!";
      } else if (lower.includes("register") || lower.includes("account") || lower.includes("free")) {
        gideonReply =
          "You can click 'Register Free' in the header to create an account via Email, Google OAuth, or Facebook OAuth to access the user portal!";
      } else {
        gideonReply =
          "VOID OS is built for high-performance habit tracking and life management with complete data sovereignty. Would you like to explore the interactive simulator sandbox or register a free account?";
      }

      const finalMsgs = [...newMsgs, { sender: "gideon" as const, text: gideonReply, time: timeStr }];
      setMessages(finalMsgs);
      setIsTyping(false);
      logTranscript(finalMsgs);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Gideon assistant"
          className="group relative flex flex-col items-center gap-1.5 focus:outline-none"
        >
          <span className="relative w-14 h-14 rounded-full bg-gradient-to-br from-void-purple via-indigo-600 to-void-cyan flex items-center justify-center shadow-2xl glow-purple group-hover:scale-105 group-active:scale-95 transition-all">
            <Bot className="w-7 h-7 text-white" />
            {/* Online status indicator */}
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#100f1a] animate-ping"></span>
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#100f1a]"></span>
          </span>
          <span className="font-mono font-bold text-[11px] text-white tracking-wide drop-shadow">Gideon</span>
        </button>
      )}

      {/* Floating Chat Box Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] bg-[#100f1a] border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950/80 via-black to-cyan-950/80 p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-void-cyan" />
              </div>
              <div>
                <h4 className="font-mono font-bold text-sm text-white flex items-center gap-1.5">
                  Gideon AI <Sparkles className="w-3 h-3 text-purple-400" />
                </h4>
                <span className="text-[9px] font-mono text-zinc-400 block">VOID OS Public Sales Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-black/40 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs" aria-live="polite" role="log">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-void-purple text-white rounded-br-none glow-purple"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[8px] text-zinc-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-void-cyan text-xs">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span className="animate-pulse">Gideon is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="px-4 py-2 bg-black/40 border-t border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-purple-300">
            <button
              onClick={() => setInput("What are the pricing tiers?")}
              className="px-2.5 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 whitespace-nowrap"
            >
              Pricing Tiers?
            </button>
            <button
              onClick={() => setInput("How does the $10 AI upgrade work?")}
              className="px-2.5 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20 whitespace-nowrap"
            >
              $10 AI Upgrade?
            </button>
            <button
              onClick={() => setInput("What is Watch-the-Dev pass?")}
              className="px-2.5 py-1 rounded-full border border-pink-500/20 bg-pink-500/10 hover:bg-pink-500/20 whitespace-nowrap"
            >
              Watch-the-Dev?
            </button>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-black border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gideon about VOID OS..."
              aria-label="Ask Gideon a question"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="p-3 rounded-xl bg-void-purple hover:bg-purple-600 text-white glow-purple transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
