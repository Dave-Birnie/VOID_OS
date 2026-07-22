import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./config";

// Anonymous client for public reads that run on both the server and the
// client (e.g. the blog and sitemap). Falls back to a harmless placeholder so
// builds without env vars don't crash — callers already treat failures as
// "no data".
export const supabase = createSupabaseJsClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// Browser client used inside Client Components for the real auth session
// (sign in / sign up / sign out and reading the logged-in user). Cookie-based
// so it stays in sync with the server session refreshed by the middleware.
export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Accounts seeded as admin. The database `role` column is the source of truth;
// this allowlist is only used to bootstrap the first admin at sign-up.
export const ADMIN_EMAILS = ["david.cp.birnie@gmail.com"];

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  has_dev_pass: boolean;
  ai_subscription_active: boolean;
  monthly_token_limit: number;
  monthly_tokens_used: number;
  extra_token_credits: number;
}

export interface ChatTranscript {
  id: string;
  session_id: string;
  visitor_email?: string;
  messages: { sender: "user" | "gideon"; text: string; time: string }[];
  summary?: string;
  pinch_points?: string[];
  created_at: string;
}

export interface DevlogEntry {
  id: string;
  title: string;
  slug: string;
  content_md: string;
  youtube_url?: string;
  is_locked: boolean;
  created_at: string;
}

export interface CommunityMessage {
  id: string;
  user_name: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

export interface Shoutout {
  id: string;
  title: string;
  message: string;
  target_group: string;
  created_at: string;
}
