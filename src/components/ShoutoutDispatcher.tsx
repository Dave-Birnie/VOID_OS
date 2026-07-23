"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, CheckCircle2 } from "lucide-react";
import type { Shoutout } from "@/lib/supabase/client";
import { sendShoutout } from "@/app/admin/actions";

export function ShoutoutDispatcher({ shoutouts }: { shoutouts: Shoutout[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setBusy(true);
    setStatus(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("message", message);
    const res = await sendShoutout(fd);
    setBusy(false);
    if (res.ok) {
      setTitle("");
      setMessage("");
      setStatus({ ok: true, msg: "Broadcast dispatched — every user got a notification." });
      router.refresh();
    } else {
      setStatus({ ok: false, msg: res.error ?? "Could not send." });
    }
  };

  return (
    <div className="bg-[#100f1a] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
      <h2 className="font-bold text-white text-xl mb-2 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-amber-400" /> Shoutouts Dispatcher
      </h2>
      <p className="text-xs text-zinc-400 mb-6">Broadcast an announcement — it lands in every user&apos;s notification bell and pops a toast on their dashboard.</p>

      <form onSubmit={submit} className="space-y-4 text-xs mb-8">
        <div>
          <label className="block text-zinc-400 mb-1 font-bold">Headline</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="🔥 Kickstarter goal hit 50%!" className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]" />
        </div>
        <div>
          <label className="block text-zinc-400 mb-1 font-bold">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={3} placeholder="We just reached $375 toward our $750 goal..." className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white" />
        </div>
        {status && (
          <div className={`p-3 rounded-xl flex items-center gap-2 border ${status.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
            <CheckCircle2 className="w-4 h-4" /> {status.msg}
          </div>
        )}
        <button type="submit" disabled={busy} className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60">
          <Megaphone className="w-4 h-4" /> {busy ? "Sending…" : "Send Broadcast"}
        </button>
      </form>

      <h3 className="font-bold text-sm text-white mb-3">History</h3>
      {shoutouts.length === 0 && <p className="text-xs text-zinc-500">No broadcasts sent yet.</p>}
      <div className="space-y-2">
        {shoutouts.map((s) => (
          <div key={s.id} className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-xs">
            <div className="flex justify-between font-bold text-amber-400 mb-1">
              <span>{s.title}</span>
              <span className="text-[9px] text-zinc-500">{s.created_at?.slice(0, 10)}</span>
            </div>
            <p className="text-zinc-300 text-[11px]">{s.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
