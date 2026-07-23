import { Lock, Check } from "lucide-react";
import { REFERRAL_TIERS } from "@/lib/referralTiers";

// Vertical "level up" ladder: each rung is a referral milestone with a real
// perk, culminating in Backstage (the Dev Pass). Shows what's unlocked, where
// the user is now, and how many more sign-ups reach the next unlock.
export function ReferralLadder({ count }: { count: number }) {
  return (
    <div className="themed-card border themed-border rounded-2xl p-5">
      <h3 className="font-bold themed-text text-sm mb-1">Your unlock path</h3>
      <p className="text-xs themed-muted mb-4">Every friend who joins with your link levels you up toward Backstage.</p>

      <ol className="relative space-y-3">
        {REFERRAL_TIERS.map((t, i) => {
          const unlocked = count >= t.count;
          const isNext = !unlocked && REFERRAL_TIERS.slice(0, i).every((p) => count >= p.count);
          const remaining = t.count - count;
          return (
            <li key={t.count} className="flex items-start gap-3">
              <div
                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 ${
                  unlocked ? "themed-accent-border" : isNext ? "border-amber-400/50" : "themed-border opacity-40"
                }`}
                style={unlocked ? { background: "color-mix(in srgb, var(--accent) 12%, transparent)" } : undefined}
              >
                {unlocked ? <span>{t.emoji}</span> : isNext ? <span>{t.emoji}</span> : <Lock className="w-4 h-4 themed-muted" />}
              </div>
              <div className={`min-w-0 flex-1 ${unlocked ? "" : isNext ? "" : "opacity-50"}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold themed-text text-sm">{t.name}</span>
                  <span className="font-mono text-[10px] themed-muted">{t.count} referral{t.count > 1 ? "s" : ""}</span>
                  {t.ultimate && <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">Ultimate</span>}
                  {unlocked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[11px] themed-muted mt-0.5">{t.perk}</p>
                {isNext && (
                  <p className="text-[11px] themed-accent font-bold mt-1">
                    {remaining} more {remaining === 1 ? "sign-up" : "sign-ups"} to unlock →
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
