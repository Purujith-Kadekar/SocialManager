import { NextRequest, NextResponse } from 'next/server'
import {
  verifyAdminCredentials,
  createSessionToken,
  setAdminSessionCookie,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 *
 * Compares credentials against the ADMIN_EMAIL / ADMIN_PASSWORD env vars.
 * No Supabase Auth call is made — the admin identity lives entirely in
 * environment variables, so there is no Supabase user row to look up,
 * no service-role key required, and no risk of `auth.admin.getUserByEmail`
 * style errors.
 *
 * On success: signs an HMAC session cookie, returns { ok: true }.
 * On failure: returns 401 with a generic "Invalid credentials" message.
 */
export async function POST(request: NextRequest) {
  let email = ''
  let password = ''

  try {
    const body = await request.json()
    email = String(body?.email ?? '')
    password = String(body?.password ?? '')
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body — JSON expected.' },
      { status: 400 }
    )
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 }
    )
  }

  // Surface missing env vars explicitly so deployment issues are obvious
  // instead of masquerading as "wrong password".
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        error: 'Server is missing ADMIN_EMAIL / ADMIN_PASSWORD env vars.',
        env_hint: {
          has_admin_email: Boolean(process.env.ADMIN_EMAIL),
          has_admin_password: Boolean(process.env.ADMIN_PASSWORD),
        },
      },
      { status: 500 }
    )
  }

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json(
      { error: 'Invalid credentials.' },
      { status: 401 }
    )
  }

  let token: string
  try {
    token = createSessionToken()
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Failed to sign session.',
      },
      { status: 500 }
    )
  }

  await setAdminSessionCookie(token)
  return NextResponse.json({ ok: true })
}
