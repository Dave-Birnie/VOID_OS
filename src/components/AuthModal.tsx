"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { UserProfile, setLocalAuthState, isAdminEmail } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const router = useRouter();
  const [tab, setTab] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        email: email || "demo@voidos.io",
        full_name: name || (email ? email.split("@")[0] : "Demo Member"),
        role: isAdminEmail(email) ? "admin" : "user",
        has_dev_pass: true,
        ai_subscription_active: true,
        monthly_token_limit: 500000,
        monthly_tokens_used: 124000,
        extra_token_credits: 100000,
      };

      setLocalAuthState(mockProfile);
      setIsLoading(false);
      onSuccess(mockProfile);
      onClose();
      // Admins go straight to their dashboard after signing in.
      if (mockProfile.role === "admin") {
        router.push("/admin");
      }
    }, 600);
  };

  const handleOAuth = (provider: "Google" | "Facebook") => {
    setIsLoading(true);
    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        email: `${provider.toLowerCase()}_user@voidos.io`,
        full_name: `${provider} User`,
        role: "user",
        has_dev_pass: true,
        ai_subscription_active: true,
        monthly_token_limit: 500000,
        monthly_tokens_used: 45000,
        extra_token_credits: 50000,
      };

      setLocalAuthState(mockProfile);
      setIsLoading(false);
      onSuccess(mockProfile);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={tab === "register" ? "Register a free account" : "Sign in"}
    >
      <div className="bg-[#100f1a] w-full max-w-md rounded-3xl border border-purple-500/30 p-6 md:p-8 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full bg-black/40 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3">
            <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
              <path d="M 100,20 A 80,80 0 0,1 175,75" fill="none" stroke="url(#logoGrad)" strokeWidth="14"/>
              <path d="M 100,20 A 80,80 0 0,0 25,75" fill="none" stroke="url(#logoGrad)" strokeWidth="14"/>
              <path d="M 25,125 A 80,80 0 0,0 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="14"/>
              <path d="M 175,125 A 80,80 0 0,1 100,180" fill="none" stroke="url(#logoGrad)" strokeWidth="14"/>
              <path d="M 30,75 L 100,165 L 170,75 L 132,75 L 100,125 L 68,75 Z" fill="url(#logoGrad)"/>
            </svg>
          </div>
          <h3 className="text-2xl font-black font-mono text-white">
            {tab === "register" ? "Register Free Account" : "Welcome Back"}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {tab === "register" ? "Unlock user portal, devlogs, & community chat access." : "Sign in to access your VOID OS account."}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex bg-black/50 p-1 rounded-xl border border-zinc-800 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`w-1/2 py-2 rounded-lg transition-all font-bold ${
              tab === "register" ? "bg-void-purple text-white glow-purple" : "text-zinc-400 hover:text-white"
            }`}
          >
            Register Free
          </button>
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`w-1/2 py-2 rounded-lg transition-all font-bold ${
              tab === "login" ? "bg-void-cyan text-slate-950 glow-cyan" : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Social Provider OAuth Buttons */}
        <div className="space-y-2.5 mb-6">
          <button
            onClick={() => handleOAuth("Google")}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-800 bg-black/40 hover:bg-zinc-900 text-xs font-mono text-white transition-all flex items-center justify-center gap-2 hover:border-zinc-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuth("Facebook")}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-800 bg-black/40 hover:bg-zinc-900 text-xs font-mono text-white transition-all flex items-center justify-center gap-2 hover:border-blue-900/50"
          >
            <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-zinc-500 uppercase">Or Email</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "register" && (
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Dave Birnie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="dave@3amceo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-black/60 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-void-purple to-void-blue text-white glow-purple hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            {isLoading ? "Authenticating..." : tab === "register" ? "Create Free Account" : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Protected by Supabase Auth RLS Data Sovereignty
          </span>
        </div>
      </div>
    </div>
  );
};
