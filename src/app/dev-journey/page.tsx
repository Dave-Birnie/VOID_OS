import Link from "next/link";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { VisitorAiChatbot } from "@/components/VisitorAiChatbot";
import type { DevlogEntry } from "@/lib/supabase/client";
import { Video, Lock, Unlock, ArrowLeft } from "lucide-react";

// Where the "unlock" CTA sends members to back the campaign. Payment happens on
// Kickstarter; an admin then grants the Dev Pass from the admin dashboard.
const KICKSTARTER_URL = process.env.NEXT_PUBLIC_KICKSTARTER_URL || "#";

export default async function DevJourneyPage() {
  // Middleware guarantees a signed-in user reaches this page.
  const { profile } = await getUserAndProfile();
  const hasPass = !!(profile && (profile.has_dev_pass || profile.role === "admin"));

  const supabase = await createClient();
  const { data } = await supabase
    .from("devlogs")
    .select("*")
    .order("created_at", { ascending: false });
  const devlogs = (data as DevlogEntry[]) ?? [];

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-void-purple selection:text-white">
      <Header mode="developer" user={profile} />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-void-purple font-bold text-xs uppercase tracking-widest">
              <Video className="w-4 h-4 text-purple-400" /> Watch-The-Dev Portal
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white mt-1">Dave&apos;s Developer Journey</h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Unfiltered video devlogs, unlisted YouTube deep dives, and written engineering logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasPass ? (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Unlock className="w-4 h-4 text-emerald-400" /> Pass Unlocked
              </span>
            ) : (
              <a
                href={KICKSTARTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs glow-purple hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" /> Back the Builder Pass on Kickstarter
              </a>
            )}
          </div>
        </div>

        {devlogs.length === 0 && (
          <p className="text-sm text-zinc-500">No devlogs published yet. Check back soon.</p>
        )}

        {/* Devlog Entries Feed */}
        <div className="space-y-8">
          {devlogs.map((log) => (
            <article key={log.id} className="bg-[#100f1a] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                <span className="text-void-cyan font-bold">{log.created_at?.slice(0, 10)}</span>
                <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px]">Weekly Video Devlog</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{log.title}</h2>

              <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800 aspect-video mb-6 flex items-center justify-center">
                {hasPass && log.youtube_url ? (
                  <iframe
                    src={log.youtube_url}
                    title={log.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-void-purple" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Devlog Locked</h3>
                    <p className="text-xs text-zinc-400 max-w-md mt-1 mb-4">
                      Back the Watch-the-Dev Builder Pass on Kickstarter to unlock every unlisted video log and engineering write-up. Access is granted to your account once your pledge is confirmed.
                    </p>
                    <a
                      href={KICKSTARTER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-void-purple hover:bg-purple-600 text-white font-bold text-xs glow-purple transition-all"
                    >
                      Back it on Kickstarter
                    </a>
                  </div>
                )}
              </div>

              {/* Written content only rendered for pass holders */}
              {hasPass ? (
                <div className="prose prose-invert max-w-none text-xs md:text-sm text-zinc-300 leading-relaxed">
                  <div className="whitespace-pre-line">{log.content_md}</div>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">
                  The full written deep-dive unlocks with the Builder Pass.
                </p>
              )}
            </article>
          ))}
        </div>
      </main>

      <VisitorAiChatbot />
    </div>
  );
}
