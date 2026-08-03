/**
 * POST /api/auth/magic-link
 * Body: { email }
 *
 * Sends a magic link to the user's email for passwordless login.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appUrl}/api/auth/callback`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Magic link sent! Check your email.',
    })
  } catch (err) {
    console.error('[/api/auth/magic-link] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
