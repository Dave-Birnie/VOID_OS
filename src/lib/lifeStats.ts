// The six Life Stat areas (RPG-style), inspired by the FamilyLock Life Stats
// engine. Each app in the catalog feeds one of these; until the real apps
// ship, values default to 0.

export type StatKey = "spiritual" | "love" | "work" | "focus" | "mind" | "strength";

export interface LifeStatDef {
  key: StatKey;
  name: string;
  icon: string;
  grad: string; // tailwind gradient stops
  glow: string; // tailwind text color for the value
}

export const LIFE_STATS: LifeStatDef[] = [
  { key: "spiritual", name: "Spiritual", icon: "✝️", grad: "from-purple-600 to-fuchsia-500", glow: "text-fuchsia-300" },
  { key: "love", name: "Love", icon: "💍", grad: "from-rose-700 to-pink-500", glow: "text-pink-300" },
  { key: "work", name: "Work", icon: "⚙️", grad: "from-amber-600 to-yellow-400", glow: "text-yellow-300" },
  { key: "focus", name: "Focus", icon: "🎯", grad: "from-indigo-600 to-violet-400", glow: "text-violet-300" },
  { key: "mind", name: "Mind", icon: "🧠", grad: "from-teal-600 to-cyan-400", glow: "text-cyan-300" },
  { key: "strength", name: "Strength", icon: "💪", grad: "from-emerald-700 to-green-400", glow: "text-emerald-300" },
];

// Map a 0-100 score to a level 1-10.
export function statLevel(v: number): number {
  return Math.max(1, Math.min(10, Math.floor(v / 10) + 1));
}
