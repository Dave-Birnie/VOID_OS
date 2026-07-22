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
