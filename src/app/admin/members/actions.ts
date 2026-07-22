"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AdminResult = { ok: boolean; error?: string };

// Grant or revoke a member's Dev Pass (used to unlock Dev Journey after a
// confirmed Kickstarter pledge).
export async function setDevPass(formData: FormData): Promise<AdminResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const userId = formData.get("user_id") as string;
  const value = formData.get("value") === "true";
  if (!userId) return { ok: false, error: "Missing user." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ has_dev_pass: value }).eq("id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/members");
  return { ok: true };
}

// Promote or demote a member's admin role. Guards against demoting yourself so
// you can't accidentally lock yourself out of the backend.
export async function setAdminRole(formData: FormData): Promise<AdminResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Not authorized." };

  const userId = formData.get("user_id") as string;
  const makeAdmin = formData.get("value") === "true";
  if (!userId) return { ok: false, error: "Missing user." };
  if (userId === gate.userId && !makeAdmin) {
    return { ok: false, error: "You can't remove your own admin access." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: makeAdmin ? "admin" : "user" })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/members");
  return { ok: true };
}
