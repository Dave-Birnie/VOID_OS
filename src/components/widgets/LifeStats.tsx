import { LIFE_STATS, statLevel, type StatKey } from "@/lib/lifeStats";

// Platform widget: the six Life Stat areas as RPG-style meters. Values come
// from app_settings.life_stats (0 until the source apps ship).
export function LifeStats({ stats }: { stats: Record<string, number> }) {
  return (
    <div className="h-full themed-card border themed-border rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="themed-accent-2 font-bold text-xs uppercase tracking-widest">Life Stats</div>
        <span className="font-mono text-[10px] themed-muted">Level up by using your apps</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {LIFE_STATS.map((s) => {
          const val = Math.max(0, Math.min(100, stats[s.key as StatKey] ?? 0));
          const lvl = statLevel(val);
          return (
            <div key={s.key} className="themed-surface border themed-border rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" aria-hidden="true">{s.icon}</span>
                <span className={`font-mono text-[10px] font-bold ${s.glow}`}>Lv {lvl}</span>
              </div>
              <div className="text-[11px] font-bold themed-text mb-1.5">{s.name}</div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${s.grad} transition-all`}
                  style={{ width: `${val}%` }}
                />
              </div>
              <div className="mt-1 text-right font-mono text-[9px] themed-muted">{val}/100</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
