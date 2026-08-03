/**
 * GET /api/auth/callback
 *
 * Stub kept for safety — if Supabase ever redirects here (e.g. from an
 * admin password reset email initiated in the Supabase dashboard), we
 * just send the user to /admin (which redirects to /login if no session).
 *
 * The user-account layer (OAuth, magic link, email confirmation) has been
 * removed from this project. Admin login is via /api/auth/login with
 * ADMIN_EMAIL / ADMIN_PASSWORD env vars, which auto-provisions the user
 * with email_confirm: true — no email is ever sent, no callback is hit.
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  return NextResponse.redirect(`${requestUrl.origin}/admin`)
}
