"use client";

import React, { useEffect, useState } from "react";
import { Rocket, CheckCircle2, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// Launch goal: our first cohort of monthly VOID Online members.
const GOAL = 50;

export const Waitlist: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "joined" | "error">("idle");
  const [message, setMessage] = useState("");

  // Load the live signup count.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("void_waitlist_count");
        if (!active) return;
        if (error) {
          setCount(0);
          return;
        }
        setCount(typeof data === "number" ? data : 0);
      } catch {
        if (active) setCount(0);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Count-up animation whenever the target count changes.
  useEffect(() => {
    if (count === null) return;
    const target = count;
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const { error } = await supabase
        .from("void_waitlist")
        .insert({ email: email.trim().toLowerCase(), name: name.trim() || null });

      if (error) {
        // Unique-violation => already signed up. Treat as a friendly success.
        if ((error as { code?: string }).code === "23505") {
          setStatus("joined");
          setMessage("You're already on the list — see you at launch!");
          return;
        }
        throw error;
      }
      setCount((c) => (c === null ? 1 : c + 1));
      setStatus("joined");
      setMessage("You're on the list! We'll email you the moment VOID Online opens.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
    }
  };

  const shown = count === null ? 0 : display;
  const pct = Math.min((shown / GOAL) * 100, 100);
  const spotsLeft = Math.max(GOAL - (count ?? 0), 0);

  return (
    <section id="waitlist" className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-[#100f1a] to-black p-6 md:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-void-purple/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row gap-8 items-center">
          {/* Copy + form */}
          <div className="flex-1 w-full font-mono">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-950/30 text-[10px] text-purple-300 uppercase tracking-widest font-bold">
              <Rocket className="w-3.5 h-3.5" aria-hidden="true" /> Join the VOID Online waitlist
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-4">
              Be one of our first 50 members.
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm mt-2 leading-relaxed">
              VOID Online opens to a founding cohort of <strong className="text-white">{GOAL} monthly members</strong>.
              Join the waitlist to claim your spot and get launch-day access.
            </p>

            {status === "joined" ? (
              <div className="mt-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={join} className="mt-6 space-y-2.5 max-w-md">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First name (optional)"
                    aria-label="First name"
                    className="sm:w-2/5 px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    aria-label="Email address"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-void-purple to-void-blue text-white glow-purple hover:opacity-95 transition-all min-h-[44px] disabled:opacity-60"
                >
                  {status === "loading" ? "Joining…" : "Join the Waitlist →"}
                </button>
                {status === "error" && <p className="text-xs text-red-400">{message}</p>}
              </form>
            )}
          </div>

          {/* Ticker */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="rounded-2xl bg-black/50 border border-zinc-800 p-6 text-center font-mono">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-widest">
                <Users className="w-3.5 h-3.5 text-void-cyan" aria-hidden="true" /> Founding members
              </div>
              <div className="mt-2 flex items-end justify-center gap-1.5">
                <span className="text-5xl font-black text-white tabular-nums">{shown}</span>
                <span className="text-lg text-zinc-500 font-bold mb-1">/ {GOAL}</span>
              </div>

              <div className="mt-4 h-3 w-full rounded-full bg-zinc-800 overflow-hidden" role="progressbar" aria-valuenow={shown} aria-valuemin={0} aria-valuemax={GOAL} aria-label="Waitlist progress">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-void-purple to-void-cyan transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="mt-3 text-[11px] text-zinc-400">
                {spotsLeft > 0 ? (
                  <><strong className="text-void-cyan">{spotsLeft}</strong> spots left</>
                ) : (
                  <span className="text-void-cyan font-bold">Goal reached — join the next cohort!</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
