import { getUserAndProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/AdminDashboard";
import type { ChatTranscript, Shoutout } from "@/lib/supabase/client";

// Access is already guaranteed admin by the /admin layout gate. Here we load
// the real backend data and hand it to the interactive dashboard.
export default async function AdminPage() {
  const { profile } = await getUserAndProfile();
  const supabase = await createClient();

  const [{ data: transcripts }, { data: shoutouts }] = await Promise.all([
    supabase
      .from("chat_transcripts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("shoutouts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <AdminDashboard
      user={profile}
      transcripts={(transcripts as ChatTranscript[]) ?? []}
      shoutouts={(shoutouts as Shoutout[]) ?? []}
    />
  );
}
