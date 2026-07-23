import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Trophy, Megaphone, Award, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { statLevel } from "@/lib/lifeStats";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "The most active builders on VOID OS — ranked by referrals, achievements, and life level.",
};
export const dynamic = "force-dynamic";

type Row = {
  rank: number;
  handle: string;
  full_name: string | null;
  avatar_url: string | null;
  is_founding_backer: boolean;
  is_admin: boolean;
  referral_count: number;
  badge_count: number;
  life_score: number;
  apps_active: number;
};

const SORTS = [
  { id: "referrals", label: "Referrals", icon: Megaphone },
  { id: "badges", label: "Badges", icon: Award },
  { id: "level", label: "Level", icon: TrendingUp },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function medal(rank: number): string {
  return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
}

export default async function LeaderboardPage({ searchParams }: { searchParams: { by?: string } }) {
  const by: SortId = (SORTS.find((s) => s.id === searchParams.by)?.id ?? "referrals") as SortId;

  const supabase = await createClient();
  const [{ data }, { profile }] = await Promise.all([
    supabase.rpc("leaderboard", { p_sort: by, p_limit: 100 }),
    getUserAndProfile(),
  ]);
  const rows = (data as Row[]) ?? [];
  const myHandle = profile?.handle ?? null;

  const primaryLabel = by === "badges" ? "Badges" : by === "level" ? "Level" : "Referrals";
  const primaryOf = (r: Row) =>
    by === "badges" ? r.badge_count : by === "level" ? statLevel(Number(r.life_score)) : r.referral_count;

  return (
    <main className="min-h-screen grid-bg">
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs themed-accent hover:opacity-80">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="text-lg font-black themed-text flex items-center gap-2">
            <Trophy className="w-5 h-5 themed-accent" /> Leaderboard
          </h1>
        </div>
        <p className="text-xs themed-muted mb-6">
          The most active builders in the Void. Claim a <Link href="/dashboard/settings" className="themed-accent">@handle</Link> to join the ranks.
        </p>

        {/* Sort tabs */}
        <div className="flex gap-1.5 p-1 rounded-2xl border themed-border themed-card mb-5 w-full max-w-sm">
          {SORTS.map((s) => {
            const Icon = s.icon;
            const active = s.id === by;
            return (
              <Link
                key={s.id}
                href={`/leaderboard?by=${s.id}`}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  active ? "themed-accent-bg" : "themed-muted hover:themed-text"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {s.label}
              </Link>
            );
          })}
        </div>

        {rows.length === 0 ? (
          <div className="border border-dashed themed-border rounded-2xl p-8 text-center text-sm themed-muted">
            No one on the board yet. Set a handle and invite a friend to claim #1.
          </div>
        ) : (
          <ol className="space-y-2">
            {rows.map((r) => {
              const mine = myHandle && r.handle.toLowerCase() === myHandle.toLowerCase();
              return (
                <li key={r.handle}>
                  <Link
                    href={`/u/${r.handle}`}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      mine ? "themed-accent-border" : "themed-border"
                    } themed-card themed-hover`}
                    style={mine ? { background: "color-mix(in srgb, var(--accent) 10%, transparent)" } : undefined}
                  >
                    <div className="w-8 text-center shrink-0">
                      {medal(r.rank) ? (
                        <span className="text-xl">{medal(r.rank)}</span>
                      ) : (
                        <span className="font-mono font-black themed-muted text-sm">{r.rank}</span>
                      )}
                    </div>
                    <Avatar name={r.full_name || r.handle} src={r.avatar_url} handle={r.handle} size={40} className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold themed-text text-sm truncate">{r.full_name || `@${r.handle}`}</span>
                        {r.is_founding_backer && <span title="Founding Backer">👑</span>}
                        {mine && <span className="text-[9px] font-bold themed-accent uppercase tracking-wide">You</span>}
                      </div>
                      <div className="text-[11px] themed-muted font-mono truncate">@{r.handle}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-black themed-text text-lg leading-none">{primaryOf(r)}</div>
                      <div className="text-[9px] themed-muted uppercase tracking-wide">{primaryLabel}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        <p className="text-center text-[11px] themed-muted mt-6">
          Prefer to stay off the board? Toggle it off in <Link href="/dashboard/settings" className="themed-accent">Settings</Link>.
        </p>
      </div>
    </main>
  );
}
