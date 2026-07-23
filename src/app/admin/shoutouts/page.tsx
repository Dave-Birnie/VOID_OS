import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ShoutoutDispatcher } from "@/components/ShoutoutDispatcher";
import type { Shoutout } from "@/lib/supabase/client";

export const metadata = { title: "Shoutouts" };
export const dynamic = "force-dynamic";

export default async function AdminShoutoutsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shoutouts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-void-purple" /> Shoutouts
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Broadcast an announcement to every registered user — it lands in their notification bell and pops a toast on their dashboard.
        </p>
        <ShoutoutDispatcher shoutouts={(data as Shoutout[]) ?? []} />
      </main>
    </div>
  );
}
