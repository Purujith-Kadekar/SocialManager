# SocialManager API

A self-hosted recipe API for the SocialManager desktop app (Ferdium fork). Built with Next.js 16, Supabase, and Tailwind CSS 4.

## What this provides

- **Recipe catalog API** — 310+ Ferdium-compatible recipes (WhatsApp, Telegram, Discord, Slack, Gmail, etc.)
- **User accounts** — Email/password, magic link, and Google OAuth
- **Cross-device sync** — Services sync across devices via Supabase Postgres
- **Admin dashboard** — Upload custom recipes, track storage usage (5GB limit)
- **Landing page** — Polished indigo-themed marketing site

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase Postgres |
| Storage | Supabase Storage (5GB free tier) |
| Auth | Supabase Auth (email/password, magic link, Google OAuth) |
| Deployment | Vercel |

## Quick start

### 1. Set up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project (free tier)
2. Wait for the project to provision (~2 minutes)
3. Go to **Settings → API** and copy:
   - `Project URL` (e.g., `https://abcdefgh.supabase.co`)
   - `anon public` key
   - `service_role` key (keep secret!)

### 2. Run the SQL migration

1. In Supabase, go to **SQL Editor → New query**
2. Open [`supabase/migrations/0001_initial.sql`](./supabase/migrations/0001_initial.sql)
3. Copy the entire file contents, paste into the SQL editor
4. Click **Run**

This creates:
- `profiles` table (extends `auth.users`)
- `recipes` table
- `user_services` table
- `storage_usage` view
- Row Level Security policies
- `recipe-packages` storage bucket
- `promote_admin()` function

### 3. Configure environment variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ADMIN_EMAILS=your-email@example.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create your admin account

1. Go to `/signup` and create an account with your admin email
2. Check your email and click the confirmation link
3. Sign in at `/login`
4. Your email is automatically admin because it's in `SUPABASE_ADMIN_EMAILS`

### 6. Sync all 310 Ferdium recipes

```bash
npm run sync-recipes
```

This fetches all recipes from `api.ferdium.org`, downloads their `.tar.gz` packages, uploads them to your Supabase Storage, and inserts metadata into Postgres. Takes ~5-10 minutes.

### 7. Point your SocialManager desktop app to this API

In the SocialManager desktop app:
1. Go to **Settings → Server**
2. Set the server URL to your deployed URL (e.g., `https://your-app.vercel.app`)
3. Restart the app

The "Add Service" screen will now show all 310 recipes from YOUR API.

## Deployment to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)
5. Deploy

After deployment:
1. Update Supabase Auth settings:
   - Go to **Authentication → URL Configuration**
   - Set **Site URL** to `https://your-app.vercel.app`
   - Add `https://your-app.vercel.app/api/auth/callback` to **Redirect URLs**
2. Re-run `npm run sync-recipes` (with production env vars) to populate recipes

## Google OAuth setup (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret
5. In Supabase: **Authentication → Providers → Google**
   - Enable Google
   - Paste Client ID and Client Secret
6. In `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## API endpoints

### Public (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/recipes` | List all approved recipes |
| GET | `/api/v1/recipes/popular` | List featured recipes |
| GET | `/api/v1/recipes/search?needle=X` | Search recipes by name |
| GET | `/api/v1/recipes/download/{id}` | Download recipe .tar.gz (redirects to signed URL) |

### Authenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/me` | Current user profile |
| GET | `/api/v1/services` | List user's synced services |
| POST | `/api/v1/services` | Create/update a service |
| DELETE | `/api/v1/services?id=X` | Delete a service |
| POST | `/api/auth/signup` | Sign up with email/password |
| POST | `/api/auth/login` | Sign in with email/password |
| POST | `/api/auth/magic-link` | Send magic link |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/callback` | OAuth callback |

### Admin only

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/recipes` | Upload custom recipe |
| DELETE | `/api/admin/recipes?id=X` | Delete a recipe |
| GET | `/api/admin/stats` | Storage usage stats |

## Admin access

Admin is controlled by the `SUPABASE_ADMIN_EMAILS` environment variable:

```env
SUPABASE_ADMIN_EMAILS=you@example.com,friend@example.com
```

Any user signing up with one of these emails automatically gets admin access. No database changes needed.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (public) |
| `/login` | Sign in |
| `/signup` | Create account |
| `/dashboard` | User dashboard (synced services) |
| `/admin` | Admin overview (storage tracker) |
| `/admin/recipes` | Recipe management |
| `/admin/upload` | Upload custom recipe |

## Storage tracker

The admin dashboard shows real-time storage usage:
- Total bytes used
- % of 5GB limit
- Available space
- File count
- Warning at 70% usage
- Critical alert at 90% usage

If you exceed 5GB, options:
1. Delete unused recipes from `/admin/recipes`
2. Upgrade to Supabase Pro ($25/month for 100GB)
3. Move old recipes to a cheaper storage backend

## License

MIT
