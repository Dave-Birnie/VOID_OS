import { BADGES, BADGE_MAP, TIER_RING } from "@/lib/badges";

// Renders a user's badges. With showLocked, also shows the not-yet-earned ones
// dimmed, turning the strip into a collection to complete (drives engagement).
export function BadgeList({
  earned,
  showLocked = false,
  size = "md",
}: {
  earned: string[];
  showLocked?: boolean;
  size?: "sm" | "md";
}) {
  const earnedSet = new Set(earned);
  const list = showLocked
    ? BADGES
    : // preserve earned order, fall back to catalog order
      earned.map((id) => BADGE_MAP[id]).filter(Boolean);

  if (list.length === 0) {
    return <p className="text-xs themed-muted">No badges yet — complete your profile and invite a friend to start earning.</p>;
  }

  const dim = size === "sm" ? "w-9 h-9 text-lg" : "w-12 h-12 text-2xl";

  return (
    <div className="flex flex-wrap gap-2.5">
      {list.map((b) => {
        const has = earnedSet.has(b.id);
        return (
          <div key={b.id} className="group relative">
            <div
              className={`${dim} rounded-2xl border-2 ${TIER_RING[b.tier]} flex items-center justify-center transition-all ${
                has ? "themed-card" : "opacity-30 grayscale"
              }`}
              style={has ? { background: "color-mix(in srgb, var(--accent) 8%, transparent)" } : undefined}
            >
              <span aria-hidden="true">{b.emoji}</span>
            </div>
            {/* tooltip */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-40 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="themed-card border themed-border rounded-xl p-2.5 shadow-xl text-center">
                <div className="text-xs font-bold themed-text">{b.name}</div>
                <div className="text-[10px] themed-muted mt-0.5">{b.description}</div>
                {!has && <div className="text-[9px] text-amber-400 mt-1 font-bold uppercase tracking-wide">Locked</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
