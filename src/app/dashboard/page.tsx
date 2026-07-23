import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { getActiveAppIds, getAppSettings } from "@/lib/userApps";
import { APP_CATALOG, WIDGETS, appName } from "@/lib/appCatalog";
import { WidgetBoard, type BoardItem } from "@/components/WidgetBoard";
import { TodayView } from "@/components/widgets/TodayView";
import { LifeStats } from "@/components/widgets/LifeStats";
import { parseInspirations, verseForDay, quoteForDay, todayKey } from "@/lib/inspirations";
import { ReferralCard } from "@/components/ReferralCard";
import { BadgeList } from "@/components/BadgeList";
import { siteConfig } from "@/lib/site";
import { Store, Video, MessageSquare, Lock, ArrowRight, Trophy } from "lucide-react";

const KICKSTARTER_URL = process.env.NEXT_PUBLIC_KICKSTARTER_URL || "#";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { user, profile } = await getUserAndProfile();

  const firstName = profile?.full_name?.split(" ")[0] || "founder";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? `Morning, ${firstName}.` : hour < 18 ? `Afternoon, ${firstName}.` : `Evening, ${firstName}.`;

  // Award any newly-earned badges (early adopter, founding backer…) up front.
  await supabase.rpc("evaluate_badges", { p_user: user!.id });

  const [activeAppIds, settings, { data: inspRow }, { data: refRow }, { count: refCount }, { data: badgeRows }] =
    await Promise.all([
      getActiveAppIds(supabase, user!.id),
      getAppSettings(supabase, user!.id),
      supabase.from("site_content").select("body").eq("key", "inspirations").maybeSingle(),
      supabase.from("profiles").select("referral_code").eq("id", user!.id).single(),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("referred_by", user!.id),
      supabase.from("user_badges").select("badge_id").eq("user_id", user!.id),
    ]);

  const referralCode = (refRow?.referral_code as string) ?? "";
  const referralCount = refCount ?? 0;
  const earnedBadges = ((badgeRows as { badge_id: string }[]) ?? []).map((b) => b.badge_id);
  const names = settings.app_names ?? {};
  const hasPass = !!(profile?.has_dev_pass || profile?.role === "admin");

  const activeApps = APP_CATALOG.filter((a) => activeAppIds.has(a.id));

  // Daily inspiration (admin doc → default library) + per-user visibility.
  const parsed = parseInspirations(inspRow?.body ?? "");
  const dateKey = todayKey();
  const today = (settings.today as { verses?: boolean; quotes?: boolean } | undefined) ?? {};
  const showVerse = today.verses !== false;
  const showQuote = today.quotes !== false;

  // Platform widgets → board items (server-rendered nodes handed to the client board).
  const widgetNodes: Record<string, ReactNode> = {
    today_view: (
      <TodayView
        verse={verseForDay(dateKey, parsed.verses)}
        quote={quoteForDay(dateKey, parsed.quotes)}
        showVerse={showVerse}
        showQuote={showQuote}
      />
    ),
    life_stats: <LifeStats stats={settings.life_stats ?? {}} />,
  };
  const boardItems: BoardItem[] = WIDGETS.filter((w) => w.appId === "platform" && widgetNodes[w.id]).map((w) => ({
    id: w.id,
    name: w.name,
    node: widgetNodes[w.id],
  }));

  return (
    <div>
      <p className="font-mono themed-accent text-[11px] tracking-[0.2em] uppercase mb-2">
        <span className="themed-accent-2">//</span> Dashboard
      </p>
      <h1 className="text-2xl sm:text-3xl font-black themed-text tracking-tight mb-1">{greeting}</h1>
      <p className="themed-muted text-sm mb-8">Welcome to your VOID OS. Rearrange it with the Edit Layout button.</p>

      {/* Quick actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <QuickAction href="/dashboard/store" icon={<Store className="w-5 h-5" />} title="Visit Store" sub="Install apps" external={false} />
        <QuickAction
          href={hasPass ? "/dev-journey" : KICKSTARTER_URL}
          external={!hasPass}
          icon={hasPass ? <Video className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          title="Watch the Journey"
          sub={hasPass ? "Devlogs & videos" : "Unlock on Kickstarter"}
        />
        <QuickAction
          href={hasPass ? "/community-chat" : KICKSTARTER_URL}
          external={!hasPass}
          icon={hasPass ? <MessageSquare className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          title="Chat with Dev"
          sub={hasPass ? "Private line to Dave" : "Unlock on Kickstarter"}
        />
      </section>

      {/* Grow VOID OS — referrals + achievements */}
      <section className="mb-10">
        <h2 className="font-mono themed-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
          <span className="themed-accent-2">//</span> Grow VOID OS
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {referralCode && <ReferralCard code={referralCode} count={referralCount} baseUrl={siteConfig.url} />}
          <div className="themed-card border themed-border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="flex items-center gap-2 font-bold themed-text text-sm">
                <Trophy className="w-4 h-4 themed-accent" /> Achievements
              </h3>
              <span className="text-xs themed-muted">{earnedBadges.length} earned</span>
            </div>
            <p className="text-xs themed-muted mb-4">Earn badges by setting up your profile, installing apps, and inviting friends.</p>
            <BadgeList earned={earnedBadges} showLocked />
          </div>
        </div>
      </section>

      {/* Widgets */}
      <section className="mb-10">
        <h2 className="font-mono themed-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
          <span className="themed-accent-2">//</span> Your widgets
        </h2>
        <WidgetBoard items={boardItems} initialOrder={settings.widget_order ?? []} initialHidden={settings.hidden_widgets ?? []} />
      </section>

      {/* Apps */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h2 className="font-mono themed-accent text-[11px] font-bold tracking-[0.2em] uppercase">
            <span className="themed-accent-2">//</span> Your apps
          </h2>
          <Link href="/dashboard/store" className="font-mono text-xs font-bold themed-accent hover:opacity-80 inline-flex items-center gap-1.5">
            App Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activeApps.length === 0 ? (
          <Link
            href="/dashboard/store"
            className="block border border-dashed themed-border themed-hover rounded-2xl p-6 text-center text-sm themed-muted transition-colors"
          >
            No apps installed yet. Visit the App Store to add some →
          </Link>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeApps.map((app) => (
              <div key={app.id} className="themed-card border themed-border rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl border themed-accent-border flex items-center justify-center font-mono themed-accent font-bold text-sm" style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
                    {app.abbr}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border themed-border themed-muted">
                    In development
                  </span>
                </div>
                <div>
                  <h3 className="themed-text font-bold text-sm">{appName(app.id, names)}</h3>
                  <p className="themed-muted text-xs mt-1 leading-relaxed">{app.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  sub,
  external,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  sub: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <div className="w-10 h-10 rounded-xl border themed-border flex items-center justify-center themed-accent flex-shrink-0" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="themed-text font-bold text-sm truncate">{title}</div>
        <div className="themed-muted text-[11px] truncate">{sub}</div>
      </div>
    </>
  );
  const cls = "flex items-center gap-3 themed-card border themed-border themed-hover rounded-2xl p-3.5 transition-colors";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
