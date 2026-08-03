/**
 * Auth helpers — server-side session checks.
 */
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

/**
 * Get the current user's profile, or null if not logged in.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as Profile | null
}

/**
 * Require a logged-in user. Redirects to /login if not authenticated.
 */
export async function requireUser(): Promise<Profile> {
  const profile = await getProfile()
  if (!profile) {
    redirect('/login')
  }
  return profile
}

/**
 * Check if the given email is in the SUPABASE_ADMIN_EMAILS env var.
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.SUPABASE_ADMIN_EMAILS ?? ''
  const list = adminEmails
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  return list.includes(email.toLowerCase())
}

/**
 * Require an admin user. Redirects to /login if not authenticated,
 * or returns 403 if not admin (when used in API route).
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireUser()
  // Check both the is_admin flag AND the env var whitelist
  if (!profile.is_admin && !isAdminEmail(profile.email)) {
    redirect('/?error=admin_required')
  }
  return profile
}
