# SocialManager API

A self-hosted recipe API for the SocialManager desktop app (Ferdium fork). Built with Next.js 16, Supabase, and Tailwind CSS 4.

## What this provides

- **Recipe catalog API** — 310+ Ferdium-compatible recipes (WhatsApp, Telegram, Discord, Slack, Gmail, etc.)
- **Admin dashboard** — Upload custom recipes, track storage usage (5GB limit)
- **Landing page** — Polished indigo-themed marketing site

That's it. No user accounts, no OAuth, no magic links, no signup flow. The recipe API is fully public (the desktop app fetches it without auth), and the only protected surface is `/admin` for managing recipes.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase Postgres |
| Storage | Supabase Storage (5GB free tier) |
| Auth | Supabase Auth (admin login only — auto-provisioned via env vars) |
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
   ADMIN_EMAIL=your-admin-email@example.com
   ADMIN_PASSWORD=your-strong-password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Log in as admin

1. Go to `/login` (not linked anywhere — type it manually)
2. Enter the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env.local`
3. On first login, the admin user is auto-created in Supabase Auth with `email_confirm: true` — no email confirmation needed. If you later change the env vars, the password is synced on next login.

You'll be redirected to `/admin` where you can upload and manage recipes.

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

1. Push this project to GitHub: [https://github.com/Purujith-Kadekar/SocialManager](https://github.com/Purujith-Kadekar/SocialManager)
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the `SocialManager` repo
3. **Before clicking Deploy**, open **Settings → Environment Variables** and add every variable from `.env.example` (see list below). The build will fail without them.
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)
5. Click **Deploy**

### Required env vars (set these in Vercel BEFORE deploying)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | YES | Your Supabase project URL (e.g. `https://abcdefgh.supabase.co`) — no `/rest/v1/` suffix |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | YES | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | YES | Server-only — never expose to the browser |
| `ADMIN_EMAIL` | YES | Admin email — used with ADMIN_PASSWORD for auto-provisioned login |
| `ADMIN_PASSWORD` | YES | Admin password — auto-provisions the user on first login |
| `SUPABASE_ADMIN_EMAILS` | optional | Comma-separated additional admin emails (if you want more than one admin) |
| `NEXT_PUBLIC_APP_URL` | YES | Your Vercel deployment URL |
| `SUPABASE_STORAGE_BUCKET` | optional | Defaults to `recipe-packages` |

After deployment, re-run `npm run sync-recipes` (with production env vars) to populate recipes.

## API endpoints

### Public (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/recipes` | List all approved recipes |
| GET | `/api/v1/recipes/popular` | List featured recipes |
| GET | `/api/v1/recipes/search?needle=X` | Search recipes by name |
| GET | `/api/v1/recipes/download/{id}` | Download recipe .tar.gz (redirects to signed URL) |

### Admin only

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/recipes` | Upload custom recipe |
| DELETE | `/api/admin/recipes?id=X` | Delete a recipe |
| GET | `/api/admin/stats` | Storage usage stats |
| POST | `/api/auth/login` | Admin login (auto-provisions user on first call) |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/callback` | Stub — redirects to `/admin` |

## Admin access

Admin is controlled by two env vars:

- `ADMIN_EMAIL` + `ADMIN_PASSWORD` — used by `/api/auth/login` to auto-provision the admin user on first login. Set both, then go to `/login`.
- `SUPABASE_ADMIN_EMAILS` — comma-separated list of additional admin emails (optional).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (public) |
| `/login` | Admin sign-in (not linked — type manually) |
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
