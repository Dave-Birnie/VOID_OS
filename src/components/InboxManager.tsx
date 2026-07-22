"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, Send } from "lucide-react";
import type { CommunityMessage } from "@/lib/supabase/client";
import { sendAdminReply } from "@/app/admin/inbox/actions";

export type Thread = {
  userId: string;
  name: string;
  email: string;
  messages: CommunityMessage[];
  lastAt: string;
};

export function InboxManager({ threads }: { threads: Thread[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(threads[0]?.userId ?? null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a valid selection when the thread list changes after a refresh.
  useEffect(() => {
    if (!threads.find((t) => t.userId === selected)) {
      setSelected(threads[0]?.userId ?? null);
    }
  }, [threads, selected]);

  const active = threads.find((t) => t.userId === selected) ?? null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !reply.trim() || busy) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("member_id", active.userId);
    fd.set("message", reply.trim());
    const res = await sendAdminReply(fd);
    setBusy(false);
    if (!res.ok) setError(res.error ?? "Could not send.");
    else {
      setReply("");
      router.refresh();
    }
  };

  if (threads.length === 0) {
    return <p className="text-xs text-zinc-500">No member messages yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
      {/* Thread list */}
      <div className="bg-[#100f1a] border border-zinc-800 rounded-2xl p-2 space-y-1 h-fit">
        {threads.map((t) => (
          <button
            key={t.userId}
            onClick={() => setSelected(t.userId)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
              selected === t.userId ? "bg-void-purple/20 border border-void-purple/40" : "hover:bg-black/40 border border-transparent"
            }`}
          >
            <div className="text-xs font-bold text-white truncate">{t.name}</div>
            <div className="text-[10px] text-zinc-500 truncate">
              {t.messages[t.messages.length - 1]?.message ?? ""}
            </div>
          </button>
        ))}
      </div>

      {/* Active thread */}
      <div className="bg-[#100f1a] border border-purple-500/30 rounded-2xl p-4 flex flex-col h-[520px]">
        {active ? (
          <>
            <div className="border-b border-zinc-800 pb-2 mb-3">
              <div className="text-sm font-bold text-white">{active.name}</div>
              <div className="text-[10px] text-zinc-500">{active.email}</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border text-xs ${
                    m.is_admin_reply
                      ? "bg-purple-950/20 border-purple-500/40 text-purple-100"
                      : "bg-black/50 border-zinc-800 text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1 text-white">
                      {m.is_admin_reply ? (
                        <>
                          <Shield className="w-3 h-3 text-amber-400" /> You
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-void-cyan" /> {m.user_name}
                        </>
                      )}
                    </span>
                    <span className="text-[9px] text-zinc-500">{m.created_at?.slice(0, 16).replace("T", " ")}</span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>

            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

            <form onSubmit={send} className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={`Reply to ${active.name}...`}
                className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-800 bg-black text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
              />
              <button
                type="submit"
                disabled={busy}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs flex items-center gap-1.5 min-h-[44px] disabled:opacity-60"
              >
                <Send className="w-4 h-4" /> Reply
              </button>
            </form>
          </>
        ) : (
          <p className="text-xs text-zinc-500">Select a conversation.</p>
        )}
      </div>
    </div>
  );
}
