import Link from "next/link";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { VisitorAiChatbot } from "@/components/VisitorAiChatbot";
import { MemberChat } from "@/components/MemberChat";
import type { CommunityMessage } from "@/lib/supabase/client";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default async function CommunityChatPage() {
  // Middleware guarantees a signed-in user reaches this page.
  const { profile } = await getUserAndProfile();

  const supabase = await createClient();
  // RLS scopes this to the member's own thread (admins get their own thread
  // here too; they moderate everyone from the admin Inbox).
  const { data } = await supabase
    .from("community_messages")
    .select("*")
    .order("created_at", { ascending: true });
  const messages = (data as CommunityMessage[]) ?? [];

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-void-purple selection:text-white">
      <Header mode="consumer" user={profile} />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>

        <div className="border-b border-zinc-800 pb-6 mb-8">
          <div className="flex items-center gap-2 text-void-pink font-bold text-xs uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 text-void-pink" /> Private Line
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white mt-1">Chat directly with Dave</h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            A private channel between you and the founder. Only you and Dave can see this conversation.
          </p>
        </div>

        <MemberChat initialMessages={messages} />
      </main>

      <VisitorAiChatbot />
    </div>
  );
}
