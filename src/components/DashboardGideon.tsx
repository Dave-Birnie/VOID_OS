"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";

type Msg = { sender: "gideon" | "user"; text: string };

// Gideon — the in-dashboard assistant. Scripted responses for now; wired to
// real BYOK AI (shared callAI adapter) in a later phase.
function gideonReply(input: string): string {
  const q = input.toLowerCase();
  if (/store|install|app/.test(q))
    return "Head to the App Store from the dashboard or your quick actions — install any app and it lands on your board. You can rename apps there too.";
  if (/layout|widget|move|rearrange|edit/.test(q))
    return "Tap the Edit Layout button (bottom-right). While it's on, drag the grip or use ↑/↓ to reorder widgets, and Hide/Show to toggle them. Tap Done to save.";
  if (/life stat|stat|level/.test(q))
    return "Life Stats track six areas — Spiritual, Love, Work, Focus, Mind, Strength. They level up as you use the apps that feed each one.";
  if (/journey|devlog|video|watch/.test(q))
    return "Watch the Journey holds the devlogs and videos. It unlocks with the Watch-the-Dev pass (via the Kickstarter).";
  if (/chat|dev|dave/.test(q))
    return "Chat with Dev is your private line to the founder — it unlocks with the Watch-the-Dev pass.";
  if (/hi|hello|hey|sup/.test(q))
    return "Hey — I'm Gideon, your VOID OS assistant. Ask me about your apps, the store, Life Stats, or rearranging your dashboard.";
  return "I'm still learning — full AI (bring-your-own-key) is coming soon. For now I can point you around the dashboard: apps, the store, Life Stats, and the Edit Layout tools.";
}

export function DashboardGideon() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "gideon", text: "I'm Gideon, your VOID OS assistant. What can I help you run today?" },
  ]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight });
  }, [messages, open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { sender: "user", text }, { sender: "gideon", text: gideonReply(text) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Gideon assistant"
        className="fixed left-4 bottom-4 z-50 w-11 h-11 rounded-full themed-accent-bg shadow-2xl flex items-center justify-center hover:-translate-y-0.5 transition-transform"
      >
        {open ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed left-4 bottom-[4.5rem] z-50 w-[calc(100%-2rem)] max-w-sm themed-card border themed-border rounded-3xl shadow-2xl flex flex-col h-[420px]">
          <div className="flex items-center gap-2 px-4 py-3 border-b themed-border">
            <div className="p-1.5 rounded-lg themed-accent" style={{ background: "color-mix(in srgb, var(--accent) 18%, transparent)" }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold themed-text">Gideon</div>
              <div className="text-[10px] themed-muted font-mono">VOID OS Assistant</div>
            </div>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user" ? "themed-accent-bg" : "themed-surface border themed-border themed-text"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="p-3 border-t themed-border flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gideon..."
              className="flex-1 px-3 py-2.5 rounded-xl border themed-border themed-surface text-xs themed-text focus:outline-none min-h-[40px]"
            />
            <button type="submit" className="px-3.5 py-2.5 rounded-xl themed-accent-bg text-xs font-bold flex items-center gap-1 min-h-[40px]">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
