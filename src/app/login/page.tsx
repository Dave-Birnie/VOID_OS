"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Mode = "signin" | "signup";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured || loading) return;
    setLoading(true);
    setError(null);
    setNotice(null);

    const supabase = createBrowserSupabase();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || email.split("@")[0] } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push(next);
        router.refresh();
      } else {
        setNotice("Check your email to confirm your account, then sign in.");
        setMode("signin");
        setLoading(false);
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 grid-bg">
      <div className="w-full max-w-sm">
        <Link href="/" aria-label="VOID OS home" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10">
            <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
              <path d="M 100,20 A 80,80 0 0,1 175,75" fill="none" stroke="url(#logoGrad)" strokeWidth="14" />
              <path d="M 100,20 A 80,80 0 0,0 25,75" fill="none" stroke="url(#logoGrad)" strokeWidth="14" />
              <path d="M 25,125 A 80,80 0 0,0 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="14" />
              <path d="M 175,125 A 80,80 0 0,1 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="14" />
              <path d="M 30,75 L 100,165 L 170,75 L 132,75 L 100,125 L 68,75 Z" fill="url(#logoGrad)" />
            </svg>
          </div>
          <span className="font-black text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-void-purple via-indigo-400 to-void-cyan font-mono">
            VOID OS
          </span>
        </Link>

        <div className="bg-[#100f1a] border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* Mode tabs */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-zinc-800 mb-6 font-mono text-xs" role="tablist" aria-label="Auth mode">
            {(
              [
                { id: "signin", label: "Sign In" },
                { id: "signup", label: "Create Account" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => {
                  setMode(id);
                  setError(null);
                  setNotice(null);
                }}
                className={`w-1/2 py-2 rounded-lg transition-all font-bold ${
                  mode === id
                    ? "bg-void-purple text-white glow-purple"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {!configured && (
            <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4 mb-6" role="status">
              <p className="text-amber-300 font-mono text-[10px] uppercase tracking-wide mb-1">
                // Backend not connected
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Set <code className="text-void-cyan">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-void-cyan">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable sign in.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" aria-hidden="true" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="text-emerald-400 text-xs" role="status">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !configured}
              className="w-full mt-2 py-3.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-void-purple to-void-blue text-white glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Working…" : mode === "signin" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-5 text-center">
            <span className="text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              Protected by Supabase Auth &amp; Row Level Security
            </span>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="font-mono text-zinc-500 text-xs hover:text-void-purple transition-colors">
            &larr; Back to voidos.io
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
