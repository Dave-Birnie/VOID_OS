-- VOID OS — first-party, cookie-free site analytics (ported from 3amCEO).
-- Visitors are counted by a daily-rotating hash of IP + user agent computed
-- server-side in /api/track; nothing reversible to a person is stored.

alter table public.profiles add column if not exists last_active timestamptz;
alter table public.blog_posts add column if not exists views integer not null default 0;

create table if not exists public.void_page_views (
  id           bigint generated always as identity primary key,
  path         text not null,
  referrer     text,
  visitor_hash text not null,
  user_id      uuid references public.profiles(id) on delete set null,
  device       text,
  country      text,
  created_at   timestamptz not null default now()
);
create index if not exists void_page_views_created_idx on public.void_page_views (created_at);
create index if not exists void_page_views_path_idx on public.void_page_views (path);
create index if not exists void_page_views_visitor_idx on public.void_page_views (visitor_hash);

alter table public.void_page_views enable row level security;
drop policy if exists "page_views: anyone can insert" on public.void_page_views;
drop policy if exists "page_views: admin reads" on public.void_page_views;
create policy "page_views: anyone can insert" on public.void_page_views
  for insert to anon, authenticated with check (char_length(path) <= 200);
create policy "page_views: admin reads" on public.void_page_views
  for select using (public.is_admin());

-- ── Aggregates (admin-only, security definer) ───────────────────────
create or replace function public.analytics_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  select jsonb_build_object(
    'views_today',   (select count(*) from void_page_views where created_at >= date_trunc('day', now())),
    'views_7d',      (select count(*) from void_page_views where created_at >= now() - interval '7 days'),
    'views_30d',     (select count(*) from void_page_views where created_at >= now() - interval '30 days'),
    'views_total',   (select count(*) from void_page_views),
    'uniques_today', (select count(distinct visitor_hash) from void_page_views where created_at >= date_trunc('day', now())),
    'uniques_7d',    (select count(distinct visitor_hash) from void_page_views where created_at >= now() - interval '7 days'),
    'uniques_30d',   (select count(distinct visitor_hash) from void_page_views where created_at >= now() - interval '30 days'),
    'signups_total', (select count(*) from profiles),
    'signups_7d',    (select count(*) from profiles where created_at >= now() - interval '7 days'),
    'active_7d',     (select count(*) from profiles where last_active >= now() - interval '7 days'),
    'apps_active',   (select count(*) from user_apps where active),
    'messages_total',(select count(*) from community_messages),
    'messages_7d',   (select count(*) from community_messages where created_at >= now() - interval '7 days'),
    'posts_published',(select count(*) from blog_posts where published = true),
    'devlogs_total', (select count(*) from devlogs),
    'shoutouts_total',(select count(*) from shoutouts),
    'transcripts_total',(select count(*) from chat_transcripts)
  ) into result;
  return result;
end; $$;

create or replace function public.analytics_daily(days int default 30)
returns table (day date, views bigint, uniques bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  return query
  select d.day::date, count(pv.id) as views, count(distinct pv.visitor_hash) as uniques
  from generate_series(date_trunc('day', now()) - make_interval(days => days - 1), date_trunc('day', now()), interval '1 day') as d(day)
  left join void_page_views pv on pv.created_at >= d.day and pv.created_at < d.day + interval '1 day'
  group by d.day order by d.day;
end; $$;

create or replace function public.analytics_top_paths(days int default 30, lim int default 10, prefix text default null)
returns table (path text, views bigint, uniques bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  return query
  select pv.path, count(*) as views, count(distinct pv.visitor_hash) as uniques
  from void_page_views pv
  where pv.created_at >= now() - make_interval(days => days)
    and (prefix is null or pv.path like prefix || '%')
  group by pv.path order by views desc, pv.path limit lim;
end; $$;

create or replace function public.analytics_top_referrers(days int default 30, lim int default 10)
returns table (referrer text, views bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'admin only'; end if;
  return query
  select coalesce(nullif(pv.referrer, ''), '(direct)') as referrer, count(*) as views
  from void_page_views pv where pv.created_at >= now() - make_interval(days => days)
  group by 1 order by views desc limit lim;
end; $$;

-- Blog view counter that doesn't stamp updated_at.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  if coalesce(current_setting('app.skip_updated_at', true), '') = 'on' then return new; end if;
  new.updated_at = now();
  return new;
end; $$;

create or replace function public.bump_post_views(post_slug text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform set_config('app.skip_updated_at', 'on', true);
  update blog_posts set views = views + 1 where slug = post_slug and published = true;
end; $$;

revoke all on function public.bump_post_views(text) from public;
grant execute on function public.bump_post_views(text) to anon, authenticated;
grant execute on function public.analytics_summary() to authenticated;
grant execute on function public.analytics_daily(int) to authenticated;
grant execute on function public.analytics_top_paths(int, int, text) to authenticated;
grant execute on function public.analytics_top_referrers(int, int) to authenticated;
