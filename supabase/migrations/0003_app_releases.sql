-- ============================================
-- SocialManager API — App Releases Bucket
-- ============================================
-- Public bucket for the downloadable desktop app installer (.exe).
-- Public like recipe-icons (needs to be directly downloadable by anyone
-- visiting the download page), unlike recipe-packages which stays
-- private/signed since that's fetched programmatically by the app itself.

insert into storage.buckets (id, name, public, file_size_limit)
values ('app-releases', 'app-releases', true, 314572800) -- 300MB ceiling, plenty of headroom
on conflict (id) do nothing;

drop policy if exists "App releases are publicly readable" on storage.objects;
create policy "App releases are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'app-releases');

drop policy if exists "Only service role can upload app releases" on storage.objects;
create policy "Only service role can upload app releases"
  on storage.objects for insert
  to service_role
  with check (bucket_id = 'app-releases');

drop policy if exists "Only service role can update app releases" on storage.objects;
create policy "Only service role can update app releases"
  on storage.objects for update
  to service_role
  using (bucket_id = 'app-releases')
  with check (bucket_id = 'app-releases');

drop policy if exists "Only service role can delete app releases" on storage.objects;
create policy "Only service role can delete app releases"
  on storage.objects for delete
  to service_role
  using (bucket_id = 'app-releases');

-- Tracks release metadata so the download page and API can show version
-- info without hardcoding it in the frontend every release.
create table if not exists public.app_releases (
  id uuid primary key default gen_random_uuid(),
  platform text not null default 'windows',
  version text not null,
  storage_path text not null,
  file_size_bytes bigint,
  release_notes text,
  is_latest boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.app_releases enable row level security;

drop policy if exists "App releases metadata is publicly readable" on public.app_releases;
create policy "App releases metadata is publicly readable"
  on public.app_releases for select
  to public
  using (true);

drop policy if exists "Only service role can manage app releases" on public.app_releases;
create policy "Only service role can manage app releases"
  on public.app_releases for all
  to service_role
  using (true)
  with check (true);
