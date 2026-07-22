"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { AdminAiCopilot } from "@/components/AdminAiCopilot";
import { getLocalAuthState, setLocalAuthState, UserProfile, ChatTranscript, Shoutout } from "@/lib/supabase/client";
import {
  Shield,
  BarChart3,
  MessageSquare,
  FileText,
  Megaphone,
  Bot,
  Users,
  CreditCard,
  Cpu,
  ArrowLeft,
  Plus,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "transcripts" | "copilot" | "cms" | "shoutouts">("analytics");

  // CMS Form State
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogYtUrl, setNewBlogYtUrl] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [cmsSuccess, setCmsSuccess] = useState(false);

  // Shoutouts State
  const [shoutoutTitle, setShoutoutTitle] = useState("");
  const [shoutoutMessage, setShoutoutMessage] = useState("");
  const [shoutoutSuccess, setShoutoutSuccess] = useState(false);
  const [shoutoutList, setShoutoutList] = useState<Shoutout[]>([
    {
      id: "sh_1",
      title: "Devlog #14 is Live!",
      message: "Check out the new architecture deep dive & unlisted YouTube video in the Dev Journey portal.",
      target_group: "All Registered Users",
      created_at: "2026-07-21",
    },
  ]);

  // Saved Transcripts
  const [transcripts, setTranscripts] = useState<ChatTranscript[]>([]);

  useEffect(() => {
    const existing = getLocalAuthState();
    if (existing) {
      setUser(existing);
    } else {
      // Set default mock admin profile for demo convenience
      const mockAdmin: UserProfile = {
        id: "admin_1",
        email: "dave@3amceo.com",
        full_name: "Dave Birnie (Admin)",
        role: "admin",
        has_dev_pass: true,
        ai_subscription_active: true,
        monthly_token_limit: 1000000,
        monthly_tokens_used: 124000,
        extra_token_credits: 500000,
      };
      setLocalAuthState(mockAdmin);
      setUser(mockAdmin);
    }

    // Load transcripts from local storage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("void_os_chat_transcripts");
      if (stored) {
        setTranscripts(JSON.parse(stored));
      } else {
        // Pre-populate sample transcript for demo analysis
        const sample: ChatTranscript = {
          id: "sess_sample_1",
          session_id: "sess_sample_1",
          visitor_email: "visitor@techcorp.com",
          messages: [
            { sender: "gideon", text: "Greetings! I'm Gideon, your VOID OS Assistant.", time: "14:02" },
            { sender: "user", text: "What's the difference between the $10 AI SaaS upgrade and self-hosting BYOK?", time: "14:03" },
            { sender: "gideon", text: "Self-hosting BYOK uses your own API key. The $10/mo SaaS Upgrade uses server-side OpenAI credits with dual bank tracking!", time: "14:03" },
            { sender: "user", text: "Got it! Does the $15 Watch-the-Dev pass give me access to chat with Dave?", time: "14:04" },
          ],
          summary: "Visitor inquiring about AI token banks & Dave chat access",
          pinch_points: ["AI Upgrade token allowance vs BYOK", "Watch-the-Dev pass community perk verification"],
          created_at: "2026-07-21 14:05",
        };
        setTranscripts([sample]);
      }
    }
  }, []);

  const handlePublishDevlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) return;

    setCmsSuccess(true);
    setTimeout(() => {
      setNewBlogTitle("");
      setNewBlogYtUrl("");
      setNewBlogContent("");
      setCmsSuccess(false);
    }, 1500);
  };

  const handleSendShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoutoutTitle || !shoutoutMessage) return;

    const newShoutout: Shoutout = {
      id: "sh_" + Date.now(),
      title: shoutoutTitle,
      message: shoutoutMessage,
      target_group: "All Registered Backers",
      created_at: new Date().toISOString().split("T")[0],
    };

    setShoutoutList([newShoutout, ...shoutoutList]);
    setShoutoutSuccess(true);
    setTimeout(() => {
      setShoutoutTitle("");
      setShoutoutMessage("");
      setShoutoutSuccess(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-void-purple selection:text-white">
      <Header
        mode="developer"
        onModeChange={() => {}}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setLocalAuthState(null);
          setUser(null);
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>

        {/* Blog CMS entry point */}
        <Link
          href="/admin/blog"
          className="flex items-center justify-between gap-3 mb-6 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/30 border border-purple-500/30 hover:border-purple-500/60 transition-all"
        >
          <span className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-void-purple" />
            <span>
              <span className="block text-sm font-bold text-white">Blog CMS</span>
              <span className="block text-[11px] text-zinc-400">Write, edit, and publish SEO blog posts</span>
            </span>
          </span>
          <span className="text-void-cyan text-xs font-bold">Open →</span>
        </Link>

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Shield className="w-4 h-4 text-amber-400" /> Admin Command Center
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white mt-1">VOID OS Admin CMS</h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Manage analytics, Gideon AI transcript pinch-point analysis, Devlog publishing, & Shoutout broadcasts.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
            <Shield className="w-4 h-4" /> Executive Mode Active
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap bg-[#100f1a] p-1.5 rounded-2xl border border-zinc-800 mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "analytics" ? "bg-void-purple text-white glow-purple" : "text-zinc-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab("transcripts")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "transcripts" ? "bg-void-cyan text-slate-950 glow-cyan" : "text-zinc-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Gideon Transcripts & Pinch-Points
          </button>
          <button
            onClick={() => setActiveTab("copilot")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "copilot" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="w-4 h-4" /> Gideon Executive Co-Pilot
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "cms" ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" /> Devlog CMS Publisher
          </button>
          <button
            onClick={() => setActiveTab("shoutouts")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "shoutouts" ? "bg-amber-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Megaphone className="w-4 h-4" /> Shoutouts Dispatcher
          </button>
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#100f1a] border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Total Signups</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">48</div>
                <span className="text-[9px] text-emerald-400 font-bold">+12 this week</span>
              </div>

              <div className="bg-[#100f1a] border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Dev Passes Unlocked</span>
                  <CreditCard className="w-4 h-4 text-void-cyan" />
                </div>
                <div className="text-3xl font-black text-white">14</div>
                <span className="text-[9px] text-void-cyan font-bold">$210 Kickstarter Gross</span>
              </div>

              <div className="bg-[#100f1a] border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>SaaS AI Subscriptions</span>
                  <Cpu className="w-4 h-4 text-void-pink" />
                </div>
                <div className="text-3xl font-black text-white">8</div>
                <span className="text-[9px] text-void-pink font-bold">$80.00 / mo recurring</span>
              </div>

              <div className="bg-[#100f1a] border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>AI Token Consumption</span>
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">1.24M</div>
                <span className="text-[9px] text-zinc-400 font-bold">Bank 1: 31% used</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GIDEON CHAT TRANSCRIPTS & PINCH-POINTS */}
        {activeTab === "transcripts" && (
          <div className="space-y-6">
            <div className="bg-[#100f1a] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-void-cyan" /> Gideon Public Chat Transcripts & Buyer Friction
                  </h3>
                  <span className="text-xs text-zinc-400">
                    Recorded conversation transcripts from the public sales chatbot to analyze visitor objections.
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                  {transcripts.length} Active Sessions Logged
                </span>
              </div>

              <div className="space-y-4">
                {transcripts.map((t) => (
                  <div key={t.id} className="bg-black/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span className="font-bold text-void-cyan">Session: {t.session_id}</span>
                      <span>Logged: {t.created_at}</span>
                    </div>

                    {/* Extracted Pinch points */}
                    <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl">
                      <h4 className="font-bold text-xs text-purple-300 mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Identified Visitor Pinch Points / Objections:
                      </h4>
                      <ul className="list-disc list-inside text-xs text-zinc-300 space-y-0.5">
                        {t.pinch_points?.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Messages snippet */}
                    <div className="space-y-2 text-xs">
                      {t.messages.map((m, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className={`font-bold ${m.sender === "gideon" ? "text-void-cyan" : "text-purple-400"}`}>
                            {m.sender === "gideon" ? "Gideon:" : "Visitor:"}
                          </span>
                          <span className="text-zinc-300">{m.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GIDEON EXECUTIVE CO-PILOT */}
        {activeTab === "copilot" && <AdminAiCopilot />}

        {/* TAB 4: DEVLOG CMS PUBLISHER */}
        {activeTab === "cms" && (
          <div className="bg-[#100f1a] border border-pink-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h3 className="font-bold text-white text-xl mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-void-pink" /> Dev Journey CMS Publisher App
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Create and publish weekly engineering updates with unlisted YouTube videos directly to the Watch-the-Dev portal.
            </p>

            <form onSubmit={handlePublishDevlog} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">Devlog Title</label>
                <input
                  type="text"
                  required
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  placeholder="Devlog #15: Custom AI Workflow Adapter Engine..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">YouTube Unlisted Video Embed URL</label>
                <input
                  type="url"
                  value={newBlogYtUrl}
                  onChange={(e) => setNewBlogYtUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">Blog Written Content (Markdown)</label>
                <textarea
                  rows={6}
                  required
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  placeholder="### Weekly Engineering Summary..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white"
                />
              </div>

              {cmsSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Devlog successfully published to the Watch-the-Dev Portal!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-void-pink hover:bg-pink-600 text-white font-bold text-xs glow-pink transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Plus className="w-4 h-4" /> Publish Devlog Entry
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: SHOUTOUTS DISPATCHER */}
        {activeTab === "shoutouts" && (
          <div className="space-y-6">
            <div className="bg-[#100f1a] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
              <h3 className="font-bold text-white text-xl mb-2 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" /> Shoutouts Dispatcher
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                Broadcast notification announcements directly to all registered users' backends.
              </p>

              <form onSubmit={handleSendShoutout} className="space-y-4 text-xs mb-8">
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Shoutout Headline</label>
                  <input
                    type="text"
                    required
                    value={shoutoutTitle}
                    onChange={(e) => setShoutoutTitle(e.target.value)}
                    placeholder="🔥 Kickstarter Campaign Goal Hit 50%!"
                    className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Shoutout Body Message</label>
                  <textarea
                    rows={3}
                    required
                    value={shoutoutMessage}
                    onChange={(e) => setShoutoutMessage(e.target.value)}
                    placeholder="We just reached $375 toward our $750 goal..."
                    className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white"
                  />
                </div>

                {shoutoutSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Broadcast Shoutout Dispatched to All Registered Users!
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Megaphone className="w-4 h-4" /> Send Broadcast Announcement
                </button>
              </form>

              {/* History */}
              <h4 className="font-bold text-sm text-white mb-3">Dispatched Shoutouts History</h4>
              <div className="space-y-2">
                {shoutoutList.map((s) => (
                  <div key={s.id} className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-xs">
                    <div className="flex justify-between font-bold text-amber-400 mb-1">
                      <span>{s.title}</span>
                      <span className="text-[9px] text-zinc-500">{s.created_at}</span>
                    </div>
                    <p className="text-zinc-300 text-[11px]">{s.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(u) => setUser(u)} />
    </div>
  );
}
