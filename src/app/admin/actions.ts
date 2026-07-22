"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ActionResult = { ok: boolean; error?: string };

// Broadcast a shoutout to every registered user. Admin-only; RLS enforces the
// same rule at the database layer as a second line of defence.
export async function sendShoutout(formData: FormData): Promise<ActionResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const title = ((formData.get("title") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();
  if (!title || !message) return { ok: false, error: "Title and message are required." };

  const supabase = await createClient();
  const { error } = await supabase.from("shoutouts").insert({
    title: title.slice(0, 200),
    message: message.slice(0, 4000),
    target_group: (formData.get("target_group") as string) || "all",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

// Publish a devlog entry to the Watch-the-Dev portal.
export async function publishDevlog(formData: FormData): Promise<ActionResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const title = ((formData.get("title") as string) ?? "").trim();
  const contentMd = ((formData.get("content_md") as string) ?? "").trim();
  if (!title || !contentMd) return { ok: false, error: "Title and content are required." };

  const slug = ((formData.get("slug") as string) ?? "").trim() || slugify(title);
  const youtubeUrl = ((formData.get("youtube_url") as string) ?? "").trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("devlogs").insert({
    title: title.slice(0, 200),
    slug,
    content_md: contentMd,
    youtube_url: youtubeUrl,
    is_locked: formData.get("is_locked") === "on",
    author_id: gate.userId,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/dev-journey");
  return { ok: true };
}
