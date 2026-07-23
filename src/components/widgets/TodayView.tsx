import { Sparkles } from "lucide-react";
import type { Inspiration } from "@/lib/inspirations";

// Platform widget: the day's inspiration. Verse/quote visibility is per-user
// (Settings → Today View); the content comes from the admin-editable doc.
export function TodayView({
  verse,
  quote,
  showVerse,
  showQuote,
}: {
  verse: Inspiration;
  quote: Inspiration;
  showVerse: boolean;
  showQuote: boolean;
}) {
  return (
    <div className="h-full themed-card themed-border border rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-2 themed-accent font-bold text-xs uppercase tracking-widest mb-3">
        <Sparkles className="w-4 h-4" /> Today View
      </div>

      {showVerse && (
        <blockquote className="border-l-2 pl-4 mb-4" style={{ borderColor: "var(--accent)" }}>
          <p className="themed-text text-base italic leading-relaxed">&ldquo;{verse.text}&rdquo;</p>
          <cite className="font-mono text-[11px] themed-muted not-italic">— {verse.attribution}</cite>
        </blockquote>
      )}

      {showQuote && (
        <blockquote className="border-l-2 pl-4" style={{ borderColor: "var(--accent-2)" }}>
          <p className="themed-text text-base italic leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
          <cite className="font-mono text-[11px] themed-muted not-italic">— {quote.attribution}</cite>
        </blockquote>
      )}

      {!showVerse && !showQuote && (
        <p className="text-xs themed-muted">Daily encouragement is off. Turn it on in Settings → Today View.</p>
      )}
    </div>
  );
}
