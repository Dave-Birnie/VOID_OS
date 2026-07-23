import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { PageViewTracker } from "@/components/PageViewTracker";
import { RefCapture } from "@/components/RefCapture";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: siteConfig.twitter,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#08070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Structured data helps search engines understand the product and surface
// rich results. Kept server-rendered so crawlers see it without executing JS.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      brand: siteConfig.creator,
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Self-Hosted",
      description: siteConfig.description,
      offers: [
        {
          "@type": "Offer",
          name: "VOID Online Starter",
          price: "10.00",
          priceCurrency: "USD",
          description: "VOID Online, fully hosted — any 3 modular apps, monthly.",
        },
        {
          "@type": "Offer",
          name: "VOID Online Pro",
          price: "15.00",
          priceCurrency: "USD",
          description: "10 modular apps with priority cloud sync, monthly.",
        },
        {
          "@type": "Offer",
          name: "Developer Kickstarter Pack",
          price: "150.00",
          priceCurrency: "USD",
          description: "Self-host one app + Daily Ops with full source and BYOK AI.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is VOID OS?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "VOID OS is a gamified Life OS and habit-tracking platform. Use VOID Online — our fully-hosted plans from $10/month — or self-host the full source code with complete data sovereignty.",
          },
        },
        {
          "@type": "Question",
          name: "Can I self-host VOID OS?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Developer passes include full source code, Supabase database schemas, and self-hosting scripts, with bring-your-own-key AI integration (Claude, OpenAI, Gemini, or Grok).",
          },
        },
        {
          "@type": "Question",
          name: "Does VOID OS include AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The VOID Online AI Upgrade (+$10/month) uses server-side credits with dual credit banks. Self-hosted developer tiers are AI-integrated via bring-your-own-key — every app has AI built into its workflow and you supply your own API key.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <body className="text-slate-100 font-sans antialiased grid-bg selection:bg-void-purple selection:text-white">
        {/* Apply the saved theme before paint to avoid a flash of the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('void_os_theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`,
          }}
        />
        {/* Skip link for keyboard & screen-reader users (WCAG 2.4.1) */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Shared SVG gradient definition so every VOID OS logo renders its brand fill */}
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {children}

        {/* First-party, cookie-free page-view tracking */}
        <PageViewTracker />
        {/* Capture ?ref= invite codes until signup */}
        <RefCapture />

        <script
          type="application/ld+json"
          // Structured data payload is static and app-controlled.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
