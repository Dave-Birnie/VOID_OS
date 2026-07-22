import type { SupabaseClient } from "@supabase/supabase-js";

export type AppSettings = {
  app_names?: Record<string, string>;
  widget_order?: string[];
  hidden_widgets?: string[];
  life_stats?: Record<string, number>;
  [key: string]: unknown;
};

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

// The user's whole app_settings blob (widget layout, custom names, etc.).
export async function getAppSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<AppSettings> {
  const { data } = await supabase
    .from("profiles")
    .select("app_settings")
    .eq("id", userId)
    .single();
  return ((data?.app_settings as AppSettings) ?? {}) as AppSettings;
}
