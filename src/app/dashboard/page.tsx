import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { getActiveAppIds, getAppSettings } from "@/lib/userApps";
import { APP_CATALOG, WIDGETS, appName } from "@/lib/appCatalog";
import { WidgetBoard, type BoardItem } from "@/components/WidgetBoard";
import { TodayView } from "@/components/widgets/TodayView";
import { LifeStats } from "@/components/widgets/LifeStats";
import { Store, Video, MessageSquare, Lock, ArrowRight } from "lucide-react";

const KICKSTARTER_URL = process.env.NEXT_PUBLIC_KICKSTARTER_URL || "#";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { user, profile } = await getUserAndProfile();

  const firstName = profile?.full_name?.split(" ")[0] || "founder";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? `Morning, ${firstName}.` : hour < 18 ? `Afternoon, ${firstName}.` : `Evening, ${firstName}.`;

  const [activeAppIds, settings] = await Promise.all([
    getActiveAppIds(supabase, user!.id),
    getAppSettings(supabase, user!.id),
  ]);
  const names = settings.app_names ?? {};
  const hasPass = !!(profile?.has_dev_pass || profile?.role === "admin");

  const activeApps = APP_CATALOG.filter((a) => activeAppIds.has(a.id));

  // Platform widgets → board items (server-rendered nodes handed to the client board).
  const widgetNodes: Record<string, ReactNode> = {
    today_view: <TodayView />,
    life_stats: <LifeStats stats={settings.life_stats ?? {}} />,
  };
  const boardItems: BoardItem[] = WIDGETS.filter((w) => w.appId === "platform" && widgetNodes[w.id]).map((w) => ({
    id: w.id,
    name: w.name,
    node: widgetNodes[w.id],
  }));

  return (
    <div>
      <p className="font-mono text-void-purple text-xs tracking-[0.2em] uppercase mb-3">
        <span className="text-void-cyan">//</span> Dashboard
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">{greeting}</h1>
      <p className="text-zinc-400 mb-10">Welcome to your VOID OS. Rearrange it with the Edit Layout button.</p>

      {/* Quick actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <QuickAction href="/dashboard/store" icon={<Store className="w-5 h-5" />} title="Visit Store" sub="Install apps" accent="purple" />
        <QuickAction
          href={hasPass ? "/dev-journey" : KICKSTARTER_URL}
          external={!hasPass}
          icon={hasPass ? <Video className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          title="Watch the Journey"
          sub={hasPass ? "Devlogs & videos" : "Unlock on Kickstarter"}
          accent="cyan"
        />
        <QuickAction
          href={hasPass ? "/community-chat" : KICKSTARTER_URL}
          external={!hasPass}
          icon={hasPass ? <MessageSquare className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          title="Chat with Dev"
          sub={hasPass ? "Private line to Dave" : "Unlock on Kickstarter"}
          accent="pink"
        />
      </section>

      {/* Widgets */}
      <section className="mb-14">
        <h2 className="font-mono text-void-purple text-xs font-bold tracking-[0.2em] uppercase mb-4">
          <span className="text-void-cyan">//</span> Your widgets
        </h2>
        <WidgetBoard items={boardItems} initialOrder={settings.widget_order ?? []} initialHidden={settings.hidden_widgets ?? []} />
      </section>

      {/* Apps */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <h2 className="font-mono text-void-purple text-xs font-bold tracking-[0.2em] uppercase">
            <span className="text-void-cyan">//</span> Your apps
          </h2>
          <Link href="/dashboard/store" className="font-mono text-[13px] font-bold text-void-purple hover:text-white inline-flex items-center gap-1.5">
            App Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activeApps.length === 0 ? (
          <Link
            href="/dashboard/store"
            className="block border border-dashed border-zinc-800 hover:border-void-purple rounded-2xl p-8 text-center text-sm text-zinc-500 hover:text-white transition-colors"
          >
            No apps installed yet. Visit the App Store to add some →
          </Link>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeApps.map((app) => (
              <div key={app.id} className="bg-void-card/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-mono text-void-purple font-bold text-sm">
                    {app.abbr}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border text-zinc-500 border-zinc-700">
                    In development
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold">{appName(app.id, names)}</h3>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{app.description}</p>
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
  accent,
  external,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  sub: string;
  accent: "purple" | "cyan" | "pink";
  external?: boolean;
}) {
  const ring =
    accent === "cyan" ? "hover:border-cyan-500/50" : accent === "pink" ? "hover:border-pink-500/50" : "hover:border-purple-500/50";
  const iconColor = accent === "cyan" ? "text-void-cyan" : accent === "pink" ? "text-void-pink" : "text-void-purple";
  const inner = (
    <>
      <div className={`w-10 h-10 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-center ${iconColor}`}>{icon}</div>
      <div>
        <div className="text-white font-bold text-sm">{title}</div>
        <div className="text-zinc-500 text-[11px]">{sub}</div>
      </div>
    </>
  );
  const cls = `flex items-center gap-3 bg-void-card/60 border border-zinc-800 ${ring} rounded-2xl p-4 transition-colors`;
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
