-- ============================================
-- SocialManager API — Recipe Icons Bucket
-- ============================================
-- Fixes recipe icons never loading in the desktop app:
--   `recipe-packages` is a PRIVATE bucket (by design — packages are only
--   fetched server-side via signed URL). Icons, however, need to be
--   rendered directly by the desktop app with a plain `<img src>`, so they
--   need to live in a PUBLIC bucket instead.
--
-- Run this in the Supabase SQL Editor after 0001_initial.sql.

insert into storage.buckets (id, name, public)
values ('recipe-icons', 'recipe-icons', true)
on conflict (id) do nothing;

-- Anyone can read icons (that's the point — the desktop app loads them
-- directly, unauthenticated, in an <img> tag).
drop policy if exists "Recipe icons are publicly readable" on storage.objects;
create policy "Recipe icons are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'recipe-icons');

-- Only the server (service_role) can upload/replace icons.
drop policy if exists "Only service role can upload recipe icons" on storage.objects;
create policy "Only service role can upload recipe icons"
  on storage.objects for insert
  to service_role
  with check (bucket_id = 'recipe-icons');

drop policy if exists "Only service role can update recipe icons" on storage.objects;
create policy "Only service role can update recipe icons"
  on storage.objects for update
  to service_role
  using (bucket_id = 'recipe-icons')
  with check (bucket_id = 'recipe-icons');

-- Only the server (service_role) can delete icons.
drop policy if exists "Only service role can delete recipe icons" on storage.objects;
create policy "Only service role can delete recipe icons"
  on storage.objects for delete
  to service_role
  using (bucket_id = 'recipe-icons');
