"use server";

import { revalidatePath } from "next/cache";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ChatResult = { ok: boolean; error?: string };

// A member posts into their own private thread with Dave. RLS enforces that a
// non-admin can only ever write to their own thread.
export async function sendMemberMessage(formData: FormData): Promise<ChatResult> {
  const { user, profile } = await getUserAndProfile();
  if (!user) return { ok: false, error: "You must be signed in." };

  const message = ((formData.get("message") as string) ?? "").trim();
  if (!message) return { ok: false, error: "Message is empty." };

  const supabase = await createClient();
  const { error } = await supabase.from("community_messages").insert({
    user_id: user.id,
    thread_user_id: user.id,
    user_name: profile?.full_name || user.email || "Member",
    message: message.slice(0, 4000),
    is_admin_reply: false,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/community-chat");
  return { ok: true };
}
