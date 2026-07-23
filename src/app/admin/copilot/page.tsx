import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";
import { AdminAiCopilot } from "@/components/AdminAiCopilot";

export const metadata = { title: "Gideon Co-Pilot" };

export default function AdminCopilotPage() {
  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-void-purple" /> Gideon Co-Pilot
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Your executive assistant — summarize transcripts, draft devlog copy, and pull executive stats.
        </p>
        <AdminAiCopilot />
      </main>
    </div>
  );
}
