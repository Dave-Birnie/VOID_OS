import Link from "next/link";
import { ArrowLeft, Bot, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ChatTranscript } from "@/lib/supabase/client";

export const metadata = { title: "Transcripts" };
export const dynamic = "force-dynamic";

export default async function AdminTranscriptsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chat_transcripts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const transcripts = (data as ChatTranscript[]) ?? [];

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-void-purple" /> Gideon Transcripts
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Recorded conversations from the public sales chatbot, with the buyer-friction pinch points Gideon flagged.
        </p>

        {transcripts.length === 0 && <p className="text-xs text-zinc-500">No transcripts recorded yet.</p>}

        <div className="space-y-4">
          {transcripts.map((t) => (
            <div key={t.id} className="bg-[#100f1a] border border-zinc-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                <span className="font-bold text-void-cyan">Session: {t.session_id}</span>
                <span>{t.created_at?.slice(0, 16).replace("T", " ")}</span>
              </div>

              {t.pinch_points && t.pinch_points.length > 0 && (
                <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl">
                  <h4 className="font-bold text-xs text-purple-300 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Pinch points:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-zinc-300 space-y-0.5">
                    {t.pinch_points.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 text-xs">
                {t.messages.map((m, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className={`font-bold ${m.sender === "gideon" ? "text-void-cyan" : "text-purple-400"}`}>
                      {m.sender === "gideon" ? "Gideon:" : "Visitor:"}
                    </span>
                    <span className="text-zinc-300">{m.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
