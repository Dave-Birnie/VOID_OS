import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Journey — Watch-the-Dev Portal",
  description:
    "Follow the VOID OS build in real time. The Watch-the-Dev Builder Pass unlocks weekly unlisted YouTube devlogs, written engineering deep dives, and direct community chat.",
  alternates: { canonical: "/dev-journey" },
  openGraph: {
    title: "VOID OS Dev Journey — Watch-the-Dev Portal",
    description:
      "Weekly unlisted devlogs, engineering deep dives, and community access. Watch VOID OS get built in real time.",
    url: "/dev-journey",
    type: "website",
  },
};

export default function DevJourneyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
