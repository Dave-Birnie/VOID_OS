import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ViewsChart, type DailyPoint } from "@/components/ViewsChart";

export const metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

type Summary = {
  views_today: number; views_7d: number; views_30d: number; views_total: number;
  uniques_today: number; uniques_7d: number; uniques_30d: number;
  signups_total: number; signups_7d: number; active_7d: number;
  apps_active: number; messages_total: number; messages_7d: number;
  posts_published: number; devlogs_total: number; shoutouts_total: number; transcripts_total: number;
};
type PathRow = { path: string; views: number; uniques: number };
type RefRow = { referrer: string; views: number };

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="themed-card border themed-border rounded-2xl p-4">
      <p className="font-mono themed-muted text-[10px] font-bold tracking-[0.15em] uppercase mb-2">{label}</p>
      <p className="font-mono text-3xl font-black themed-text leading-none">{value}</p>
      {sub && <p className="font-mono text-[12px] themed-accent mt-2">{sub}</p>}
    </div>
  );
}

function RankTable({ title, rows, empty }: { title: string; rows: { label: string; value: number; href?: string }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="themed-card border themed-border rounded-2xl p-4">
      <h2 className="font-mono themed-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
        <span className="themed-accent-2">//</span> {title}
      </h2>
      {rows.length === 0 ? (
        <p className="themed-muted text-sm">{empty}</p>
      ) : (
        <ul className="flex flex-col">
          {rows.map((r) => (
            <li key={r.label} className="relative flex items-center justify-between gap-3 py-2 border-b themed-border last:border-0">
              <span aria-hidden="true" className="absolute left-0 bottom-0 h-0.5" style={{ width: `${(r.value / max) * 100}%`, background: "var(--accent)" }} />
              {r.href ? (
                <Link href={r.href} className="text-xs themed-text hover:themed-accent truncate">{r.label}</Link>
              ) : (
                <span className="text-xs themed-text truncate">{r.label}</span>
              )}
              <span className="font-mono text-[12px] themed-accent shrink-0">{r.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const [summaryRes, dailyRes, pathsRes, postsRes, refsRes] = await Promise.all([
    supabase.rpc("analytics_summary"),
    supabase.rpc("analytics_daily", { days: 30 }),
    supabase.rpc("analytics_top_paths", { days: 30, lim: 8 }),
    supabase.rpc("analytics_top_paths", { days: 30, lim: 6, prefix: "/blog/" }),
    supabase.rpc("analytics_top_referrers", { days: 30, lim: 6 }),
  ]);

  if (summaryRes.error) {
    return (
      <div className="min-h-screen bg-void-black text-slate-100 font-mono max-w-2xl mx-auto px-4 py-10">
        <Link href="/admin" className="text-xs text-void-purple">&larr; Admin</Link>
        <h1 className="text-2xl font-black text-white mt-4 mb-3">Analytics</h1>
        <div className="border border-red-500/40 rounded-xl p-6 text-sm text-zinc-300">
          Couldn&apos;t load analytics ({summaryRes.error.message}). Make sure the analytics migration ran.
        </div>
      </div>
    );
  }

  const s = summaryRes.data as Summary;
  const daily = (dailyRes.data ?? []) as DailyPoint[];
  const paths = (pathsRes.data ?? []) as PathRow[];
  const posts = (postsRes.data ?? []) as PathRow[];
  const refs = (refsRes.data ?? []) as RefRow[];

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-void-purple" /> Site Analytics
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-8">First-party, cookie-free tracking across the whole site. Bots filtered; visitors counted by a daily rotating hash.</p>

        {/* Traffic */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <Tile label="Views · 30d" value={Number(s.views_30d).toLocaleString()} sub={`+${Number(s.views_today).toLocaleString()} today`} />
          <Tile label="Visitors · 30d" value={Number(s.uniques_30d).toLocaleString()} sub={`${Number(s.uniques_today).toLocaleString()} today`} />
          <Tile label="Signups" value={Number(s.signups_total).toLocaleString()} sub={`+${Number(s.signups_7d).toLocaleString()} this week`} />
          <Tile label="Active · 7d" value={Number(s.active_7d).toLocaleString()} sub={`of ${Number(s.signups_total).toLocaleString()} users`} />
        </div>

        {/* Chart */}
        <div className="themed-card border themed-border rounded-2xl p-4 mb-3">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
            <h2 className="font-mono themed-accent text-[11px] font-bold tracking-[0.2em] uppercase">
              <span className="themed-accent-2">//</span> Views — last 30 days
            </h2>
            <span className="font-mono text-[12px] themed-muted">
              {Number(s.views_7d).toLocaleString()} this week · {Number(s.views_total).toLocaleString()} all-time
            </span>
          </div>
          <ViewsChart data={daily} />
        </div>

        {/* Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
          <RankTable title="Top pages · 30d" rows={paths.map((p) => ({ label: p.path, value: Number(p.views) }))} empty="No traffic yet." />
          <RankTable title="Top posts · 30d" rows={posts.map((p) => ({ label: p.path.replace(/^\/blog\//, ""), value: Number(p.views), href: p.path }))} empty="No post views yet." />
          <RankTable title="Traffic sources · 30d" rows={refs.map((r) => ({ label: r.referrer, value: Number(r.views) }))} empty="No referrers yet." />
        </div>

        {/* Platform pulse */}
        <h2 className="font-mono themed-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
          <span className="themed-accent-2">//</span> Platform pulse
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Tile label="Apps installed" value={Number(s.apps_active).toLocaleString()} />
          <Tile label="Community msgs" value={Number(s.messages_total).toLocaleString()} sub={`+${Number(s.messages_7d).toLocaleString()} this week`} />
          <Tile label="Posts published" value={Number(s.posts_published).toLocaleString()} />
          <Tile label="Devlogs" value={Number(s.devlogs_total).toLocaleString()} />
          <Tile label="Shoutouts sent" value={Number(s.shoutouts_total).toLocaleString()} />
          <Tile label="Gideon transcripts" value={Number(s.transcripts_total).toLocaleString()} />
        </div>
      </main>
    </div>
  );
}
