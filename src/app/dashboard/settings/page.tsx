import { createClient } from "@/lib/supabase/server";
import { getUserAndProfile } from "@/lib/auth";
import { SettingsClient, type SettingsInitial } from "./SettingsClient";
import type { ProfileInitial } from "@/components/ProfileEditor";
import type { ThemeId } from "@/lib/theme";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user } = await getUserAndProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "full_name, nickname, timezone, theme, font_size, app_settings, avatar_url, handle, tagline, bio, location, website_url, x_url, github_url, youtube_url, is_founding_backer, show_on_leaderboard"
    )
    .eq("id", user!.id)
    .single();

  const p = (data ?? {}) as Record<string, unknown>;
  const appSettings = (p.app_settings as Record<string, unknown>) ?? {};
  const ai = (appSettings.ai as Record<string, unknown>) ?? {};
  const todayPref = (appSettings.today as { verses?: boolean; quotes?: boolean }) ?? {};

  const initial: SettingsInitial = {
    full_name: (p.full_name as string) ?? "",
    nickname: (p.nickname as string) ?? "",
    timezone: (p.timezone as string) ?? "",
    theme: (["dark", "light", "void"].includes(p.theme as string) ? p.theme : "dark") as ThemeId,
    font_size: (["s", "m", "l"].includes(p.font_size as string) ? p.font_size : "m") as "s" | "m" | "l",
    show_verses: todayPref.verses !== false,
    show_quotes: todayPref.quotes !== false,
    ai_provider: (ai.provider as string) ?? "openai",
    ai_model: (ai.model as string) ?? "",
    ai_has_key: !!ai.key,
  };

  const profile: ProfileInitial = {
    avatar_url: (p.avatar_url as string) ?? null,
    full_name: (p.full_name as string) ?? "",
    handle: (p.handle as string) ?? "",
    tagline: (p.tagline as string) ?? "",
    bio: (p.bio as string) ?? "",
    location: (p.location as string) ?? "",
    website_url: (p.website_url as string) ?? "",
    x_url: (p.x_url as string) ?? "",
    github_url: (p.github_url as string) ?? "",
    youtube_url: (p.youtube_url as string) ?? "",
    is_founding_backer: !!p.is_founding_backer,
    show_on_leaderboard: p.show_on_leaderboard !== false,
  };

  return <SettingsClient initial={initial} profile={profile} userId={user!.id} />;
}
