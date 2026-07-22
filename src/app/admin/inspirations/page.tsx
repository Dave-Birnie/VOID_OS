import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { serializeInspirations } from "@/lib/inspirations";
import { InspirationsEditor } from "@/components/InspirationsEditor";

export const metadata = { title: "Inspirations" };
export const dynamic = "force-dynamic";

export default async function AdminInspirationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("body").eq("key", "inspirations").maybeSingle();
  // Preload with the built-in library so the format is self-documenting.
  const body = data?.body && data.body.trim() ? data.body : serializeInspirations();

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-void-purple" /> Inspirations
          </h1>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          The verses and quotes that rotate daily in everyone&apos;s Today View. One entry per line — <span className="text-void-cyan">VERSE:</span> or <span className="text-void-cyan">QUOTE:</span> followed by the quoted text and its attribution.
        </p>
        <InspirationsEditor initialBody={body} />
      </main>
    </div>
  );
}
