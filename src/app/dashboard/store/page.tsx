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
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs themed-accent hover:opacity-80 mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <p className="font-mono themed-accent text-xs tracking-[0.2em] uppercase mb-3">
        <span className="themed-accent-2">//</span> App Store
      </p>
      <h1 className="text-3xl sm:text-4xl font-black themed-text tracking-tight mb-2">Build your VOID.</h1>
      <p className="themed-muted mb-8 max-w-2xl text-sm">
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
                ? "themed-accent-bg border-transparent"
                : "themed-muted themed-border themed-hover hover:opacity-80"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm themed-muted border border-dashed themed-border rounded-2xl p-8 text-center">
          Nothing installed yet. <Link href="/dashboard/store" className="themed-accent hover:opacity-80">Browse all →</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((app) => {
            const installed = active.has(app.id);
            const display = appName(app.id, names);
            return (
              <div key={app.id} className="themed-card border themed-border rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl border themed-accent-border flex items-center justify-center font-mono themed-accent font-bold text-sm">
                    {app.abbr}
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border ${
                      installed ? "text-emerald-300 border-emerald-500/40" : "themed-muted themed-border"
                    }`}
                  >
                    {installed ? "Installed" : "Coming soon"}
                  </span>
                </div>

                <div>
                  <h3 className="themed-text font-bold">{display}</h3>
                  <p className="themed-muted text-xs mt-1 leading-relaxed">{app.description}</p>
                </div>

                <div className="mt-auto space-y-2">
                  {installed ? (
                    <form action={deactivateApp}>
                      <input type="hidden" name="app_id" value={app.id} />
                      <button className="w-full py-2 rounded-xl border themed-border hover:border-red-500/50 themed-muted hover:text-red-400 text-xs font-bold transition-colors">
                        Remove
                      </button>
                    </form>
                  ) : (
                    <form action={activateApp}>
                      <input type="hidden" name="app_id" value={app.id} />
                      <button className="w-full py-2 rounded-xl themed-accent-bg text-xs font-bold transition-all">
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
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg themed-surface border themed-border text-[11px] themed-text focus:outline-none focus:border-void-purple"
                      />
                      <button className="px-2.5 py-1.5 rounded-lg border themed-border themed-hover text-[10px] font-mono font-bold themed-text hover:opacity-80">
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
