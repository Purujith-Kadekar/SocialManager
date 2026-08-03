# Supabase Migration Guide

This guide walks you through setting up the Supabase database for the SocialManager API.

## Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Name**: `socialmanager` (or any name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the closest to your users
   - **Plan**: Free tier (includes 500MB Postgres + 5GB Storage)
4. Click **Create new project**
5. Wait ~2 minutes for provisioning to complete

## Step 2: Run the SQL migration

1. In your Supabase project dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/migrations/0001_initial.sql` from this project
4. Copy the **entire** file contents
5. Paste it into the SQL editor
6. Click **Run** (or press Ctrl+Enter)

You should see:
```
Success. No rows returned.
```

### What the migration creates

| Object | Purpose |
|--------|---------|
| `public.profiles` | User profiles (extends `auth.users`) |
| `public.recipes` | Recipe catalog (310 Ferdium recipes + custom uploads) |
| `public.user_services` | Per-user service configurations for cross-device sync |
| `public.storage_usage` | View showing total storage used |
| `storage.buckets: recipe-packages` | Private bucket for .tar.gz recipe files |
| RLS policies | Row-level security on all tables |
| `handle_new_user()` trigger | Auto-creates profile on signup |
| `update_updated_at()` trigger | Auto-updates `updated_at` column |
| `promote_admin(email)` function | Manually promote a user to admin |

## Step 3: Get your API keys

1. In Supabase, go to **Settings → API** (gear icon → API)
2. Copy these three values:

| Value | Where to use |
|-------|-------------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** key | `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose!) |

## Step 4: Configure Auth settings

### Email confirmation

1. Go to **Authentication → Providers → Email**
2. Toggle **Confirm email** ON (recommended) or OFF (for faster testing)
3. If ON, users must click a link in their email before they can sign in

### Redirect URLs (for OAuth + magic links)

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your app URL:
   - Local dev: `http://localhost:3000`
   - Production: `https://your-app.vercel.app`
3. Add these to **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback`
   - `https://your-app.vercel.app/api/auth/callback`

### Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google+ API**
4. Go to **Credentials → Create Credentials → OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
   (replace `your-project` with your actual Supabase project ref)
7. Copy the **Client ID** and **Client Secret**
8. Back in Supabase: **Authentication → Providers → Google**
   - Toggle ON
   - Paste Client ID and Client Secret
9. In your `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Step 5: Set environment variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin emails (comma-separated)
SUPABASE_ADMIN_EMAILS=your-email@example.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Storage bucket (already created by migration)
SUPABASE_STORAGE_BUCKET=recipe-packages

# Auth secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your-random-32-char-string
```

## Step 6: Verify the setup

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) — you should see the landing page

3. Go to `/signup` and create an account with your admin email

4. Check your email for the confirmation link (if email confirmation is ON)

5. Click the link — you'll be redirected to `/dashboard`

6. You should see the admin link in the header (because your email is in `SUPABASE_ADMIN_EMAILS`)

7. Go to `/admin` — you should see the storage tracker (0 bytes used)

## Step 7: Sync recipes

Run the sync script to import all 310 Ferdium recipes:

```bash
npm run sync-recipes
```

This will:
1. Fetch the recipe catalog from `api.ferdium.org`
2. Download each `.tar.gz` package
3. Upload to your Supabase Storage bucket
4. Insert metadata into the `recipes` table

Takes 5-10 minutes. You'll see progress like:
```
[1/310] ✅ whatsapp           15 KB  WhatsApp
[2/310] ✅ telegram           22 KB  Telegram
...
```

After completion, refresh `/admin` — you'll see 310 recipes and ~10MB used (out of 5GB).

## Step 8: Promote another user to admin (optional)

If you want to add more admins later, you have two options:

**Option A**: Add their email to `SUPABASE_ADMIN_EMAILS` env var (no restart needed, checked at runtime)

**Option B**: Use the SQL function:
```sql
SELECT promote_admin('friend@example.com');
```

## Troubleshooting

### "Missing NEXT_PUBLIC_SUPABASE_URL" error

Your `.env.local` is missing or incorrect. Re-check Step 5.

### "Email not confirmed" error

Either:
- Click the confirmation link in your email, OR
- Disable email confirmation in Supabase: **Authentication → Providers → Email → Confirm email → OFF**

### "Admin access required" error

Your email is not in `SUPABASE_ADMIN_EMAILS`. Add it and restart the dev server.

### Storage upload fails

Check that the `recipe-packages` bucket was created:
```sql
SELECT * FROM storage.buckets WHERE id = 'recipe-packages';
```

If not, re-run the migration SQL.

### sync-recipes fails with "fetch failed"

The Ferdium API might be down. Check:
```bash
curl https://api.ferdium.org/v1/recipes
```

If it returns JSON, the API is up. The issue might be rate limiting — wait a minute and re-run.

### Google OAuth redirect fails

Make sure the redirect URI in Google Cloud Console matches exactly:
```
https://your-project.supabase.co/auth/v1/callback
```

And that `NEXT_PUBLIC_APP_URL` in `.env.local` matches your actual app URL.

## Verifying RLS policies

To check that Row Level Security is working:

```sql
-- Should show RLS is enabled on all 3 tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'recipes', 'user_services');
```

All three should show `rowsecurity = true`.

## Database schema overview

```
auth.users (Supabase managed)
    │
    │ 1:1 (trigger: handle_new_user)
    ▼
public.profiles
    id (UUID, FK → auth.users.id)
    email
    full_name
    is_admin (boolean)
    │
    │ 1:N
    ▼
public.user_services
    id (UUID)
    user_id (FK → profiles.id)
    recipe_id (FK → recipes.id)
    service_name
    settings (JSONB)

public.recipes
    id (TEXT, e.g. 'whatsapp')
    name
    storage_path (e.g. 'whatsapp.tar.gz')
    file_size_bytes
    recipe_metadata (JSONB)
    is_official / is_custom / is_featured
```

## Backup

To backup your database:
```bash
# Export all recipes
pg_dump "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres" \
  --table=public.recipes \
  --data-only \
  > recipes_backup.sql
```

Or use Supabase's built-in backup: **Database → Backups**
