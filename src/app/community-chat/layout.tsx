import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Chat",
  description:
    "Join the VOID OS community. Share ideas, ask questions, and talk directly with the developer about the gamified Life OS ecosystem.",
  alternates: { canonical: "/community-chat" },
  openGraph: {
    title: "VOID OS Community Chat",
    description:
      "Share ideas and talk directly with the developer about the VOID OS gamified Life OS ecosystem.",
    url: "/community-chat",
    type: "website",
  },
};

export default function CommunityChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
