"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { parseInspirations } from "@/lib/inspirations";
import { saveInspirations } from "@/app/admin/actions";

export function InspirationsEditor({ initialBody }: { initialBody: string }) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const parsed = parseInspirations(body);

  const save = async () => {
    setBusy(true);
    setStatus(null);
    const fd = new FormData();
    fd.set("body", body);
    const res = await saveInspirations(fd);
    setBusy(false);
    setStatus(res.ok ? { ok: true, msg: "Saved — live on dashboards now." } : { ok: false, msg: res.error ?? "Could not save." });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      <pre className="bg-black/50 border border-zinc-800 rounded-xl p-4 font-mono text-[11px] text-zinc-400 mb-6 overflow-x-auto">
{`VERSE: "Commit your deeds to Yahweh, and your plans shall succeed." Proverbs 16:3 (WEB)

QUOTE: "The way to get started is to quit talking and begin doing." Walt Disney`}
      </pre>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={20}
        spellCheck={false}
        className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-void-purple"
      />

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <button
          onClick={save}
          disabled={busy}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs glow-purple min-h-[44px] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <span className="font-mono text-[11px] text-zinc-500">
          Parsed: {parsed.verses.length} verse{parsed.verses.length === 1 ? "" : "s"} · {parsed.quotes.length} quote
          {parsed.quotes.length === 1 ? "" : "s"}
        </span>
        {status && (
          <span className={`text-xs flex items-center gap-1.5 ${status.ok ? "text-emerald-400" : "text-red-400"}`}>
            {status.ok && <CheckCircle2 className="w-4 h-4" />} {status.msg}
          </span>
        )}
      </div>
    </div>
  );
}
