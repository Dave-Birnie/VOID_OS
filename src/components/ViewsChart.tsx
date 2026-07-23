"use client";

import { useState } from "react";

export type DailyPoint = { day: string; views: number; uniques: number };

// Simple themed bar chart of daily views with a hover tooltip.
export function ViewsChart({ data }: { data: DailyPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => Number(d.views)));

  if (data.length === 0) {
    return <p className="text-sm themed-muted py-10 text-center">No traffic yet — check back once visitors arrive.</p>;
  }

  return (
    <div className="relative">
      <div className="flex items-end gap-[3px] h-40">
        {data.map((d, i) => {
          const v = Number(d.views);
          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-end h-full"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div
                className="w-full rounded-t transition-opacity"
                style={{
                  height: `${(v / max) * 100}%`,
                  minHeight: v > 0 ? 3 : 0,
                  background: "var(--accent)",
                  opacity: hover === null || hover === i ? 1 : 0.4,
                }}
              />
            </div>
          );
        })}
      </div>
      {hover !== null && (
        <div className="mt-2 text-center font-mono text-[11px] themed-muted">
          <span className="themed-text font-bold">{Number(data[hover].views).toLocaleString()}</span> views ·{" "}
          {Number(data[hover].uniques).toLocaleString()} visitors · {data[hover].day}
        </div>
      )}
    </div>
  );
}
