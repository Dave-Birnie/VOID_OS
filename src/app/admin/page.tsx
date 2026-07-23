import Link from "next/link";
import {
  Shield,
  BarChart3,
  FileText,
  Users,
  Inbox,
  Sparkles,
  Megaphone,
  Bot,
  Rocket,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ModeSwitch } from "@/components/ModeSwitch";

export const dynamic = "force-dynamic";

// Small helper — a head:count query that never throws (missing table → 0).
async function countOf(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
): Promise<number | null> {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? 0;
}

type Section = {
  href: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number | null;
  countLabel?: string;
};

function SectionCard({ s }: { s: Section }) {
  const Icon = s.icon;
  return (
    <Link
      href={s.href}
      className="group flex flex-col justify-between gap-6 p-5 rounded-2xl bg-[#100f1a] border border-zinc-800 hover:border-void-purple/60 transition-colors min-h-[130px]"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
          <Icon className="w-5 h-5 text-void-purple" />
        </div>
        {typeof s.count === "number" && (
          <span className="text-right">
            <span className="block text-2xl font-black text-white leading-none">{s.count.toLocaleString()}</span>
            {s.countLabel && <span className="block text-[9px] text-zinc-500 uppercase tracking-wide">{s.countLabel}</span>}
          </span>
        )}
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-white">
          {s.title}
          <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-void-purple group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5">{s.desc}</p>
      </div>
    </Link>
  );
}

export default async function AdminHome() {
  const { profile } = await getUserAndProfile();
  const supabase = await createClient();

  const [users, posts, devlogs, shoutouts, transcripts, messages] = await Promise.all([
    countOf(supabase, "profiles"),
    countOf(supabase, "blog_posts"),
    countOf(supabase, "devlogs"),
    countOf(supabase, "shoutouts"),
    countOf(supabase, "chat_transcripts"),
    countOf(supabase, "community_messages"),
  ]);

  const sections: Section[] = [
    { href: "/admin/analytics", title: "Analytics", desc: "Site-wide traffic & platform pulse", icon: BarChart3 },
    { href: "/admin/blog", title: "Blog CMS", desc: "Write & publish public posts", icon: FileText, count: posts, countLabel: "posts" },
    { href: "/admin/devlogs", title: "Dev Journey", desc: "Watch-the-Dev devlog entries", icon: Rocket, count: devlogs, countLabel: "devlogs" },
    { href: "/admin/members", title: "Members", desc: "Grant Dev Pass & roles", icon: Users, count: users, countLabel: "users" },
    { href: "/admin/inbox", title: "Inbox", desc: "Reply to member DMs", icon: Inbox, count: messages, countLabel: "messages" },
    { href: "/admin/shoutouts", title: "Shoutouts", desc: "Broadcast to every user", icon: Megaphone, count: shoutouts, countLabel: "sent" },
    { href: "/admin/inspirations", title: "Inspirations", desc: "Daily verses & quotes", icon: Sparkles },
    { href: "/admin/transcripts", title: "Transcripts", desc: "Gideon sales-chat friction", icon: Bot, count: transcripts, countLabel: "sessions" },
    { href: "/admin/copilot", title: "Gideon Co-Pilot", desc: "Executive AI assistant", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 w-full">
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Overview
          </Link>
          <ModeSwitch />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Admin Command Center
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1">VOID OS Backend</h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">Everything that runs the platform, one place per job.</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 self-start">
            <Shield className="w-4 h-4" /> {profile?.full_name || profile?.email || "Executive Mode"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <SectionCard key={s.href} s={s} />
          ))}
        </div>
      </main>
    </div>
  );
}
