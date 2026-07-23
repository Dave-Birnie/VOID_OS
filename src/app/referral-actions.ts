"use server";

import { createClient } from "@/lib/supabase/server";

// Attribute the signed-in user to an invite code. Safe to call on every auth —
// the DB only sets referred_by once and awards badges to both sides.
export async function attachReferral(code: string): Promise<{ ok: boolean }> {
  const clean = (code ?? "").trim().slice(0, 16);
  if (!clean) return { ok: false };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const { data } = await supabase.rpc("attach_referral", { p_code: clean });
  return { ok: !!(data as { ok?: boolean } | null)?.ok };
}

// Re-run badge evaluation for the current user (called after profile edits,
// app installs, and on dashboard load to catch anything newly earned).
export async function evaluateMyBadges(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.rpc("evaluate_badges", { p_user: user.id });
}
