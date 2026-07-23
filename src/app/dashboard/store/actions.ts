"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getApp } from "@/lib/appCatalog";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, userId: user.id };
}

export async function activateApp(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const appId = formData.get("app_id") as string;
  if (!getApp(appId)) return;

  await supabase.from("user_apps").upsert(
    { user_id: userId, app_id: appId, active: true, activated_at: new Date().toISOString() },
    { onConflict: "user_id,app_id" }
  );
  await supabase.rpc("evaluate_badges", { p_user: userId });
  revalidatePath("/dashboard/store");
  revalidatePath("/dashboard");
}

export async function deactivateApp(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const appId = formData.get("app_id") as string;
  if (!appId) return;

  await supabase.from("user_apps").update({ active: false }).eq("user_id", userId).eq("app_id", appId);
  revalidatePath("/dashboard/store");
  revalidatePath("/dashboard");
}

// Rename an app for this user. Empty name resets to the catalog default.
export async function renameApp(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const appId = formData.get("app_id") as string;
  const name = ((formData.get("name") as string) ?? "").trim().slice(0, 40);
  if (!appId || !getApp(appId)) return;

  const { data } = await supabase.from("profiles").select("app_settings").eq("id", userId).single();
  const settings = (data?.app_settings as Record<string, unknown>) ?? {};
  const names = { ...((settings.app_names as Record<string, string>) ?? {}) };
  if (name) names[appId] = name;
  else delete names[appId];

  await supabase.from("profiles").update({ app_settings: { ...settings, app_names: names } }).eq("id", userId);
  revalidatePath("/dashboard/store");
  revalidatePath("/dashboard");
}
