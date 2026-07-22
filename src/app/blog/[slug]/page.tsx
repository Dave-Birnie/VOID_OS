import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  const description = post.seo_description || post.excerpt || undefined;
  return {
    title: post.title,
    description,
    keywords: post.tags || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: { card: "summary_large_image", title: post.title, description },
  };
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description || post.excerpt || undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: siteConfig.creator },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    keywords: (post.tags || []).join(", "),
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main id="main-content" className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-12 w-full">
        <Link href="/blog" className="text-xs font-mono text-void-purple hover:text-white">← All posts</Link>

        <article className="mt-6">
          <div className="text-4xl mb-4" aria-hidden="true">{post.cover_emoji || "📝"}</div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-mono leading-tight">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-500">
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            {post.tags && post.tags.length > 0 && (
              <span className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">#{tag}</span>
                ))}
              </span>
            )}
          </div>

          <div
            className="mt-8 text-sm md:text-base text-zinc-300"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content_md) }}
          />
        </article>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-void-purple to-void-blue text-white glow-purple"
          >
            Explore VOID OS →
          </Link>
        </div>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </div>
  );
}
