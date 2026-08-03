/**
 * POST /api/auth/signup
 * Body: { email, password, full_name? }
 *
 * Creates a new Supabase auth user.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/api/auth/callback`,
        data: {
          full_name: full_name ?? '',
        },
      },
    })

    if (error) {
      console.error('[/api/auth/signup] error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      message: data.session
        ? 'Signed up successfully'
        : 'Check your email for the confirmation link',
    })
  } catch (err) {
    console.error('[/api/auth/signup] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
