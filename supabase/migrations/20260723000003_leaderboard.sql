-- VOID OS — public community leaderboard.
-- Ranks members by referrals / badges / life level. Only members who have
-- claimed a public @handle and haven't opted out appear. Returns display-safe
-- fields only (same privacy stance as get_public_profile).

alter table public.profiles add column if not exists show_on_leaderboard boolean not null default true;

create or replace function public.leaderboard(p_sort text default 'referrals', p_limit int default 50)
returns table (
  rank bigint,
  handle text,
  full_name text,
  avatar_url text,
  is_founding_backer boolean,
  is_admin boolean,
  referral_count bigint,
  badge_count bigint,
  life_score numeric,
  apps_active bigint
) language plpgsql stable security definer set search_path = public as $$
begin
  return query
  with base as (
    select
      p.handle,
      p.full_name,
      p.avatar_url,
      p.is_founding_backer,
      (p.role = 'admin') as is_admin,
      (select count(*) from public.profiles r where r.referred_by = p.id) as referral_count,
      (select count(*) from public.user_badges b where b.user_id = p.id) as badge_count,
      coalesce((
        select avg(value::numeric)
        from jsonb_each_text(coalesce(p.app_settings -> 'life_stats', '{}'::jsonb))
        where value ~ '^[0-9]+(\.[0-9]+)?$'
      ), 0) as life_score,
      coalesce((select count(*) from public.user_apps ua where ua.user_id = p.id and ua.active), 0) as apps_active
    from public.profiles p
    where p.handle is not null and coalesce(p.show_on_leaderboard, true)
  )
  select
    row_number() over (
      order by
        case
          when p_sort = 'badges' then base.badge_count
          when p_sort = 'level'  then base.life_score
          else base.referral_count
        end desc,
        base.badge_count desc,
        base.referral_count desc,
        base.handle asc
    ) as rank,
    base.handle, base.full_name, base.avatar_url, base.is_founding_backer, base.is_admin,
    base.referral_count, base.badge_count, base.life_score, base.apps_active
  from base
  order by rank
  limit greatest(1, least(200, p_limit));
end; $$;

grant execute on function public.leaderboard(text, int) to anon, authenticated;
