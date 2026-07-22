-- VOID OS — per-user notifications + admin broadcast fan-out.
-- Shoutouts fan out into every user's notification feed via a SECURITY DEFINER
-- function (so an admin can write rows for all users without a blanket
-- insert-any RLS policy).

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  body       text,
  link       text,
  kind       text not null default 'general',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notif: read own" on public.notifications;
drop policy if exists "notif: update own" on public.notifications;
drop policy if exists "notif: insert self or admin" on public.notifications;

create policy "notif: read own" on public.notifications
  for select using (user_id = auth.uid());
create policy "notif: update own" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notif: insert self or admin" on public.notifications
  for insert with check (user_id = auth.uid() or public.is_admin());

-- Fan a notification out to every user. Admin-only. Returns the count.
create or replace function public.broadcast_notification(p_title text, p_body text, p_link text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  insert into public.notifications (user_id, title, body, link, kind)
  select id, p_title, p_body, p_link, 'broadcast' from public.profiles;
  get diagnostics n = row_count;
  return n;
end;
$$;

grant execute on function public.broadcast_notification(text, text, text) to authenticated;
