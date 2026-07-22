"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type BlogResult = { ok: boolean; error?: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateBlog(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

// Create or update a post. Edits are matched by original_slug so the slug
// itself can change. Admin-only; RLS enforces the same at the DB layer.
export async function savePost(formData: FormData): Promise<BlogResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const title = ((formData.get("title") as string) ?? "").trim();
  if (!title) return { ok: false, error: "Title is required." };

  const originalSlug = ((formData.get("original_slug") as string) ?? "").trim();
  const slug = ((formData.get("slug") as string) ?? "").trim() || slugify(title);
  const tags = ((formData.get("tags") as string) ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const row = {
    slug,
    title,
    excerpt: ((formData.get("excerpt") as string) ?? "").trim() || null,
    cover_emoji: ((formData.get("cover_emoji") as string) ?? "").trim() || "📝",
    tags,
    seo_description: ((formData.get("seo_description") as string) ?? "").trim() || null,
    content_md: (formData.get("content_md") as string) ?? "",
    published: formData.get("published") === "true",
  };

  const supabase = await createClient();
  const { error } = originalSlug
    ? await supabase.from("blog_posts").update(row).eq("slug", originalSlug)
    : await supabase.from("blog_posts").insert(row);
  if (error) return { ok: false, error: error.message };

  revalidateBlog(slug);
  return { ok: true };
}

export async function deletePost(formData: FormData): Promise<BlogResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const slug = formData.get("slug") as string;
  if (!slug) return { ok: false, error: "Missing slug." };

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("slug", slug);
  if (error) return { ok: false, error: error.message };

  revalidateBlog(slug);
  return { ok: true };
}

export async function togglePublish(formData: FormData): Promise<BlogResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const slug = formData.get("slug") as string;
  const published = formData.get("published") === "true";
  if (!slug) return { ok: false, error: "Missing slug." };

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").update({ published }).eq("slug", slug);
  if (error) return { ok: false, error: error.message };

  revalidateBlog(slug);
  return { ok: true };
}
