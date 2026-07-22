"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, userId: user.id };
}

async function patchSettings(patch: Record<string, unknown>) {
  const { supabase, userId } = await requireUser();
  const { data } = await supabase.from("profiles").select("app_settings").eq("id", userId).single();
  const settings = (data?.app_settings as Record<string, unknown>) ?? {};
  await supabase.from("profiles").update({ app_settings: { ...settings, ...patch } }).eq("id", userId);
  revalidatePath("/dashboard");
}

// Persist the widget order after a drag/reorder in edit mode.
export async function saveWidgetOrder(order: string[]) {
  if (!Array.isArray(order)) return;
  await patchSettings({ widget_order: order.filter((x) => typeof x === "string").slice(0, 100) });
}

// Persist which widgets are hidden.
export async function saveHiddenWidgets(hidden: string[]) {
  if (!Array.isArray(hidden)) return;
  await patchSettings({ hidden_widgets: hidden.filter((x) => typeof x === "string").slice(0, 100) });
}
