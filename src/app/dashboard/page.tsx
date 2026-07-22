import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { getActiveAppIds } from "@/lib/userApps";
import { APP_CATALOG } from "@/lib/appCatalog";
import { Sparkles, Trophy } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { user, profile } = await getUserAndProfile();

  const firstName = profile?.full_name?.split(" ")[0] || "founder";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? `Morning, ${firstName}.` : hour < 18 ? `Afternoon, ${firstName}.` : `Evening, ${firstName}.`;

  const activeAppIds = user ? await getActiveAppIds(supabase, user.id) : new Set<string>();
  const activeApps = APP_CATALOG.filter((a) => activeAppIds.has(a.id));

  return (
    <div>
      <p className="font-mono text-void-purple text-xs tracking-[0.2em] uppercase mb-3">
        <span className="text-void-cyan">//</span> Dashboard
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">{greeting}</h1>
      <p className="text-zinc-400 mb-10">Welcome to your VOID OS. Your apps and widgets live here.</p>

      {/* Today View (placeholder — full widget board arrives in a later phase) */}
      <section className="mb-12">
        <div className="bg-[#100f1a] border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-void-purple font-bold text-xs uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4" /> Today View
          </div>
          <blockquote className="border-l-2 border-void-purple pl-4">
            <p className="text-white text-lg italic leading-relaxed">
              &ldquo;Whatever your hand finds to do, do it with your might.&rdquo;
            </p>
            <cite className="font-mono text-[11px] text-zinc-500 not-italic">— Ecclesiastes 9:10</cite>
          </blockquote>
        </div>
      </section>

      {/* Apps */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <h2 className="font-mono text-void-purple text-xs font-bold tracking-[0.2em] uppercase">
            <span className="text-void-cyan">//</span> Your apps
          </h2>
          <span className="font-mono text-[11px] text-zinc-500">App Store coming soon</span>
        </div>

        {activeApps.length === 0 && (
          <p className="text-xs text-zinc-500 mb-6">
            No apps installed yet. The full modular app ecosystem is on the way — here&apos;s what&apos;s coming:
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APP_CATALOG.map((app) => {
            const installed = activeAppIds.has(app.id);
            return (
              <div
                key={app.id}
                className="bg-void-card/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-mono text-void-purple font-bold text-sm">
                    {app.abbr}
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border ${
                      installed
                        ? "text-emerald-300 border-emerald-500/40"
                        : "text-zinc-500 border-zinc-700"
                    }`}
                  >
                    {installed ? "Installed" : app.status === "coming" ? "Coming soon" : "Available"}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-1.5">
                    {app.category === "Gamification" && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                    {app.name}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{app.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
