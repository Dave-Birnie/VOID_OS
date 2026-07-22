import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { InboxManager, type Thread } from "@/components/InboxManager";

export const metadata = { title: "Inbox" };

type Msg = {
  id: string;
  thread_user_id: string;
  user_name: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
};

export default async function AdminInboxPage() {
  const supabase = await createClient();
  const { data: msgs } = await supabase
    .from("community_messages")
    .select("id, thread_user_id, user_name, message, is_admin_reply, created_at")
    .order("created_at", { ascending: true });
  const messages = (msgs as Msg[]) ?? [];

  const ids = Array.from(new Set(messages.map((m) => m.thread_user_id)));
  let profiles: { id: string; full_name: string | null; email: string | null }[] = [];
  if (ids.length) {
    const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
    profiles = data ?? [];
  }
  const pmap = new Map(profiles.map((p) => [p.id, p]));

  const threads: Thread[] = ids
    .map((id) => {
      const tmsgs = messages.filter((m) => m.thread_user_id === id);
      const p = pmap.get(id);
      return {
        userId: id,
        name: p?.full_name || p?.email || "Member",
        email: p?.email || "",
        messages: tmsgs.map(({ id, user_name, message, is_admin_reply, created_at }) => ({
          id,
          user_name,
          message,
          is_admin_reply,
          created_at,
        })),
        lastAt: tmsgs[tmsgs.length - 1]?.created_at || "",
      };
    })
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-void-purple" /> Member Inbox
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Private 1:1 conversations from members. Reply and it lands in their Community Chat.
        </p>
        <InboxManager threads={threads} />
      </main>
    </div>
  );
}
