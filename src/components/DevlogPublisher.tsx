"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, CheckCircle2, Lock, Unlock } from "lucide-react";
import { publishDevlog } from "@/app/admin/actions";

type DevlogRow = {
  id: string;
  title: string;
  slug: string;
  youtube_url: string | null;
  is_locked: boolean;
  created_at: string;
};

export function DevlogPublisher({ devlogs }: { devlogs: DevlogRow[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ytUrl, setYtUrl] = useState("");
  const [content, setContent] = useState("");
  const [locked, setLocked] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setBusy(true);
    setStatus(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("youtube_url", ytUrl);
    fd.set("content_md", content);
    if (locked) fd.set("is_locked", "on");
    const res = await publishDevlog(fd);
    setBusy(false);
    if (res.ok) {
      setTitle("");
      setYtUrl("");
      setContent("");
      setStatus({ ok: true, msg: "Devlog published to the Watch-the-Dev portal." });
      router.refresh();
    } else {
      setStatus({ ok: false, msg: res.error ?? "Could not publish." });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-[#100f1a] border border-pink-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h2 className="font-bold text-white text-xl mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-void-pink" /> Publish a Devlog
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Weekly engineering updates with an unlisted YouTube video, published to the Watch-the-Dev portal.
        </p>

        <form onSubmit={submit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">Devlog Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Devlog #15: Custom AI Workflow Adapter Engine…" className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]" />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">YouTube Embed URL (optional)</label>
            <input type="url" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://www.youtube.com/embed/…" className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]" />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">Written Content (Markdown)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={7} placeholder="### Weekly Engineering Summary…" className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white" />
          </div>
          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
            <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} className="accent-void-pink w-4 h-4" />
            {locked ? <Lock className="w-3.5 h-3.5 text-void-pink" /> : <Unlock className="w-3.5 h-3.5 text-zinc-500" />}
            Dev Pass holders only
          </label>
          {status && (
            <div className={`p-3 rounded-xl flex items-center gap-2 border ${status.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
              <CheckCircle2 className="w-4 h-4" /> {status.msg}
            </div>
          )}
          <button type="submit" disabled={busy} className="w-full py-3.5 rounded-xl bg-void-pink hover:bg-pink-600 text-white font-bold text-xs glow-pink flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60">
            <Plus className="w-4 h-4" /> {busy ? "Publishing…" : "Publish Devlog Entry"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <h3 className="font-bold text-sm text-white mb-3">Published ({devlogs.length})</h3>
        {devlogs.length === 0 && <p className="text-xs text-zinc-500">No devlogs published yet.</p>}
        <div className="space-y-2">
          {devlogs.map((d) => (
            <div key={d.id} className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-xs">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-bold text-void-pink">{d.title}</span>
                {d.is_locked ? <Lock className="w-3 h-3 text-void-pink shrink-0 mt-0.5" /> : <Unlock className="w-3 h-3 text-zinc-500 shrink-0 mt-0.5" />}
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>/{d.slug}</span>
                <span>{d.created_at?.slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
