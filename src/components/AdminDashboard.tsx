"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { AdminAiCopilot } from "@/components/AdminAiCopilot";
import type { UserProfile, ChatTranscript, Shoutout } from "@/lib/supabase/client";
import { sendShoutout, publishDevlog } from "@/app/admin/actions";
import {
  Shield,
  BarChart3,
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
  Inbox,
} from "lucide-react";

interface AdminDashboardProps {
  user: UserProfile | null;
  transcripts: ChatTranscript[];
  shoutouts: Shoutout[];
}

type Tab = "analytics" | "transcripts" | "copilot" | "cms" | "shoutouts";

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, transcripts, shoutouts }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  // Devlog CMS form state
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogYtUrl, setNewBlogYtUrl] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [cmsStatus, setCmsStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [cmsBusy, setCmsBusy] = useState(false);

  // Shoutouts form state
  const [shoutoutTitle, setShoutoutTitle] = useState("");
  const [shoutoutMessage, setShoutoutMessage] = useState("");
  const [shoutoutStatus, setShoutoutStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [shoutoutBusy, setShoutoutBusy] = useState(false);

  const handlePublishDevlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) return;
    setCmsBusy(true);
    setCmsStatus(null);

    const fd = new FormData();
    fd.set("title", newBlogTitle);
    fd.set("youtube_url", newBlogYtUrl);
    fd.set("content_md", newBlogContent);
    fd.set("is_locked", "on");

    const res = await publishDevlog(fd);
    setCmsBusy(false);
    if (res.ok) {
      setNewBlogTitle("");
      setNewBlogYtUrl("");
      setNewBlogContent("");
      setCmsStatus({ ok: true, msg: "Devlog published to the Watch-the-Dev Portal!" });
      router.refresh();
    } else {
      setCmsStatus({ ok: false, msg: res.error ?? "Could not publish." });
    }
  };

  const handleSendShoutout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoutoutTitle || !shoutoutMessage) return;
    setShoutoutBusy(true);
    setShoutoutStatus(null);

    const fd = new FormData();
    fd.set("title", shoutoutTitle);
    fd.set("message", shoutoutMessage);

    const res = await sendShoutout(fd);
    setShoutoutBusy(false);
    if (res.ok) {
      setShoutoutTitle("");
      setShoutoutMessage("");
      setShoutoutStatus({ ok: true, msg: "Broadcast dispatched to all registered users!" });
      router.refresh();
    } else {
      setShoutoutStatus({ ok: false, msg: res.error ?? "Could not send broadcast." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-void-purple selection:text-white">
      <Header mode="developer" onModeChange={() => {}} user={user} />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>

        {/* Backend section entry points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Link
            href="/admin/blog"
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/30 border border-purple-500/30 hover:border-purple-500/60 transition-all"
          >
            <FileText className="w-5 h-5 text-void-purple flex-shrink-0" />
            <span>
              <span className="block text-sm font-bold text-white">Blog CMS</span>
              <span className="block text-[11px] text-zinc-400">Write &amp; publish posts</span>
            </span>
          </Link>
          <Link
            href="/admin/members"
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/30 border border-purple-500/30 hover:border-purple-500/60 transition-all"
          >
            <Users className="w-5 h-5 text-void-purple flex-shrink-0" />
            <span>
              <span className="block text-sm font-bold text-white">Members</span>
              <span className="block text-[11px] text-zinc-400">Grant Dev Pass &amp; roles</span>
            </span>
          </Link>
          <Link
            href="/admin/inbox"
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/30 border border-purple-500/30 hover:border-purple-500/60 transition-all"
          >
            <Inbox className="w-5 h-5 text-void-purple flex-shrink-0" />
            <span>
              <span className="block text-sm font-bold text-white">Inbox</span>
              <span className="block text-[11px] text-zinc-400">Reply to member DMs</span>
            </span>
          </Link>
        </div>

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Shield className="w-4 h-4 text-amber-400" /> Admin Command Center
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white mt-1">VOID OS Admin CMS</h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Manage analytics, Gideon AI transcript pinch-point analysis, Devlog publishing, &amp; Shoutout broadcasts.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
            <Shield className="w-4 h-4" /> {user?.full_name || user?.email || "Executive Mode Active"}
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
            <HelpCircle className="w-4 h-4" /> Gideon Transcripts &amp; Pinch-Points
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
                  <span>Registered Users</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">—</div>
                <span className="text-[9px] text-zinc-500 font-bold">Live count via Supabase</span>
              </div>

              <div className="bg-[#100f1a] border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Dev Passes Unlocked</span>
                  <CreditCard className="w-4 h-4 text-void-cyan" />
                </div>
                <div className="text-3xl font-black text-white">—</div>
                <span className="text-[9px] text-void-cyan font-bold">Kickstarter gross</span>
              </div>

              <div className="bg-[#100f1a] border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Gideon Transcripts</span>
                  <Cpu className="w-4 h-4 text-void-pink" />
                </div>
                <div className="text-3xl font-black text-white">{transcripts.length}</div>
                <span className="text-[9px] text-void-pink font-bold">Sessions logged</span>
              </div>

              <div className="bg-[#100f1a] border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Shoutouts Sent</span>
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{shoutouts.length}</div>
                <span className="text-[9px] text-zinc-400 font-bold">Broadcast history</span>
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
                    <Bot className="w-5 h-5 text-void-cyan" /> Gideon Public Chat Transcripts &amp; Buyer Friction
                  </h3>
                  <span className="text-xs text-zinc-400">
                    Recorded transcripts from the public sales chatbot to analyze visitor objections.
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                  {transcripts.length} Sessions Logged
                </span>
              </div>

              {transcripts.length === 0 && (
                <p className="text-xs text-zinc-500">No transcripts recorded yet.</p>
              )}

              <div className="space-y-4">
                {transcripts.map((t) => (
                  <div key={t.id} className="bg-black/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span className="font-bold text-void-cyan">Session: {t.session_id}</span>
                      <span>Logged: {t.created_at}</span>
                    </div>

                    {t.pinch_points && t.pinch_points.length > 0 && (
                      <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl">
                        <h4 className="font-bold text-xs text-purple-300 mb-1 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Identified Visitor Pinch Points:
                        </h4>
                        <ul className="list-disc list-inside text-xs text-zinc-300 space-y-0.5">
                          {t.pinch_points.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

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
              <FileText className="w-5 h-5 text-void-pink" /> Dev Journey CMS Publisher
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Publish weekly engineering updates with unlisted YouTube videos to the Watch-the-Dev portal.
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
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">Written Content (Markdown)</label>
                <textarea
                  rows={6}
                  required
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  placeholder="### Weekly Engineering Summary..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white"
                />
              </div>

              {cmsStatus && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 border ${
                    cmsStatus.ok
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> {cmsStatus.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={cmsBusy}
                className="w-full py-3.5 rounded-xl bg-void-pink hover:bg-pink-600 text-white font-bold text-xs glow-pink transition-all flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60"
              >
                <Plus className="w-4 h-4" /> {cmsBusy ? "Publishing…" : "Publish Devlog Entry"}
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
                Broadcast announcements directly to every registered user.
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

                {shoutoutStatus && (
                  <div
                    className={`p-3 rounded-xl flex items-center gap-2 border ${
                      shoutoutStatus.ok
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> {shoutoutStatus.msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={shoutoutBusy}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60"
                >
                  <Megaphone className="w-4 h-4" /> {shoutoutBusy ? "Sending…" : "Send Broadcast Announcement"}
                </button>
              </form>

              <h4 className="font-bold text-sm text-white mb-3">Dispatched Shoutouts History</h4>
              {shoutouts.length === 0 && <p className="text-xs text-zinc-500">No broadcasts sent yet.</p>}
              <div className="space-y-2">
                {shoutouts.map((s) => (
                  <div key={s.id} className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-xs">
                    <div className="flex justify-between font-bold text-amber-400 mb-1">
                      <span>{s.title}</span>
                      <span className="text-[9px] text-zinc-500">{s.created_at?.slice(0, 10)}</span>
                    </div>
                    <p className="text-zinc-300 text-[11px]">{s.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
