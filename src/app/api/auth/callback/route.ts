/**
 * GET /api/auth/callback
 *
 * Handles the OAuth callback from Supabase (email confirmation, magic link, Google OAuth).
 * Exchanges the code for a session and redirects to the dashboard.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (code) {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('[/api/auth/callback] exchange error:', error)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`
        )
      }
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  } catch (err) {
    console.error('[/api/auth/callback] fatal:', err)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
