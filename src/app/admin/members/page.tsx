import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MembersManager } from "@/components/MembersManager";
import type { UserProfile } from "@/lib/supabase/client";

export const metadata = { title: "Members" };

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, role, has_dev_pass, ai_subscription_active, monthly_token_limit, monthly_tokens_used, extra_token_credits"
    )
    .order("created_at", { ascending: false });
  const members = (data as UserProfile[]) ?? [];

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-void-purple" /> Members
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Grant the Dev Pass to confirmed Kickstarter backers to unlock the Dev Journey portal, or manage admin access.
        </p>
        <MembersManager members={members} />
      </main>
    </div>
  );
}
