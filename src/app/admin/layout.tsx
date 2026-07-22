import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin CMS",
  description: "VOID OS administration.",
  robots: { index: false, follow: false },
};

// Server-side gate for the entire admin backend. The middleware guarantees the
// visitor is signed in; here we enforce that their database role is `admin`.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login?next=/admin");
  if (profile?.role !== "admin") redirect("/");

  return <>{children}</>;
}
