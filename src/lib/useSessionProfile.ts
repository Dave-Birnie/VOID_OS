"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase, type UserProfile } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PROFILE_COLUMNS =
  "id, email, full_name, role, has_dev_pass, ai_subscription_active, monthly_token_limit, monthly_tokens_used, extra_token_credits";

// Client-side hook for reading the logged-in user's profile in Client
// Components. Replaces the old localStorage demo state with the real Supabase
// session, and stays in sync via onAuthStateChange.
export function useSessionProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabase();
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", user.id)
        .single();
      if (!active) return;

      setProfile((data as UserProfile) ?? null);
      setLoading(false);
    }

    load();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { profile, loading };
}
