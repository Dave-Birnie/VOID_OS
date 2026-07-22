-- VOID OS — member-area features
--   1. Private 1:1 chat threads (member <-> admin)
--   2. Blog CMS driven by the admin session (RLS), replacing the token/edge-fn flow
--   3. (Dev Journey gating is enforced in app code via profiles.has_dev_pass)
-- Safe to run on top of the existing schema + admin_auth migration.

-- ── 1. Private community-chat threads ───────────────────────────────
-- Each row belongs to one member's thread (thread_user_id). A member only
-- ever sees their own thread; the admin sees every thread and replies into it.
alter table public.community_messages
  add column if not exists thread_user_id uuid references public.profiles(id) on delete cascade;

-- Existing demo rows (if any) have no owner; drop them so RLS stays clean.
delete from public.community_messages where thread_user_id is null;
alter table public.community_messages alter column thread_user_id set not null;

create index if not exists community_messages_thread_idx
  on public.community_messages (thread_user_id, created_at);

-- Reset policies to the private-thread model.
drop policy if exists "Community messages readable by authenticated users" on public.community_messages;
drop policy if exists "Community messages insertable by authenticated users" on public.community_messages;
drop policy if exists "cm: read own thread or admin" on public.community_messages;
drop policy if exists "cm: member inserts into own thread" on public.community_messages;
drop policy if exists "cm: admin inserts into any thread" on public.community_messages;

create policy "cm: read own thread or admin" on public.community_messages
  for select using (thread_user_id = auth.uid() or public.is_admin());

-- A member may only post into their own thread as a non-admin message.
create policy "cm: member inserts into own thread" on public.community_messages
  for insert with check (
    thread_user_id = auth.uid() and user_id = auth.uid() and is_admin_reply = false
  );

-- The admin may post a reply into any member's thread.
create policy "cm: admin inserts into any thread" on public.community_messages
  for insert with check (public.is_admin() and is_admin_reply = true);

-- ── 2. Blog CMS via admin session ───────────────────────────────────
alter table public.blog_posts enable row level security;

drop policy if exists "blog: public reads published" on public.blog_posts;
drop policy if exists "blog: admin reads all" on public.blog_posts;
drop policy if exists "blog: admin insert" on public.blog_posts;
drop policy if exists "blog: admin update" on public.blog_posts;
drop policy if exists "blog: admin delete" on public.blog_posts;

create policy "blog: public reads published" on public.blog_posts
  for select using (published = true or public.is_admin());
create policy "blog: admin insert" on public.blog_posts
  for insert with check (public.is_admin());
create policy "blog: admin update" on public.blog_posts
  for update using (public.is_admin());
create policy "blog: admin delete" on public.blog_posts
  for delete using (public.is_admin());

-- keep updated_at fresh on edits
drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ── 3. Admin can manage members ─────────────────────────────────────
-- Lets an admin grant the Dev Pass (and set roles) on any profile. The
-- self-update escalation guard still blocks non-admins from promoting
-- themselves; this policy only opens writes to verified admins.
drop policy if exists "profiles: admin updates all" on public.profiles;
create policy "profiles: admin updates all" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());
