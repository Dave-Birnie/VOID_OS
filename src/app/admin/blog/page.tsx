import { createClient } from "@/lib/supabase/server";
import { BlogAdmin } from "@/components/BlogAdmin";
import type { BlogPost } from "@/lib/blog";

export const metadata = { title: "Blog CMS" };

// Access is gated to admins by the /admin layout. Admin RLS returns drafts too,
// so the CMS can list and edit unpublished posts.
export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  const posts = (data as BlogPost[]) ?? [];

  return <BlogAdmin posts={posts} />;
}
