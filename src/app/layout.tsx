import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOID OS | Value Oriented Infrastructure Design",
  description:
    "The turnkey Gamified Life OS & Value Oriented Infrastructure Design. Ditch subscription habit-trackers with complete data sovereignty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-void-black text-slate-100 font-sans antialiased grid-bg selection:bg-void-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}
