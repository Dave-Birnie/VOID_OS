import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { SettingsClient, type SettingsInitial } from "./SettingsClient";
import type { ThemeId } from "@/lib/theme";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user } = await getUserAndProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, nickname, timezone, theme, font_size, app_settings")
    .eq("id", user!.id)
    .single();

  const p = (data ?? {}) as Record<string, unknown>;
  const ai = ((p.app_settings as Record<string, unknown>)?.ai as Record<string, unknown>) ?? {};

  const initial: SettingsInitial = {
    full_name: (p.full_name as string) ?? "",
    nickname: (p.nickname as string) ?? "",
    timezone: (p.timezone as string) ?? "",
    theme: (["dark", "light", "void"].includes(p.theme as string) ? p.theme : "dark") as ThemeId,
    font_size: (["s", "m", "l"].includes(p.font_size as string) ? p.font_size : "m") as "s" | "m" | "l",
    ai_provider: (ai.provider as string) ?? "openai",
    ai_model: (ai.model as string) ?? "",
    ai_has_key: !!ai.key,
  };

  return <SettingsClient initial={initial} />;
}
