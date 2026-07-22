import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getPublishedPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" },
    { path: "/dev-journey", priority: 0.8, changeFrequency: "weekly" },
    { path: "/community-chat", priority: 0.6, changeFrequency: "daily" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Best-effort: include published blog posts. Never let a fetch failure break
  // the sitemap build.
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postEntries = posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    postEntries = [];
  }

  return [...staticEntries, ...postEntries];
}
