-- VOID OS — achievements/badges engine + referral system.
-- Badges are awarded server-side by evaluate_badges(); the catalog of ids lives
-- in src/lib/badges.ts. Referrals attribute a signup to an inviter's code.

-- ── badges ──────────────────────────────────────────────────────────
create table if not exists public.user_badges (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);
alter table public.user_badges enable row level security;
drop policy if exists "user_badges: public read" on public.user_badges;
create policy "user_badges: public read" on public.user_badges for select using (true);
-- No insert/update/delete policy: badges are written only by SECURITY DEFINER
-- functions below, never directly by clients.

-- ── referrals ───────────────────────────────────────────────────────
alter table public.profiles add column if not exists referral_code text;
alter table public.profiles add column if not exists referred_by uuid references public.profiles(id) on delete set null;
create unique index if not exists profiles_referral_code_unique
  on public.profiles (referral_code) where referral_code is not null;

-- Give every existing user a code.
update public.profiles
  set referral_code = upper(substr(md5(random()::text || id::text || clock_timestamp()::text), 1, 8))
  where referral_code is null;

-- New signups get a code (and still get their profile + full_name as before).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, referral_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    upper(substr(md5(random()::text || new.id::text || clock_timestamp()::text), 1, 8))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ── badge evaluation ────────────────────────────────────────────────
-- Idempotent: inserts any newly-earned badges for a user, skips ones already
-- held. Only ever awards badges the target genuinely earned.
create or replace function public.evaluate_badges(p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  prof public.profiles;
  app_count int := 0;
  ref_count int := 0;
  join_rank int := 0;
begin
  select * into prof from public.profiles where id = p_user;
  if not found then return; end if;

  begin
    select count(*) into app_count from public.user_apps where user_id = p_user and active = true;
  exception when others then app_count := 0; end;

  select count(*) into ref_count from public.profiles where referred_by = p_user;
  select count(*) into join_rank from public.profiles where created_at <= prof.created_at;

  if prof.is_founding_backer or prof.has_dev_pass then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'founding_backer') on conflict do nothing;
  end if;
  if join_rank <= 100 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'early_adopter') on conflict do nothing;
  end if;
  if prof.handle is not null then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'claimed_handle') on conflict do nothing;
  end if;
  if prof.avatar_url is not null and prof.handle is not null and prof.bio is not null then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'profile_complete') on conflict do nothing;
  end if;
  if app_count >= 1 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'first_app') on conflict do nothing;
  end if;
  if app_count >= 5 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'app_collector') on conflict do nothing;
  end if;
  if prof.referred_by is not null then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'welcomed') on conflict do nothing;
  end if;
  if ref_count >= 1 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'recruiter') on conflict do nothing;
  end if;
  if ref_count >= 5 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'ambassador') on conflict do nothing;
  end if;
  if ref_count >= 10 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'legend') on conflict do nothing;
  end if;
end; $$;
grant execute on function public.evaluate_badges(uuid) to authenticated;

-- ── attribute a referral ────────────────────────────────────────────
-- Sets the caller's referred_by from an invite code (once, if not already set)
-- and re-evaluates badges for both sides. Safe to call on every sign-in.
create or replace function public.attach_referral(p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  ref_id uuid;
begin
  if me is null then return jsonb_build_object('ok', false, 'error', 'unauthenticated'); end if;
  if p_code is null or length(trim(p_code)) = 0 then return jsonb_build_object('ok', false); end if;

  select id into ref_id from public.profiles where upper(referral_code) = upper(trim(p_code)) limit 1;
  if ref_id is null then return jsonb_build_object('ok', false, 'error', 'invalid'); end if;
  if ref_id = me then return jsonb_build_object('ok', false, 'error', 'self'); end if;

  update public.profiles set referred_by = ref_id where id = me and referred_by is null;

  perform public.evaluate_badges(me);
  perform public.evaluate_badges(ref_id);
  return jsonb_build_object('ok', true);
end; $$;
grant execute on function public.attach_referral(text) to authenticated;

-- ── public profile now carries badges + referral count ──────────────
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
    'life_score', round(avg_score),
    'referral_count', (select count(*) from public.profiles where referred_by = prof.id),
    'badges', coalesce(
      (select jsonb_agg(badge_id order by earned_at) from public.user_badges where user_id = prof.id),
      '[]'::jsonb)
  );
end; $$;
grant execute on function public.get_public_profile(text) to anon, authenticated;
