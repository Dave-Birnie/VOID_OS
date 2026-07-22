"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AdminResult = { ok: boolean; error?: string };

// Admin replies into a specific member's private thread. RLS only lets an
// admin write admin-flagged messages, into any thread.
export async function sendAdminReply(formData: FormData): Promise<AdminResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const memberId = formData.get("member_id") as string;
  const message = ((formData.get("message") as string) ?? "").trim();
  if (!memberId || !message) return { ok: false, error: "Missing member or message." };

  const supabase = await createClient();
  const { data: me } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", gate.userId)
    .single();

  const { error } = await supabase.from("community_messages").insert({
    user_id: gate.userId,
    thread_user_id: memberId,
    user_name: (me?.full_name as string) || "Dave (Founder)",
    message: message.slice(0, 4000),
    is_admin_reply: true,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/inbox");
  return { ok: true };
}
