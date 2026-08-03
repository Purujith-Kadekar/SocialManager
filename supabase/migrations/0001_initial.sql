-- ============================================
-- SocialManager API — Initial Schema Migration
-- ============================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It creates all tables, RLS policies, triggers, and the storage bucket.

-- ============================================
-- 1. profiles table (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policies: users can read their own profile, update their own profile
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- 2. recipes table
-- ============================================
create table if not exists public.recipes (
  id                text primary key,
  name              text not null,
  description       text,
  category          text not null default 'other',
  author            text,
  website           text,
  icon_url          text,
  is_featured       boolean not null default false,
  is_official       boolean not null default false,
  is_custom         boolean not null default false,
  is_approved       boolean not null default true,
  storage_path      text not null,
  file_size_bytes   bigint not null default 0,
  recipe_metadata   jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.recipes enable row level security;

-- Recipes are publicly readable (catalog is public)
create policy "Recipes are publicly readable"
  on public.recipes for select
  using (is_approved = true);

-- Only service_role (server) can insert/update/delete recipes
-- (RLS does not block service_role, so no explicit policy needed for writes)

-- ============================================
-- 3. user_services table
-- ============================================
create table if not exists public.user_services (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  recipe_id   text not null references public.recipes(id) on delete cascade,
  service_name text not null,
  settings    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_user_services_user_id on public.user_services(user_id);

alter table public.user_services enable row level security;

create policy "Users can read their own services"
  on public.user_services for select
  using (auth.uid() = user_id);

create policy "Users can insert their own services"
  on public.user_services for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own services"
  on public.user_services for update
  using (auth.uid() = user_id);

create policy "Users can delete their own services"
  on public.user_services for delete
  using (auth.uid() = user_id);

-- ============================================
-- 4. Triggers
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.update_updated_at();

drop trigger if exists set_updated_at_recipes on public.recipes;
create trigger set_updated_at_recipes
  before update on public.recipes
  for each row execute function public.update_updated_at();

drop trigger if exists set_updated_at_user_services on public.user_services;
create trigger set_updated_at_user_services
  before update on public.user_services
  for each row execute function public.update_updated_at();

-- ============================================
-- 5. Helper functions
-- ============================================
create or replace function public.promote_admin(email text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set is_admin = true
  where profiles.email = promote_admin.email;
end;
$$;

-- ============================================
-- 6. Storage bucket
-- ============================================
insert into storage.buckets (id, name, public)
values ('recipe-packages', 'recipe-packages', false)
on conflict (id) do nothing;

-- Storage policies: only service_role can read/write the bucket.
-- (anon/authenticated users get download URLs via createSignedUrl, not direct access.)
drop policy if exists "Only service role can upload recipe packages" on storage.objects;
create policy "Only service role can upload recipe packages"
  on storage.objects for insert
  to service_role
  using (bucket_id = 'recipe-packages');

drop policy if exists "Only service role can read recipe packages" on storage.objects;
create policy "Only service role can read recipe packages"
  on storage.objects for select
  to service_role
  using (bucket_id = 'recipe-packages');

drop policy if exists "Only service role can delete recipe packages" on storage.objects;
create policy "Only service role can delete recipe packages"
  on storage.objects for delete
  to service_role
  using (bucket_id = 'recipe-packages');

-- ============================================
-- DONE!
-- ============================================
-- Next steps:
-- 1. Create a user account at /signup
-- 2. Your email is admin if it's in SUPABASE_ADMIN_EMAILS env var
-- 3. Run the recipe sync script: npm run sync-recipes
