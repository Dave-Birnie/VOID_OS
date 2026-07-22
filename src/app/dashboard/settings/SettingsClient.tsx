"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Palette, User, Cpu, Sparkles } from "lucide-react";
import { THEMES, applyTheme, type ThemeId } from "@/lib/theme";
import { saveAppearance, saveAccount, saveAiProvider, saveTodayPrefs } from "./actions";

export interface SettingsInitial {
  full_name: string;
  nickname: string;
  timezone: string;
  theme: ThemeId;
  font_size: "s" | "m" | "l";
  show_verses: boolean;
  show_quotes: boolean;
  ai_provider: string;
  ai_model: string;
  ai_has_key: boolean;
}

const FONT_SIZES = [
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
] as const;

const PROVIDERS = [
  { id: "openai", label: "OpenAI" },
  { id: "gemini", label: "Gemini" },
  { id: "anthropic", label: "Anthropic" },
  { id: "openrouter", label: "OpenRouter" },
];

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="themed-card themed-border border rounded-3xl p-6 shadow-xl">
      <h2 className="flex items-center gap-2 text-lg font-bold themed-text mb-5">
        <span className="themed-accent">{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}

function Status({ s }: { s: { ok: boolean; msg: string } | null }) {
  if (!s) return null;
  return (
    <p className={`text-xs mt-3 ${s.ok ? "text-emerald-400" : "text-red-400"}`}>{s.msg}</p>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border themed-border bg-[var(--surface)] themed-text text-xs focus:outline-none focus:border-[color:var(--accent)] min-h-[44px]";

export function SettingsClient({ initial }: { initial: SettingsInitial }) {
  const router = useRouter();

  const [theme, setTheme] = useState<ThemeId>(initial.theme);
  const [fontSize, setFontSize] = useState(initial.font_size);
  const [apStatus, setApStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const [acStatus, setAcStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [aiStatus, setAiStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [tvStatus, setTvStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const pickTheme = (id: ThemeId) => {
    setTheme(id);
    applyTheme(id); // live preview
  };

  const submitAppearance = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.set("theme", theme);
    fd.set("font_size", fontSize);
    const res = await saveAppearance(fd);
    setApStatus(res.ok ? { ok: true, msg: "Appearance saved." } : { ok: false, msg: res.error ?? "Failed." });
    router.refresh();
  };

  const submitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveAccount(new FormData(e.target as HTMLFormElement));
    setAcStatus(res.ok ? { ok: true, msg: "Account saved." } : { ok: false, msg: res.error ?? "Failed." });
    router.refresh();
  };

  const submitAi = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveAiProvider(new FormData(e.target as HTMLFormElement));
    setAiStatus(res.ok ? { ok: true, msg: "AI provider saved." } : { ok: false, msg: res.error ?? "Failed." });
    router.refresh();
  };

  const submitToday = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveTodayPrefs(new FormData(e.target as HTMLFormElement));
    setTvStatus(res.ok ? { ok: true, msg: "Today View saved." } : { ok: false, msg: res.error ?? "Failed." });
    router.refresh();
  };

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs themed-accent hover:opacity-80 mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>
      <h1 className="text-3xl sm:text-4xl font-black themed-text tracking-tight mb-8">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Appearance */}
        <Section icon={<Palette className="w-5 h-5" />} title="Appearance">
          <form onSubmit={submitAppearance}>
            <h3 className="text-[11px] font-mono uppercase tracking-wide themed-muted mb-3">Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => pickTheme(th.id)}
                  className={`text-left rounded-2xl border p-3 transition-all ${
                    theme === th.id ? "border-[color:var(--accent)] ring-1 ring-[color:var(--accent)]" : "themed-border hover:border-[color:var(--accent)]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    {th.swatch.map((c, i) => (
                      <span key={i} className="w-5 h-5 rounded-md border themed-border" style={{ background: c }} />
                    ))}
                    {theme === th.id && <Check className="w-4 h-4 ml-auto themed-accent" />}
                  </div>
                  <div className="text-sm font-bold themed-text">{th.name}</div>
                  <div className="text-[11px] themed-muted">{th.blurb}</div>
                </button>
              ))}
            </div>

            <h3 className="text-[11px] font-mono uppercase tracking-wide themed-muted mt-5 mb-2">Font size</h3>
            <div className="flex gap-2">
              {FONT_SIZES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontSize(f.id)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-colors ${
                    fontSize === f.id ? "themed-accent-bg border-transparent" : "themed-border themed-muted hover:themed-text"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button type="submit" className="mt-5 px-5 py-2.5 rounded-xl themed-accent-bg font-bold text-xs">
              Save appearance
            </button>
            <Status s={apStatus} />
          </form>
        </Section>

        {/* Today View */}
        <Section icon={<Sparkles className="w-5 h-5" />} title="Today View">
          <p className="text-xs themed-muted mb-4">Daily encouragement shown on your dashboard&apos;s Today View widget.</p>
          <form onSubmit={submitToday} className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm themed-text">
              <input type="checkbox" name="verses" defaultChecked={initial.show_verses} className="w-4 h-4 rounded accent-[var(--accent)]" />
              Show a daily <strong>scripture verse</strong>
            </label>
            <label className="flex items-center gap-2.5 text-sm themed-text">
              <input type="checkbox" name="quotes" defaultChecked={initial.show_quotes} className="w-4 h-4 rounded accent-[var(--accent)]" />
              Show a daily <strong>motivational quote</strong>
            </label>
            <button type="submit" className="px-5 py-2.5 rounded-xl themed-accent-bg font-bold text-xs">Save Today View</button>
            <Status s={tvStatus} />
          </form>
        </Section>

        {/* Account */}
        <Section icon={<User className="w-5 h-5" />} title="Account">
          <form onSubmit={submitAccount} className="space-y-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Display name</label>
              <input name="full_name" defaultValue={initial.full_name} className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Nickname</label>
              <input name="nickname" defaultValue={initial.nickname} placeholder="What Gideon calls you" className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Timezone</label>
              <input name="timezone" defaultValue={initial.timezone} placeholder="America/Toronto" className={inputCls} />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-xl themed-accent-bg font-bold text-xs">Save account</button>
            <Status s={acStatus} />
          </form>
        </Section>

        {/* AI Provider (BYOK) */}
        <Section icon={<Cpu className="w-5 h-5" />} title="AI Provider (BYOK)">
          <p className="text-xs themed-muted mb-4">
            Bring your own key. Your key is stored on your profile and used to power AI features. Leave the key blank to keep your current one.
          </p>
          <form onSubmit={submitAi} className="space-y-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Provider</label>
              <select name="provider" defaultValue={initial.ai_provider} className={inputCls}>
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">Model</label>
              <input name="model" defaultValue={initial.ai_model} placeholder="e.g. gpt-4o-mini, gemini-1.5-flash" className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wide themed-muted">
                API key {initial.ai_has_key && <span className="text-emerald-400 normal-case">· saved</span>}
              </label>
              <input name="api_key" type="password" placeholder={initial.ai_has_key ? "•••••••• (leave blank to keep)" : "Paste your API key"} className={inputCls} />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-xl themed-accent-bg font-bold text-xs">Save AI settings</button>
            <Status s={aiStatus} />
          </form>
        </Section>
      </div>
    </div>
  );
}
