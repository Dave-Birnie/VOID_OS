// Deterministic avatar fallbacks: initials on a gradient derived from the
// name, so a user without an uploaded picture is never a blank circle and
// always renders the same colours everywhere.

const GRADIENTS: [string, string][] = [
  ["#8b5cf6", "#6366f1"],
  ["#06b6d4", "#3b82f6"],
  ["#ec4899", "#8b5cf6"],
  ["#f59e0b", "#ef4444"],
  ["#10b981", "#06b6d4"],
  ["#6366f1", "#ec4899"],
  ["#14b8a6", "#8b5cf6"],
  ["#f43f5e", "#f59e0b"],
];

export function initialsOf(name: string | null | undefined): string {
  const n = (name ?? "").trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function gradientFor(seed: string | null | undefined): [string, string] {
  const s = (seed ?? "").trim() || "void";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}
