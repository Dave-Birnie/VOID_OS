-- VOID OS — real auth + admin backend (mirrors the 3amCEO pattern).
-- Safe to run on top of src/lib/db/schema.sql: it only adds the auth plumbing
-- (admin helper, signup trigger, privilege-escalation guard, admin RLS).
-- Run in the Supabase SQL Editor or via `supabase db push`.

-- ── keep updated_at fresh ───────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── admin check (source of truth for authorization) ─────────────────
-- SECURITY DEFINER so it can read profiles under RLS without recursing into
-- the policies that call it.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── auto-create a profile row on signup ─────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── profiles policies ───────────────────────────────────────────────
drop policy if exists "profiles: read own or admin reads all" on public.profiles;
create policy "profiles: read own or admin reads all"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- Users may edit their own profile, but never escalate their own role.
drop policy if exists "profiles: update own (no role change)" on public.profiles;
create policy "profiles: update own (no role change)"
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- ── admin-only writes on backend content ────────────────────────────
-- Devlogs: public reads, admin writes.
drop policy if exists "Public devlogs are readable by all" on public.devlogs;
create policy "devlogs: public read" on public.devlogs
  for select using (true);
create policy "devlogs: admin insert" on public.devlogs
  for insert with check (public.is_admin());
create policy "devlogs: admin update" on public.devlogs
  for update using (public.is_admin());
create policy "devlogs: admin delete" on public.devlogs
  for delete using (public.is_admin());

-- Shoutouts: authenticated users read, admin writes.
drop policy if exists "Shoutouts readable by authenticated users" on public.shoutouts;
create policy "shoutouts: authenticated read" on public.shoutouts
  for select using (auth.role() = 'authenticated');
create policy "shoutouts: admin insert" on public.shoutouts
  for insert with check (public.is_admin());
create policy "shoutouts: admin delete" on public.shoutouts
  for delete using (public.is_admin());

-- Chat transcripts: admin-only (visitor logging happens via service role).
create policy "transcripts: admin read" on public.chat_transcripts
  for select using (public.is_admin());

-- ── seed the first admin ────────────────────────────────────────────
-- After this account signs up, promote it. Adjust the email as needed.
update public.profiles set role = 'admin'
  where email = 'david.cp.birnie@gmail.com';
