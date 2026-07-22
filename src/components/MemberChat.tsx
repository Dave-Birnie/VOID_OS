"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Shield, User } from "lucide-react";
import type { CommunityMessage } from "@/lib/supabase/client";
import { sendMemberMessage } from "@/app/community-chat/actions";

// A member's private thread with Dave. Anyone else's messages are never sent
// here (RLS scopes the read to the member's own thread on the server).
export function MemberChat({ initialMessages }: { initialMessages: CommunityMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<CommunityMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Re-sync when the server sends a refreshed thread (e.g. after a reply).
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setBusy(true);
    setError(null);
    setMessages((prev) => [
      ...prev,
      {
        id: "tmp_" + Date.now(),
        user_name: "You",
        message: text,
        is_admin_reply: false,
        created_at: new Date().toISOString(),
      },
    ]);
    setInput("");

    const fd = new FormData();
    fd.set("message", text);
    const res = await sendMemberMessage(fd);
    setBusy(false);
    if (!res.ok) setError(res.error ?? "Could not send.");
    router.refresh();
  };

  return (
    <div className="bg-[#100f1a] border border-purple-500/30 rounded-3xl p-4 md:p-6 shadow-2xl h-[480px] flex flex-col justify-between">
      <div ref={feedRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <p className="text-xs text-zinc-500 text-center mt-8">
            This is your private line to Dave. Say hi, share an idea, or ask anything.
          </p>
        )}
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
                    <Shield className="w-3.5 h-3.5 text-amber-400" /> Dave (Founder)
                  </span>
                ) : (
                  <span className="text-void-cyan flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {m.user_name}
                  </span>
                )}
              </span>
              <span className="text-[9px] text-zinc-500">{m.created_at?.slice(0, 16).replace("T", " ")}</span>
            </div>
            <p className="text-xs leading-relaxed whitespace-pre-line">{m.message}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Dave privately..."
          className="flex-1 px-4 py-3 rounded-xl border border-zinc-800 bg-black text-xs text-white focus:outline-none focus:border-void-pink min-h-[44px]"
        />
        <button
          type="submit"
          disabled={busy}
          className="px-6 py-3 rounded-xl bg-void-pink hover:bg-pink-600 text-white font-bold text-xs glow-pink transition-all flex items-center justify-center gap-1.5 min-h-[44px] disabled:opacity-60"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
}
