"use client";

import { useState } from "react";
import { Gift, Copy, Check, Users } from "lucide-react";

// The invite widget: shows the user's share link, a copy button, how many
// people they've brought in, and progress toward the next referral badge.
const MILESTONES: { count: number; label: string }[] = [
  { count: 1, label: "Recruiter 📣" },
  { count: 5, label: "Ambassador 🌟" },
  { count: 10, label: "Legend 🏆" },
];

export function ReferralCard({ code, count, baseUrl }: { code: string; count: number; baseUrl: string }) {
  const [copied, setCopied] = useState(false);
  const link = `${baseUrl.replace(/\/$/, "")}/?ref=${code}`;

  const next = MILESTONES.find((m) => count < m.count);
  const prev = [...MILESTONES].reverse().find((m) => count >= m.count);
  const floor = prev?.count ?? 0;
  const ceil = next?.count ?? count;
  const pct = next ? Math.min(100, Math.round(((count - floor) / (ceil - floor)) * 100)) : 100;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — user can still select the text */
    }
  };

  return (
    <div className="themed-card border themed-border rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="flex items-center gap-2 font-bold themed-text text-sm">
          <Gift className="w-4 h-4 themed-accent" /> Invite friends
        </h3>
        <span className="inline-flex items-center gap-1.5 text-xs themed-muted">
          <Users className="w-3.5 h-3.5" /> {count} joined
        </span>
      </div>
      <p className="text-xs themed-muted mb-4">
        Share your link. When someone joins, you both earn badges — and you climb toward Ambassador &amp; Legend.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border themed-border bg-[var(--surface)] themed-text text-xs font-mono min-h-[44px]"
        />
        <button
          onClick={copy}
          className="shrink-0 px-3.5 py-2.5 rounded-xl themed-accent-bg font-bold text-xs flex items-center gap-1.5 min-h-[44px]"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {next ? (
        <div>
          <div className="flex justify-between text-[11px] themed-muted mb-1.5">
            <span>{count} / {next.count} to <strong className="themed-text">{next.label}</strong></span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--surface)] border themed-border overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
          </div>
        </div>
      ) : (
        <p className="text-xs font-bold text-amber-400">🏆 You&apos;ve unlocked every referral badge — legend.</p>
      )}
    </div>
  );
}
