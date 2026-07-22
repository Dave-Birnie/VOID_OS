import { supabase } from "@/lib/supabase/client";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_emoji: string | null;
  content_md: string;
  tags: string[] | null;
  seo_description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// All fetches are wrapped so a Supabase outage (or a build environment without
// Supabase env vars configured) degrades to an empty blog rather than crashing.
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as BlogPost[]) || [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (error) return null;
    return (data as BlogPost) || null;
  } catch {
    return null;
  }
}
