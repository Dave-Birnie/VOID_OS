-- VOID OS — site_content: admin-editable key/body docs (e.g. inspirations).
create table if not exists public.site_content (
  key        text primary key,
  body       text,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "site_content: public read" on public.site_content;
drop policy if exists "site_content: admin insert" on public.site_content;
drop policy if exists "site_content: admin update" on public.site_content;
drop policy if exists "site_content: admin delete" on public.site_content;

create policy "site_content: public read" on public.site_content
  for select using (true);
create policy "site_content: admin insert" on public.site_content
  for insert with check (public.is_admin());
create policy "site_content: admin update" on public.site_content
  for update using (public.is_admin());
create policy "site_content: admin delete" on public.site_content
  for delete using (public.is_admin());
