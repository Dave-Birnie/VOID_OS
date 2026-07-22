import type { SupabaseClient } from "@supabase/supabase-js";

// Which apps the user has installed (active).
export async function getActiveAppIds(
  supabase: SupabaseClient,
  userId: string
): Promise<Set<string>> {
  const { data } = await supabase
    .from("user_apps")
    .select("app_id")
    .eq("user_id", userId)
    .eq("active", true);
  return new Set((data ?? []).map((r) => r.app_id as string));
}

// Which dashboard widgets the user has on their board (order preserved).
export async function getActiveWidgetIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("profiles")
    .select("app_settings")
    .eq("id", userId)
    .single();
  const settings = data?.app_settings as Record<string, unknown> | null;
  const widgets = settings?.widgets;
  return Array.isArray(widgets) ? (widgets as string[]) : [];
}
