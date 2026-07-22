"use server";

import { revalidatePath } from "next/cache";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function markAllNotificationsRead(): Promise<{ ok: boolean }> {
  const { user } = await getUserAndProfile();
  if (!user) return { ok: false };
  const supabase = await createClient();
  await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  revalidatePath("/dashboard");
  return { ok: true };
}
