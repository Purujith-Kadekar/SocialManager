-- ============================================
-- SocialManager API - Initial Schema Migration
-- ============================================
-- Run this in the Supabase SQL Editor:
--   1. Go to https://app.supabase.com/project/<your-project>/sql/new
--   2. Paste this entire file
--   3. Click "Run"
--
-- This creates: profiles, recipes, user_services tables + RLS policies + storage bucket

-- ============================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. RECIPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.recipes (
  id                  TEXT PRIMARY KEY,           -- e.g. 'whatsapp', 'telegram'
  name                TEXT NOT NULL,               -- Display name
  description         TEXT,                        -- Short description
  category            TEXT NOT NULL DEFAULT 'other', -- messaging | social | email | productivity | etc.
  author              TEXT,                        -- Original author
  website             TEXT,                        -- Service website URL
  icon_url            TEXT,                        -- Icon URL (SVG/PNG)
  is_featured         BOOLEAN NOT NULL DEFAULT FALSE, -- Shows on /popular endpoint
  is_official         BOOLEAN NOT NULL DEFAULT FALSE, -- Mirrored from Ferdium
  is_custom           BOOLEAN NOT NULL DEFAULT FALSE, -- User-uploaded
  is_approved         BOOLEAN NOT NULL DEFAULT TRUE,  -- Approved by admin
  storage_path        TEXT,                        -- Path in Supabase Storage bucket
  file_size_bytes     BIGINT NOT NULL DEFAULT 0,
  recipe_metadata     JSONB NOT NULL DEFAULT '{}'::jsonb, -- All Ferdium recipe fields
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_is_featured ON public.recipes(is_featured);
CREATE INDEX IF NOT EXISTS idx_recipes_name_lower ON public.recipes(LOWER(name));

-- ============================================
-- 3. USER SERVICES TABLE (cross-device sync)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id       TEXT NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  service_name    TEXT NOT NULL,                  -- User's custom name for this service
  custom_icon_url TEXT,                            -- User-uploaded icon
  settings        JSONB NOT NULL DEFAULT '{}'::jsonb, -- Per-service settings
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_user_services_user ON public.user_services(user_id);

-- ============================================
-- 4. UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recipes_updated_at ON public.recipes;
CREATE TRIGGER recipes_updated_at BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS user_services_updated_at ON public.user_services;
CREATE TRIGGER user_services_updated_at BEFORE UPDATE ON public.user_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 5. STORAGE BUCKET
-- ============================================
-- Create a bucket for recipe .tar.gz packages
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-packages', 'recipe-packages', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_services ENABLE ROW LEVEL SECURITY;

-- --- Profiles policies ---
-- Users can read their own profile, admins can read all
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

-- Users can update their own profile (but not is_admin)
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- --- Recipes policies ---
-- Anyone can read approved recipes (public API)
CREATE POLICY "recipes_select_public" ON public.recipes
  FOR SELECT USING (is_approved = TRUE);

-- Only admins can insert/update/delete recipes
CREATE POLICY "recipes_insert_admin" ON public.recipes
  FOR INSERT WITH CHECK (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

CREATE POLICY "recipes_update_admin" ON public.recipes
  FOR UPDATE USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

CREATE POLICY "recipes_delete_admin" ON public.recipes
  FOR DELETE USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

-- --- User services policies ---
-- Users can only access their own services
CREATE POLICY "user_services_select_own" ON public.user_services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_services_insert_own" ON public.user_services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_services_update_own" ON public.user_services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_services_delete_own" ON public.user_services
  FOR DELETE USING (auth.uid() = user_id);

-- --- Storage policies ---
-- Anyone can read recipe packages (needed for public download endpoint via service role)
-- We use service role key for downloads, so this policy is for anon access if needed
CREATE POLICY "storage_recipe_packages_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-packages');

-- Only admins can write to recipe packages bucket
CREATE POLICY "storage_recipe_packages_write_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipe-packages' AND
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

CREATE POLICY "storage_recipe_packages_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipe-packages' AND
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

CREATE POLICY "storage_recipe_packages_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipe-packages' AND
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

-- ============================================
-- 7. ADMIN PROMOTION FUNCTION
-- ============================================
-- Call this to promote a user to admin (run manually after first signup)
-- Usage: SELECT promote_admin('your-email@example.com');
CREATE OR REPLACE FUNCTION public.promote_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles SET is_admin = TRUE WHERE email = user_email;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found. Make sure they have signed up first.', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. STORAGE USAGE VIEW (for admin dashboard)
-- ============================================
-- View to calculate total storage used by recipe packages
CREATE OR REPLACE VIEW public.storage_usage AS
SELECT
  COUNT(*) AS file_count,
  COALESCE(SUM(file_size_bytes), 0) AS total_bytes,
  COALESCE(SUM(file_size_bytes) / 1073741824.0, 0) AS total_gb,
  COUNT(*) FILTER (WHERE is_custom = TRUE) AS custom_count,
  COUNT(*) FILTER (WHERE is_official = TRUE) AS official_count
FROM public.recipes
WHERE storage_path IS NOT NULL;

-- ============================================
-- DONE! 
-- ============================================
-- Next steps:
-- 1. Create a user account at /signup
-- 2. Promote yourself to admin: SELECT promote_admin('your-email@example.com');
-- 3. Run the recipe sync script: npm run sync-recipes
