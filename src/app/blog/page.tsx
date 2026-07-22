import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — VOID OS Engineering & Productivity",
  description:
    "Deep dives on self-hosting, data sovereignty, gamified habit tracking, and building an ADHD-friendly Life OS. Written by the VOID OS developer.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "VOID OS Blog",
    description:
      "Engineering deep dives and productivity essays on the gamified, self-hostable Life OS.",
    url: "/blog",
    type: "website",
  },
};

// Rebuild the static blog roughly hourly so newly published posts appear.
export const revalidate = 3600;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "VOID OS Blog",
    url: `${siteConfig.url}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteConfig.url}/blog/${p.slug}`,
      datePublished: p.created_at,
      description: p.seo_description || p.excerpt || undefined,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-12 w-full">
        <div className="text-center mb-10 font-mono">
          <Link href="/" className="text-xs text-void-purple hover:text-white">← Back to VOID OS</Link>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4">The VOID OS Blog</h1>
          <p className="text-zinc-400 text-sm mt-3 max-w-2xl mx-auto">
            Engineering deep dives, data-sovereignty essays, and how to build a gamified, ADHD-friendly Life OS you actually own.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-zinc-500 font-mono text-sm border border-zinc-800 rounded-2xl py-16 bg-black/30">
            No posts published yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-zinc-800 bg-void-card/50 p-6 hover:border-purple-500/40 transition-all"
              >
                <div className="text-3xl mb-3" aria-hidden="true">{post.cover_emoji || "📝"}</div>
                <h2 className="text-lg font-bold text-white font-mono group-hover:text-void-purple transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{post.excerpt}</p>}
                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>{formatDate(post.created_at)}</span>
                  {post.tags && post.tags.length > 0 && (
                    <span className="flex gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">#{tag}</span>
                      ))}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
    </div>
  );
}
