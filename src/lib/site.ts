// Central site configuration used for SEO metadata, structured data,
// sitemap, and robots. Set NEXT_PUBLIC_SITE_URL in the environment to the
// canonical production domain (e.g. https://voidos.io); the fallback points
// at the current live Hostinger domain so metadata resolves to a real URL.
export const siteConfig = {
  name: "VOID OS",
  shortName: "VOID OS",
  tagline: "The Gamified Life OS You Deploy & Own",
  description:
    "VOID OS is a gamified Life OS and habit-tracking platform with complete data sovereignty. Choose VOID Online — our fully-hosted, ready-to-use plans (from $10/mo) — or self-host the full source code with Supabase, Next.js, and bring-your-own-key AI.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://silver-crane-475254.hostingersite.com").replace(/\/$/, ""),
  ogImage: "/og-image.png",
  locale: "en_CA",
  keywords: [
    "VOID OS",
    "gamified life OS",
    "habit tracker",
    "self-hosted habit tracker",
    "productivity app",
    "ADHD productivity",
    "data sovereignty",
    "Supabase habit tracker",
    "Next.js SaaS",
    "life management software",
    "gamified productivity",
    "BYOK AI",
    "Daily Ops",
    "Battle Board",
    "3amCEO",
  ],
  creator: "3amCEO",
  twitter: "@3amCEO",
} as const;

export type SiteConfig = typeof siteConfig;
