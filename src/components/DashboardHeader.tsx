"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Home, Settings } from "lucide-react";
import { ModeSwitch } from "@/components/ModeSwitch";
import { NotificationBell, type AppNotification } from "@/components/NotificationBell";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Chrome for the member dashboard: brand, admin-only CMS toggle, notifications,
// view-site link, and sign out.
export function DashboardHeader({
  isAdmin,
  name,
  notifications,
}: {
  isAdmin: boolean;
  name: string;
  notifications: AppNotification[];
}) {
  const router = useRouter();

  const handleLogout = async () => {
    if (isSupabaseConfigured()) await createBrowserSupabase().auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-void-black/80 border-b border-zinc-800/80 py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link href="/dashboard" aria-label="VOID OS dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8">
            <svg viewBox="0 0 200 200" aria-hidden="true" className="w-full h-full drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              <path d="M 100,20 A 80,80 0 0,1 175,75" fill="none" stroke="url(#logoGrad)" strokeWidth="12" />
              <path d="M 100,20 A 80,80 0 0,0 25,75" fill="none" stroke="url(#logoGrad)" strokeWidth="12" />
              <path d="M 25,125 A 80,80 0 0,0 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="12" />
              <path d="M 175,125 A 80,80 0 0,1 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="12" />
              <path d="M 30,75 L 100,165 L 170,75 L 132,75 L 100,125 L 68,75 Z" fill="url(#logoGrad)" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-void-purple via-indigo-400 to-void-cyan font-mono">
            VOID OS
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {isAdmin && <ModeSwitch />}
          <span className="hidden md:inline text-xs font-mono text-zinc-400">{name}</span>
          <NotificationBell notifications={notifications} />
          <Link
            href="/dashboard/settings"
            title="Settings"
            aria-label="Settings"
            className="p-2 rounded-xl border border-zinc-800 hover:border-void-purple/50 text-zinc-400 hover:text-white transition-all bg-black/30"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            title="View public site"
            aria-label="View public site"
            className="p-2 rounded-xl border border-zinc-800 hover:border-void-purple/50 text-zinc-400 hover:text-white transition-all bg-black/30"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
          </Link>
          <button
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="p-2 rounded-xl border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition-all bg-black/30"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
