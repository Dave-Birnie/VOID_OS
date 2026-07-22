import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Accounts that should be granted admin access on login. Matched
// case-insensitively. Add more emails here as needed.
export const ADMIN_EMAILS = ["david.cp.birnie@gmail.com"];

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  // Explicit allowlist, or any address containing "admin" (demo convenience).
  return ADMIN_EMAILS.includes(e) || e.includes("admin");
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

// Local Demo State Helper for immediate browser responsiveness
export const getLocalAuthState = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("void_os_user_profile");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const setLocalAuthState = (profile: UserProfile | null) => {
  if (typeof window === "undefined") return;
  if (profile) {
    localStorage.setItem("void_os_user_profile", JSON.stringify(profile));
  } else {
    localStorage.removeItem("void_os_user_profile");
  }
};
