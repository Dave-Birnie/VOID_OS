import { LIFE_STATS, statLevel, type StatKey } from "@/lib/lifeStats";

// Platform widget: the six Life Stat areas as RPG-style meters. Values come
// from app_settings.life_stats (0 until the source apps ship).
export function LifeStats({ stats }: { stats: Record<string, number> }) {
  return (
    <div className="h-full bg-[#100f1a] border border-cyan-500/30 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="text-void-cyan font-bold text-xs uppercase tracking-widest">Life Stats</div>
        <span className="font-mono text-[10px] text-zinc-500">Level up by using your apps</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {LIFE_STATS.map((s) => {
          const val = Math.max(0, Math.min(100, stats[s.key as StatKey] ?? 0));
          const lvl = statLevel(val);
          return (
            <div key={s.key} className="bg-black/40 border border-zinc-800 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" aria-hidden="true">{s.icon}</span>
                <span className={`font-mono text-[10px] font-bold ${s.glow}`}>Lv {lvl}</span>
              </div>
              <div className="text-[11px] font-bold text-white mb-1.5">{s.name}</div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${s.grad} transition-all`}
                  style={{ width: `${val}%` }}
                />
              </div>
              <div className="mt-1 text-right font-mono text-[9px] text-zinc-500">{val}/100</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
