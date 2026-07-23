import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Globe, Github, Youtube, MapPin, BadgeCheck, Shield, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { BadgeList } from "@/components/BadgeList";
import { statLevel } from "@/lib/lifeStats";
import { referralStanding } from "@/lib/referralTiers";

export const dynamic = "force-dynamic";

type PublicProfile = {
  handle: string;
  full_name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  x_url: string | null;
  github_url: string | null;
  youtube_url: string | null;
  is_founding_backer: boolean;
  is_admin: boolean;
  created_at: string;
  apps_active: number;
  life_score: number;
  referral_count: number;
  badges: string[];
};

async function fetchProfile(handle: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_profile", { p_handle: handle });
  return (data as PublicProfile) ?? null;
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const p = await fetchProfile(params.handle);
  if (!p) return { title: "Profile not found" };
  const name = p.full_name || `@${p.handle}`;
  return {
    title: `${name} (@${p.handle})`,
    description: p.tagline || p.bio || `${name} on VOID OS.`,
    robots: { index: true, follow: true },
  };
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="themed-card border themed-border rounded-2xl px-4 py-3 text-center">
      <div className="text-2xl font-black themed-text leading-none">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wide themed-muted mt-1">{label}</div>
    </div>
  );
}

function LinkPill({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border themed-border themed-text text-xs hover:border-[color:var(--accent)] transition-colors"
    >
      {icon} {label}
    </a>
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function PublicProfilePage({ params }: { params: { handle: string } }) {
  const p = await fetchProfile(params.handle);
  if (!p) notFound();

  const name = p.full_name || `@${p.handle}`;
  const since = new Date(p.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const level = statLevel(p.life_score);
  const tier = referralStanding(p.referral_count ?? 0).current;

  return (
    <main className="min-h-screen grid-bg">
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs themed-accent hover:opacity-80 mb-8">
          <ArrowLeft className="w-4 h-4" /> VOID OS
        </Link>

        <div className="themed-card border themed-border rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name={name} src={p.avatar_url} handle={p.handle} size={96} className="shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black themed-text">{name}</h1>
                {p.is_founding_backer && <BadgeCheck className="w-5 h-5 text-amber-400" aria-label="Founding Backer" />}
                {p.is_admin && <Shield className="w-4 h-4 themed-accent" aria-label="Team" />}
              </div>
              <div className="text-sm themed-muted font-mono">@{p.handle}</div>
              {p.tagline && <p className="text-sm themed-text mt-1.5">{p.tagline}</p>}
              <div className="flex items-center gap-3 mt-2 text-xs themed-muted flex-wrap">
                {p.location && (
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.location}</span>
                )}
                <span>Member since {since}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {p.is_founding_backer && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <BadgeCheck className="w-3.5 h-3.5" /> Founding Backer
              </div>
            )}
            {tier && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border themed-border themed-text text-xs font-bold">
                <span>{tier.emoji}</span> {tier.name}
              </div>
            )}
          </div>

          {p.bio && <p className="mt-5 text-sm themed-text leading-relaxed whitespace-pre-line">{p.bio}</p>}

          {/* Badges */}
          {p.badges && p.badges.length > 0 && (
            <div className="mt-6">
              <h2 className="font-mono themed-muted text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Achievements</h2>
              <BadgeList earned={p.badges} size="sm" />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <StatChip label="Level" value={String(level)} />
            <StatChip label="Apps active" value={String(p.apps_active)} />
            <StatChip label="Invited" value={String(p.referral_count ?? 0)} />
          </div>

          {/* Links */}
          {(p.website_url || p.x_url || p.github_url || p.youtube_url) && (
            <div className="flex flex-wrap gap-2 mt-6">
              {p.website_url && <LinkPill href={p.website_url} icon={<Globe className="w-3.5 h-3.5" />} label={hostOf(p.website_url)} />}
              {p.x_url && <LinkPill href={p.x_url} icon={<span className="font-black text-xs">𝕏</span>} label="X" />}
              {p.github_url && <LinkPill href={p.github_url} icon={<Github className="w-3.5 h-3.5" />} label="GitHub" />}
              {p.youtube_url && <LinkPill href={p.youtube_url} icon={<Youtube className="w-3.5 h-3.5" />} label="YouTube" />}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] themed-muted mt-6">
          Powered by <Link href="/" className="themed-accent hover:opacity-80">VOID OS</Link> — your gamified Life OS.
        </p>
      </div>
    </main>
  );
}
