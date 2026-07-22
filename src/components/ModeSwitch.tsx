"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Segmented Dashboard | CMS switch for admins. Highlights the current surface
// by path (anything under /admin is "CMS").
export function ModeSwitch() {
  const pathname = usePathname();
  const inCms = pathname.startsWith("/admin");

  const base = "font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors";
  const active = "bg-void-purple text-white glow-purple";
  const idle = "text-zinc-400 hover:text-white";

  return (
    <div role="group" aria-label="Switch surface" className="flex items-center gap-1 bg-black/50 border border-zinc-800 rounded-xl p-1">
      <Link href="/dashboard" className={`${base} ${inCms ? idle : active}`} aria-current={inCms ? undefined : "page"}>
        Dashboard
      </Link>
      <Link href="/admin" className={`${base} ${inCms ? active : idle}`} aria-current={inCms ? "page" : undefined}>
        CMS
      </Link>
    </div>
  );
}
