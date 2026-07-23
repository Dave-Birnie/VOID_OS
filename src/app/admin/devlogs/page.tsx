import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DevlogPublisher } from "@/components/DevlogPublisher";

export const metadata = { title: "Devlogs" };
export const dynamic = "force-dynamic";

type DevlogRow = {
  id: string;
  title: string;
  slug: string;
  youtube_url: string | null;
  is_locked: boolean;
  created_at: string;
};

export default async function AdminDevlogsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("devlogs")
    .select("id, title, slug, youtube_url, is_locked, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-void-purple" /> Dev Journey
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Publish weekly engineering updates to the Watch-the-Dev portal. Locked entries are visible only to Dev Pass holders.
        </p>
        <DevlogPublisher devlogs={(data as DevlogRow[]) ?? []} />
      </main>
    </div>
  );
}
