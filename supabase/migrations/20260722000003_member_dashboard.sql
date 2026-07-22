-- VOID OS — member dashboard foundation (Phase 1)
--   * profiles gains dashboard/settings columns
--   * user_apps: per-user installed apps (drives the store + dashboard)
-- Safe to run on top of the existing schema.

alter table public.profiles
  add column if not exists app_settings jsonb not null default '{}'::jsonb,
  add column if not exists nickname text,
  add column if not exists timezone text,
  add column if not exists theme text not null default 'dark',
  add column if not exists font_size text not null default 'm',
  add column if not exists density text not null default 'comfortable';

-- Per-user app activation. app_id matches the code-side APP_CATALOG.
create table if not exists public.user_apps (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  app_id       text not null,
  active       boolean not null default true,
  pinned       boolean not null default false,
  activated_at timestamptz default now(),
  primary key (user_id, app_id)
);

alter table public.user_apps enable row level security;

drop policy if exists "user_apps: owner only" on public.user_apps;
create policy "user_apps: owner only" on public.user_apps
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
