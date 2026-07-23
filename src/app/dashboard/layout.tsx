import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardGideon } from "@/components/DashboardGideon";
import { ThemeSync } from "@/components/ThemeSync";
import type { AppNotification } from "@/components/NotificationBell";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// Member dashboard shell. Any signed-in account gets in; the CMS toggle in the
// header only appears for admins.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login?next=/dashboard");

  const name = profile?.full_name || user.email || "Member";

  const supabase = await createClient();
  const [{ data: notifData }, { data: prefRow }] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, title, body, link, read, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("profiles").select("theme").eq("id", user.id).single(),
  ]);
  const notifications = (notifData as AppNotification[]) ?? [];
  const theme = (prefRow?.theme as string) || "dark";

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-void-purple selection:text-white">
      <ThemeSync theme={theme} />
      <DashboardHeader isAdmin={profile?.role === "admin"} name={name} notifications={notifications} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-6">{children}</main>
      <DashboardGideon />
    </div>
  );
}
