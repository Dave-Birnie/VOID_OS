"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2, Eye, EyeOff, KeyRound, RefreshCw, FileText } from "lucide-react";
import { BLOG_ADMIN_FN, BlogPost } from "@/lib/blog";

const TOKEN_KEY = "void_os_blog_token";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  cover_emoji: string;
  tags: string;
  seo_description: string;
  content_md: string;
  published: boolean;
};

const emptyDraft: Draft = {
  slug: "",
  title: "",
  excerpt: "",
  cover_emoji: "📝",
  tags: "",
  seo_description: "",
  content_md: "",
  published: false,
};

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function BlogAdminPage() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "info"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  const call = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch(BLOG_ADMIN_FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON,
          Authorization: `Bearer ${ANON}`,
        },
        body: JSON.stringify({ ...payload, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      return data;
    },
    [token]
  );

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await call({ action: "list" });
      setPosts(data.posts || []);
      setStatus(null);
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, [token, call]);

  useEffect(() => {
    if (token) refresh();
  }, [token, refresh]);

  const saveToken = () => {
    const t = tokenInput.trim();
    if (!t) return;
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setTokenInput("");
  };

  const logoutToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setPosts([]);
  };

  const startNew = () => {
    setDraft(emptyDraft);
    setEditingSlug(null);
    setStatus(null);
  };

  const startEdit = (p: BlogPost) => {
    setDraft({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || "",
      cover_emoji: p.cover_emoji || "📝",
      tags: (p.tags || []).join(", "),
      seo_description: p.seo_description || "",
      content_md: p.content_md || "",
      published: p.published,
    });
    setEditingSlug(p.slug);
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    const slug = draft.slug ? slugify(draft.slug) : slugify(draft.title);
    if (!draft.title || !slug) {
      setStatus({ kind: "err", msg: "Title (and a slug) are required." });
      return;
    }
    setLoading(true);
    try {
      await call({
        action: "upsert",
        post: {
          slug,
          title: draft.title,
          excerpt: draft.excerpt || null,
          cover_emoji: draft.cover_emoji || "📝",
          tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
          seo_description: draft.seo_description || null,
          content_md: draft.content_md,
          published: draft.published,
        },
      });
      setStatus({ kind: "ok", msg: `Saved “${draft.title}”.` });
      startNew();
      await refresh();
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (p: BlogPost) => {
    setLoading(true);
    try {
      await call({ action: "upsert", post: { slug: p.slug, title: p.title, published: !p.published } });
      await refresh();
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (p: BlogPost) => {
    if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await call({ action: "delete", slug: p.slug });
      if (editingSlug === p.slug) startNew();
      await refresh();
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main id="main-content" className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-void-purple" aria-hidden="true" /> Blog CMS
          </h1>
        </div>

        {!token ? (
          <div className="max-w-md mx-auto bg-void-card/60 border border-zinc-800 rounded-2xl p-6 mt-10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-void-cyan" aria-hidden="true" /> Enter admin token
            </h2>
            <p className="text-[11px] text-zinc-400 mb-4">
              Paste your CMS admin token to manage posts. It is stored only in this browser.
            </p>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveToken()}
              placeholder="voidos_admin_…"
              aria-label="Admin token"
              className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-void-purple min-h-[44px]"
            />
            <button
              onClick={saveToken}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs min-h-[44px]"
            >
              Unlock CMS
            </button>
            {status && <p className="mt-3 text-xs text-red-400">{status.msg}</p>}
          </div>
        ) : (
          <>
            {status && (
              <div
                className={`mb-4 px-4 py-2.5 rounded-xl text-xs border ${
                  status.kind === "ok"
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    : status.kind === "err"
                    ? "bg-red-950/30 border-red-500/40 text-red-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300"
                }`}
              >
                {status.msg}
              </div>
            )}

            {/* Editor */}
            <div className="bg-void-card/60 border border-zinc-800 rounded-2xl p-5 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">{editingSlug ? "Edit post" : "New post"}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={startNew} className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" /> New
                  </button>
                  <button onClick={logoutToken} className="text-[11px] text-zinc-500 hover:text-red-400">Lock</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="md:col-span-2 block">
                  <span className="text-[10px] text-zinc-400 uppercase">Title</span>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white min-h-[40px]"
                    placeholder="Post title"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-zinc-400 uppercase">Emoji</span>
                  <input
                    value={draft.cover_emoji}
                    onChange={(e) => setDraft({ ...draft, cover_emoji: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white min-h-[40px]"
                    placeholder="📝"
                  />
                </label>
                <label className="md:col-span-2 block">
                  <span className="text-[10px] text-zinc-400 uppercase">Slug</span>
                  <input
                    value={draft.slug}
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    disabled={!!editingSlug}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white min-h-[40px] disabled:opacity-50"
                    placeholder="auto-generated from title if blank"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-zinc-400 uppercase">Tags (comma)</span>
                  <input
                    value={draft.tags}
                    onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white min-h-[40px]"
                    placeholder="productivity, self-hosting"
                  />
                </label>
                <label className="md:col-span-3 block">
                  <span className="text-[10px] text-zinc-400 uppercase">Excerpt</span>
                  <input
                    value={draft.excerpt}
                    onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white min-h-[40px]"
                    placeholder="One-line summary shown on the blog index"
                  />
                </label>
                <label className="md:col-span-3 block">
                  <span className="text-[10px] text-zinc-400 uppercase">SEO description</span>
                  <input
                    value={draft.seo_description}
                    onChange={(e) => setDraft({ ...draft, seo_description: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white min-h-[40px]"
                    placeholder="Meta description for search engines (~150 chars)"
                  />
                </label>
                <label className="md:col-span-3 block">
                  <span className="text-[10px] text-zinc-400 uppercase">Content (Markdown)</span>
                  <textarea
                    value={draft.content_md}
                    onChange={(e) => setDraft({ ...draft, content_md: e.target.value })}
                    rows={12}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white leading-relaxed"
                    placeholder={"# Heading\n\nWrite your post in **Markdown**. Supports headings, lists, `code`, links, bold and italics."}
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                    className="w-4 h-4 rounded bg-black border-zinc-700 text-void-purple"
                  />
                  Published (visible on the public blog)
                </label>
                <button
                  onClick={save}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs flex items-center gap-2 min-h-[44px] disabled:opacity-60"
                >
                  <Save className="w-4 h-4" aria-hidden="true" /> {loading ? "Saving…" : "Save post"}
                </button>
              </div>
            </div>

            {/* Post list */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white">Posts ({posts.length})</h2>
              <button onClick={refresh} className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> Refresh
              </button>
            </div>
            <div className="space-y-2">
              {posts.length === 0 && <p className="text-xs text-zinc-500">No posts yet. Create one above.</p>}
              {posts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-void-card/40 border border-zinc-800 rounded-xl px-4 py-3">
                  <span className="text-xl" aria-hidden="true">{p.cover_emoji || "📝"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{p.title}</div>
                    <div className="text-[10px] text-zinc-500 truncate">/{p.slug}</div>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      p.published ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {p.published ? "Live" : "Draft"}
                  </span>
                  <button onClick={() => togglePublish(p)} title={p.published ? "Unpublish" : "Publish"} aria-label={p.published ? "Unpublish" : "Publish"} className="p-1.5 text-zinc-400 hover:text-white">
                    {p.published ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                  </button>
                  <button onClick={() => startEdit(p)} className="text-[11px] text-void-cyan hover:underline">Edit</button>
                  <button onClick={() => remove(p)} title="Delete" aria-label="Delete post" className="p-1.5 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
