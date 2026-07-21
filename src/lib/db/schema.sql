-- VOID OS Database Schema (Supabase PostgreSQL)

-- 1. Profiles & Token Credit Banks
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  has_dev_pass BOOLEAN DEFAULT FALSE,
  ai_subscription_active BOOLEAN DEFAULT FALSE,
  monthly_token_limit INT DEFAULT 500000,
  monthly_tokens_used INT DEFAULT 0,
  extra_token_credits INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat Transcripts (Gideon Public Sales Bot)
CREATE TABLE IF NOT EXISTS public.chat_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_email TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  pinch_points TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Devlog Entries (Watch-the-Dev Portal)
CREATE TABLE IF NOT EXISTS public.devlogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_md TEXT NOT NULL,
  youtube_url TEXT,
  is_locked BOOLEAN DEFAULT TRUE,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Community Chat Messages
CREATE TABLE IF NOT EXISTS public.community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Shoutouts & Broadcast Announcements
CREATE TABLE IF NOT EXISTS public.shoutouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_group TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI Usage Logs
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tokens_consumed INT NOT NULL,
  bank_used TEXT CHECK (bank_used IN ('monthly_allowance', 'top_up_credits')),
  prompt_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoutouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Default RLS Policies
CREATE POLICY "Public devlogs are readable by all" ON public.devlogs FOR SELECT USING (true);
CREATE POLICY "Community messages readable by authenticated users" ON public.community_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Community messages insertable by authenticated users" ON public.community_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Shoutouts readable by authenticated users" ON public.shoutouts FOR SELECT USING (auth.role() = 'authenticated');
