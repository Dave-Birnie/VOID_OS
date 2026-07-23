"use server";

import { revalidatePath } from "next/cache";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SettingsResult = { ok: boolean; error?: string };

export async function saveAppearance(formData: FormData): Promise<SettingsResult> {
  const { user } = await getUserAndProfile();
  if (!user) return { ok: false, error: "Not signed in." };

  const theme = formData.get("theme") as string;
  const fontSize = formData.get("font_size") as string;
  const patch: Record<string, unknown> = {};
  if (["dark", "light", "void"].includes(theme)) patch.theme = theme;
  if (["s", "m", "l"].includes(fontSize)) patch.font_size = fontSize;
  if (Object.keys(patch).length === 0) return { ok: true };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

// Toggle daily encouragement (verses / quotes) in the Today View.
export async function saveTodayPrefs(formData: FormData): Promise<SettingsResult> {
  const { user } = await getUserAndProfile();
  if (!user) return { ok: false, error: "Not signed in." };

  const verses = formData.get("verses") === "on";
  const quotes = formData.get("quotes") === "on";

  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("app_settings").eq("id", user.id).single();
  const settings = (data?.app_settings as Record<string, unknown>) ?? {};
  const { error } = await supabase
    .from("profiles")
    .update({ app_settings: { ...settings, today: { verses, quotes } } })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function saveAccount(formData: FormData): Promise<SettingsResult> {
  const { user } = await getUserAndProfile();
  if (!user) return { ok: false, error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: ((formData.get("full_name") as string) ?? "").trim().slice(0, 80) || null,
      nickname: ((formData.get("nickname") as string) ?? "").trim().slice(0, 40) || null,
      timezone: ((formData.get("timezone") as string) ?? "").trim().slice(0, 60) || null,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

// Save the public-profile fields (avatar picture, handle, bio, links). The
// handle is validated and its uniqueness surfaced as a friendly error.
export async function saveProfile(formData: FormData): Promise<SettingsResult> {
  const { user } = await getUserAndProfile();
  if (!user) return { ok: false, error: "Not signed in." };

  const str = (k: string, max: number) => ((formData.get(k) as string) ?? "").trim().slice(0, max) || null;

  const rawHandle = ((formData.get("handle") as string) ?? "").trim().toLowerCase();
  let handle: string | null = null;
  if (rawHandle) {
    if (!/^[a-z0-9_]{3,20}$/.test(rawHandle)) {
      return { ok: false, error: "Handle must be 3–20 characters: lowercase letters, numbers, or underscores." };
    }
    handle = rawHandle;
  }

  const url = (k: string): string | null => {
    const v = str(k, 200);
    if (!v) return null;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  };

  const patch: Record<string, unknown> = {
    handle,
    tagline: str("tagline", 80),
    bio: str("bio", 400),
    location: str("location", 60),
    website_url: url("website_url"),
    x_url: url("x_url"),
    github_url: url("github_url"),
    youtube_url: url("youtube_url"),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
  if (error) {
    if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
      return { ok: false, error: "That handle is already taken — try another." };
    }
    return { ok: false, error: error.message };
  }
  // Completing your profile / claiming a handle can earn badges.
  await supabase.rpc("evaluate_badges", { p_user: user.id });
  revalidatePath("/dashboard");
  if (handle) revalidatePath(`/u/${handle}`);
  return { ok: true };
}

// Persist the uploaded avatar's public URL. The file itself is uploaded from
// the browser straight to Storage (owner-only bucket path); we just record it.
export async function saveAvatar(url: string): Promise<SettingsResult> {
  const { user } = await getUserAndProfile();
  if (!user) return { ok: false, error: "Not signed in." };
  const clean = (url ?? "").trim().slice(0, 400);
  if (clean && !/^https?:\/\//i.test(clean)) return { ok: false, error: "Invalid image URL." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ avatar_url: clean || null }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

// Save the user's BYOK AI provider settings. The key is left unchanged if the
// field is blank, so it isn't wiped when only the provider/model changes.
// (TODO: encrypt the key at rest — see Master Plan; MVP stores it in app_settings.)
export async function saveAiProvider(formData: FormData): Promise<SettingsResult> {
  const { user } = await getUserAndProfile();
  if (!user) return { ok: false, error: "Not signed in." };

  const provider = ((formData.get("provider") as string) ?? "").trim();
  const model = ((formData.get("model") as string) ?? "").trim().slice(0, 60);
  const key = ((formData.get("api_key") as string) ?? "").trim();

  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("app_settings").eq("id", user.id).single();
  const settings = (data?.app_settings as Record<string, unknown>) ?? {};
  const ai = { ...((settings.ai as Record<string, unknown>) ?? {}) };
  if (["openai", "gemini", "anthropic", "openrouter"].includes(provider)) ai.provider = provider;
  ai.model = model;
  if (key) ai.key = key;

  const { error } = await supabase.from("profiles").update({ app_settings: { ...settings, ai } }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
