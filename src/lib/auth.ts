import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/supabase/client";

// Server-side source of truth for the current user and their profile row.
// The `role` column here — not any email allowlist — decides admin access.
export async function getUserAndProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, role, has_dev_pass, ai_subscription_active, monthly_token_limit, monthly_tokens_used, extra_token_credits, avatar_url, handle, is_founding_backer, early_access"
    )
    .eq("id", user.id)
    .single();

  return { user, profile: (profile as UserProfile) ?? null };
}

// Guard for Server Actions and admin-only reads: resolves the caller and
// bounces anyone who isn't a signed-in admin. Returns the Supabase client and
// user id so the action can proceed without re-fetching.
export async function requireAdmin() {
  const { user, profile } = await getUserAndProfile();
  if (!user) return { ok: false as const, reason: "unauthenticated" as const };
  if (profile?.role !== "admin")
    return { ok: false as const, reason: "forbidden" as const };
  return { ok: true as const, userId: user.id };
}
