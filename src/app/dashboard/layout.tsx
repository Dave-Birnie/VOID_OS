import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/auth";
import { DashboardHeader } from "@/components/DashboardHeader";

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

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-void-purple selection:text-white">
      <DashboardHeader isAdmin={profile?.role === "admin"} name={name} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">{children}</main>
    </div>
  );
}
