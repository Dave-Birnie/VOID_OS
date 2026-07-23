-- VOID OS — referral perks ("level up" unlocks).
-- Referring friends who sign up grants real, tangible perks at milestones,
-- building toward the ultimate unlock: Backstage (Dev Pass).
--   3 referrals  → early_access (first dibs on apps as they launch)
--   5 referrals  → Founding Backer status
--  10 referrals  → Dev Pass (Watch the Journey + Chat with Dev)
-- Grants are folded into evaluate_badges so they stay in sync everywhere it's
-- already called (profile save, app install, referral, dashboard load).

alter table public.profiles add column if not exists early_access boolean not null default false;

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

  -- ── tangible referral perks (idempotent: only ever turns flags on) ──
  update public.profiles set
    early_access       = early_access       or (ref_count >= 3),
    is_founding_backer = is_founding_backer  or (ref_count >= 5),
    has_dev_pass       = has_dev_pass        or (ref_count >= 10)
  where id = p_user;

  -- ── badges ──
  if prof.is_founding_backer or prof.has_dev_pass or ref_count >= 5 then
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
  if ref_count >= 3 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'ambassador') on conflict do nothing;
  end if;
  if ref_count >= 10 then
    insert into public.user_badges(user_id, badge_id) values (p_user, 'legend') on conflict do nothing;
  end if;
end; $$;
grant execute on function public.evaluate_badges(uuid) to authenticated;

-- Re-sync perks for everyone who already has referrals.
do $$
declare r record;
begin
  for r in select id from public.profiles loop
    perform public.evaluate_badges(r.id);
  end loop;
end $$;
