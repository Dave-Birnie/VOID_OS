"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2, Eye, EyeOff, FileText } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { savePost, deletePost, togglePublish } from "@/app/admin/blog/actions";

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

export function BlogAdmin({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

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
    if (!draft.title) {
      setStatus({ kind: "err", msg: "Title is required." });
      return;
    }
    setBusy(true);
    setStatus(null);
    const fd = new FormData();
    if (editingSlug) fd.set("original_slug", editingSlug);
    fd.set("slug", draft.slug);
    fd.set("title", draft.title);
    fd.set("excerpt", draft.excerpt);
    fd.set("cover_emoji", draft.cover_emoji);
    fd.set("tags", draft.tags);
    fd.set("seo_description", draft.seo_description);
    fd.set("content_md", draft.content_md);
    fd.set("published", String(draft.published));

    const res = await savePost(fd);
    setBusy(false);
    if (res.ok) {
      setStatus({ kind: "ok", msg: `Saved “${draft.title}”.` });
      startNew();
      router.refresh();
    } else {
      setStatus({ kind: "err", msg: res.error ?? "Could not save." });
    }
  };

  const toggle = async (p: BlogPost) => {
    const fd = new FormData();
    fd.set("slug", p.slug);
    fd.set("published", String(!p.published));
    await togglePublish(fd);
    router.refresh();
  };

  const remove = async (p: BlogPost) => {
    if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    const fd = new FormData();
    fd.set("slug", p.slug);
    const res = await deletePost(fd);
    if (res.ok) {
      if (editingSlug === p.slug) startNew();
      router.refresh();
    } else {
      setStatus({ kind: "err", msg: res.error ?? "Could not delete." });
    }
  };

  return (
    <div className="min-h-screen bg-void-black text-slate-100 font-mono">
      <main id="main-content" className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-void-purple hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-void-purple" /> Blog CMS
          </h1>
        </div>

        {status && (
          <div
            className={`mb-4 px-4 py-2.5 rounded-xl text-xs border ${
              status.kind === "ok"
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/30 border-red-500/40 text-red-300"
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* Editor */}
        <div className="bg-void-card/60 border border-zinc-800 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">{editingSlug ? "Edit post" : "New post"}</h2>
            <button onClick={startNew} className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
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
                className="mt-1 w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white min-h-[40px]"
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
                placeholder={"# Heading\n\nWrite your post in **Markdown**."}
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
              disabled={busy}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-void-purple to-void-blue text-white font-bold text-xs flex items-center gap-2 min-h-[44px] disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {busy ? "Saving…" : "Save post"}
            </button>
          </div>
        </div>

        {/* Post list */}
        <h2 className="text-sm font-bold text-white mb-3">Posts ({posts.length})</h2>
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
              <button onClick={() => toggle(p)} title={p.published ? "Unpublish" : "Publish"} aria-label={p.published ? "Unpublish" : "Publish"} className="p-1.5 text-zinc-400 hover:text-white">
                {p.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(p)} className="text-[11px] text-void-cyan hover:underline">Edit</button>
              <button onClick={() => remove(p)} title="Delete" aria-label="Delete post" className="p-1.5 text-zinc-400 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
