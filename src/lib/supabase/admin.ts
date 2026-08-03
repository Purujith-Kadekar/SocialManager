/**
 * Admin Supabase client using the service role key.
 * BYPASSES Row Level Security — use ONLY in trusted server-side code.
 *
 * Use this for:
 *   - Reading all recipes in the public API (no auth required for /v1/recipes)
 *   - Writing recipes during the sync script
 *   - Generating signed download URLs
 *   - Admin stats queries
 *
 * NEVER import this in a client component.
 */
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. '
      + 'These are server-only env vars. See .env.example.'
    )
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
