-- VOID OS — public profiles: avatars, handles, bio/links, Founding Backer flag.
-- Adds the columns behind /u/[handle] and a safe SECURITY DEFINER reader so the
-- public page never exposes private profile data (AI keys live in app_settings).

-- ── profile columns ─────────────────────────────────────────────────
alter table public.profiles add column if not exists avatar_url  text;
alter table public.profiles add column if not exists handle       text;
alter table public.profiles add column if not exists tagline      text;
alter table public.profiles add column if not exists bio          text;
alter table public.profiles add column if not exists location     text;
alter table public.profiles add column if not exists website_url  text;
alter table public.profiles add column if not exists x_url        text;
alter table public.profiles add column if not exists github_url   text;
alter table public.profiles add column if not exists youtube_url  text;
alter table public.profiles add column if not exists is_founding_backer boolean not null default false;

-- Handles: lowercase, 3–20 chars, letters/numbers/underscore. Unique, case-insensitive.
alter table public.profiles drop constraint if exists profiles_handle_format;
alter table public.profiles add constraint profiles_handle_format
  check (handle is null or handle ~ '^[a-z0-9_]{3,20}$');
create unique index if not exists profiles_handle_unique
  on public.profiles (lower(handle)) where handle is not null;

-- Everyone who already holds a Dev Pass is a Founding Backer.
update public.profiles set is_founding_backer = true where has_dev_pass = true;

-- ── avatar storage bucket (public read, owner-only writes) ───────────
insert into storage.buckets (id, name, public)
values ('void-avatars', 'void-avatars', true)
on conflict (id) do nothing;

drop policy if exists "void-avatars public read" on storage.objects;
create policy "void-avatars public read" on storage.objects
  for select using (bucket_id = 'void-avatars');

drop policy if exists "void-avatars owner insert" on storage.objects;
create policy "void-avatars owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'void-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "void-avatars owner update" on storage.objects;
create policy "void-avatars owner update" on storage.objects
  for update to authenticated
  using (bucket_id = 'void-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "void-avatars owner delete" on storage.objects;
create policy "void-avatars owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'void-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ── safe public-profile reader ──────────────────────────────────────
-- Returns only display-safe fields for a handle, plus a couple of gamified
-- stats (apps active, an aggregate life score). Never returns app_settings,
-- email, or role internals.
create or replace function public.get_public_profile(p_handle text)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  prof public.profiles;
  ls jsonb;
  avg_score numeric := 0;
  apps int := 0;
begin
  select * into prof from public.profiles where lower(handle) = lower(p_handle) limit 1;
  if not found then return null; end if;

  ls := coalesce(prof.app_settings -> 'life_stats', '{}'::jsonb);
  select coalesce(avg(value::numeric), 0) into avg_score
    from jsonb_each_text(ls) where value ~ '^[0-9]+(\.[0-9]+)?$';

  begin
    select count(*) into apps from public.user_apps where user_id = prof.id and active = true;
  exception when undefined_table or undefined_column then apps := 0;
  end;

  return jsonb_build_object(
    'handle', prof.handle,
    'full_name', prof.full_name,
    'nickname', prof.nickname,
    'avatar_url', prof.avatar_url,
    'tagline', prof.tagline,
    'bio', prof.bio,
    'location', prof.location,
    'website_url', prof.website_url,
    'x_url', prof.x_url,
    'github_url', prof.github_url,
    'youtube_url', prof.youtube_url,
    'is_founding_backer', prof.is_founding_backer,
    'is_admin', prof.role = 'admin',
    'created_at', prof.created_at,
    'apps_active', apps,
    'life_score', round(avg_score)
  );
end; $$;

grant execute on function public.get_public_profile(text) to anon, authenticated;
