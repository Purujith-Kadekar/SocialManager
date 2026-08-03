# SocialManager API

A self-hosted recipe API for the SocialManager desktop app (Ferdium fork). Built with Next.js 16, Supabase, and Tailwind CSS 4.

**Repository:** https://github.com/Purujith-Kadekar/SocialManager

## What this provides

- **Public recipe catalog API** — 410+ Ferdium-compatible recipes (WhatsApp, Telegram, Discord, Slack, Gmail, etc.), no auth required
- **Admin-only recipe management** — upload custom recipes, view the catalog, delete recipes
- **Landing page** — minimal indigo-themed marketing page

## What this does NOT provide

There is **no user-account layer** — no OAuth, no magic links, no signup, no /dashboard, no per-user sync. The desktop app talks directly to the public recipe API. Admin access is gated by an env-based login at `/login` (you reach `/admin` by typing the URL manually; there is no link from the landing page).

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase Postgres (recipes table only) |
| Storage | Supabase Storage (5GB free tier) |
| Admin auth | Env-compare + HMAC-signed cookie (no Supabase Auth) |
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

This creates the `recipes` table, RLS policies, and the `recipe-packages` storage bucket. (You can ignore any `profiles` / `user_services` tables that the migration may also create — they are no longer used.)

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=recipe-packages

# Admin login — env-based, NOT Supabase Auth
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=change-this-to-a-strong-password

# Random 32+ chars — used to HMAC-sign the admin session cookie
AUTH_SECRET=run "openssl rand -base64 32" to generate
```

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Sign in as admin

1. Go to `http://localhost:3000/login`
2. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env.local`
3. You'll be redirected to `/admin` where you can upload, browse, and delete recipes

There is no link to `/admin` from the public landing page — type the URL manually.

### 6. Sync all 410+ Ferdium recipes

```bash
npm run sync-recipes
```

This downloads the entire `ferdium/ferdium-recipes` GitHub repo as a single tarball, repackages each recipe folder as `{id}.tar.gz`, uploads them to your Supabase Storage, and inserts metadata into Postgres. Takes ~2-5 minutes.

### 7. Point your SocialManager desktop app to this API

In the SocialManager desktop app:
1. Go to **Settings → Server**
2. Set the server URL to your deployed URL (e.g., `https://your-app.vercel.app`)
3. Restart the app

## Deployment to Vercel

⚠️ **IMPORTANT**: Set environment variables BEFORE clicking Deploy.

1. Push this project to GitHub: https://github.com/Purujith-Kadekar/SocialManager
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Expand "Environment Variables" and add ALL of these:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET` = `recipe-packages`
   - `ADMIN_EMAIL` (the email you'll use to log in)
   - `ADMIN_PASSWORD` (the password you'll use to log in)
   - `AUTH_SECRET` (run `openssl rand -base64 32` to generate)
4. Click **Deploy**

After deployment:
- Visit `https://your-app.vercel.app/login` and sign in with your admin credentials.
- Visit `https://your-app.vercel.app/admin` to manage recipes.

No Supabase Auth configuration is required — the admin login is purely env-based.

## API endpoints

### Public (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/recipes` | List all approved recipes |
| GET | `/api/v1/recipes/popular` | List featured recipes |
| GET | `/api/v1/recipes/search?needle=X` | Search recipes by name |
| GET | `/api/v1/recipes/download/{id}` | Download recipe .tar.gz (redirects to signed URL) |

### Admin only (requires signed `sm_admin` cookie)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Sign in (env-compare, sets cookie) |
| POST | `/api/auth/logout` | Sign out (clears cookie) |
| GET | `/api/admin/recipes` | List all recipes with storage stats |
| POST | `/api/admin/recipes` | Upload custom recipe (multipart form) |
| DELETE | `/api/admin/recipes?id=X` | Delete a recipe |
| GET | `/api/admin/stats` | Storage usage stats |

## How admin auth works

There is no Supabase Auth integration. The flow is:

1. `POST /api/auth/login` receives `{ email, password }`
2. Server compares them against `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars using `timingSafeEqual` (constant-time compare to avoid timing attacks)
3. If they match, the server signs an HMAC token with `AUTH_SECRET` and sets it as an httpOnly cookie `sm_admin` (7-day expiry)
4. Middleware on `/admin/*` and `/api/admin/*` verifies the HMAC signature on every request — no DB lookup, fully stateless
5. `POST /api/auth/logout` just clears the cookie

This means:
- No Supabase Auth project configuration needed
- No `getUserByEmail` errors
- No redirect/callback URLs to whitelist in Supabase
- Change your admin password = just update the env var on Vercel

## License

MIT
