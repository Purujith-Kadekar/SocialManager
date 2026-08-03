import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/logout
 *
 * Clears the admin session cookie. No Supabase signOut call is made
 * because the admin identity is env-based, not a Supabase Auth user.
 */
export async function POST() {
  try {
    await clearAdminSessionCookie()
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
