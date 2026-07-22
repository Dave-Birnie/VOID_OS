import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { getActiveAppIds, getAppSettings } from "@/lib/userApps";
import { APP_CATALOG, appName } from "@/lib/appCatalog";
import { activateApp, deactivateApp, renameApp } from "./actions";

export const metadata = { title: "App Store" };

const FILTERS = [
  { id: "all", label: "All" },
  { id: "installed", label: "Installed" },
] as const;

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: raw } = await searchParams;
  const filter = FILTERS.some((f) => f.id === raw) ? raw! : "all";

  const supabase = await createClient();
  const { user } = await getUserAndProfile();
  const [active, settings] = await Promise.all([
    getActiveAppIds(supabase, user!.id),
    getAppSettings(supabase, user!.id),
  ]);
  const names = settings.app_names ?? {};

  const visible = APP_CATALOG.filter((a) => (filter === "installed" ? active.has(a.id) : true));

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <p className="font-mono text-void-purple text-xs tracking-[0.2em] uppercase mb-3">
        <span className="text-void-cyan">//</span> App Store
      </p>
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Build your VOID.</h1>
      <p className="text-zinc-400 mb-8 max-w-2xl text-sm">
        Install the modular apps you want. Every app lands on your dashboard — and you can rename any of them to your liking.
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {FILTERS.map((f) => (
          <Link
            key={f.id}
            href={f.id === "all" ? "/dashboard/store" : `/dashboard/store?filter=${f.id}`}
            aria-current={filter === f.id ? "true" : undefined}
            className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition-colors ${
              filter === f.id
                ? "bg-void-purple text-white border-void-purple"
                : "text-zinc-400 border-zinc-800 hover:border-void-purple hover:text-white"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-zinc-500 border border-dashed border-zinc-800 rounded-2xl p-8 text-center">
          Nothing installed yet. <Link href="/dashboard/store" className="text-void-purple hover:text-white">Browse all →</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((app) => {
            const installed = active.has(app.id);
            const display = appName(app.id, names);
            return (
              <div key={app.id} className="bg-void-card/60 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-mono text-void-purple font-bold text-sm">
                    {app.abbr}
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border ${
                      installed ? "text-emerald-300 border-emerald-500/40" : "text-zinc-500 border-zinc-700"
                    }`}
                  >
                    {installed ? "Installed" : "Coming soon"}
                  </span>
                </div>

                <div>
                  <h3 className="text-white font-bold">{display}</h3>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{app.description}</p>
                </div>

                <div className="mt-auto space-y-2">
                  {installed ? (
                    <form action={deactivateApp}>
                      <input type="hidden" name="app_id" value={app.id} />
                      <button className="w-full py-2 rounded-xl border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 text-xs font-bold transition-colors">
                        Remove
                      </button>
                    </form>
                  ) : (
                    <form action={activateApp}>
                      <input type="hidden" name="app_id" value={app.id} />
                      <button className="w-full py-2 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white text-xs font-bold glow-purple transition-all">
                        Install
                      </button>
                    </form>
                  )}

                  {installed && (
                    <form action={renameApp} className="flex items-center gap-1.5">
                      <input type="hidden" name="app_id" value={app.id} />
                      <input
                        name="name"
                        defaultValue={names[app.id] ?? ""}
                        placeholder={`Rename (default: ${app.name})`}
                        maxLength={40}
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-[11px] text-white focus:outline-none focus:border-void-purple"
                      />
                      <button className="px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-void-purple text-[10px] font-mono font-bold text-zinc-300 hover:text-white">
                        Save
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
