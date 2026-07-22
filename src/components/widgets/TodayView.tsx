import { Sparkles } from "lucide-react";

// Platform widget: a daily inspiration + snapshot. Static verse for now;
// wired to the Inspirations engine in a later phase.
export function TodayView() {
  return (
    <div className="h-full bg-[#100f1a] border border-purple-500/30 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-2 text-void-purple font-bold text-xs uppercase tracking-widest mb-3">
        <Sparkles className="w-4 h-4" /> Today View
      </div>
      <blockquote className="border-l-2 border-void-purple pl-4">
        <p className="text-white text-base md:text-lg italic leading-relaxed">
          &ldquo;Whatever your hand finds to do, do it with your might.&rdquo;
        </p>
        <cite className="font-mono text-[11px] text-zinc-500 not-italic">— Ecclesiastes 9:10</cite>
      </blockquote>
    </div>
  );
}
