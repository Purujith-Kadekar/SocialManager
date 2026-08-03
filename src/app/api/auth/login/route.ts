/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Signs in with email/password.
 *
 * Admin auto-provisioning: if the email/password match the env-defined
 * ADMIN_EMAIL / ADMIN_PASSWORD, the user is automatically created (or
 * updated) in Supabase Auth with email_confirm: true. This means you
 * can log in as admin without ever signing up or confirming via email.
 * Just set ADMIN_EMAIL and ADMIN_PASSWORD in your .env.local / Vercel
 * env vars, then enter those credentials on /login.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // --- Admin auto-provisioning ---
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const adminPassword = process.env.ADMIN_PASSWORD
    const isEnvAdmin =
      adminEmail &&
      adminPassword &&
      email.trim().toLowerCase() === adminEmail &&
      password === adminPassword

    if (isEnvAdmin) {
      const adminSupabase = createAdminClient()

      // Look up existing user by email
      const { data: existing, error: lookupError } =
        await adminSupabase.auth.admin.getUserByEmail(email)

      if (lookupError || !existing?.user) {
        // Create the admin user with email_confirm: true (no email sent)
        const { data: created, error: createError } =
          await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'Admin' },
          })

        if (createError || !created?.user) {
          console.error('[/api/auth/login] admin create failed:', createError)
          return NextResponse.json(
            { error: 'Failed to provision admin user: ' + (createError?.message ?? 'unknown') },
            { status: 500 }
          )
        }
        console.log('[/api/auth/login] admin user created:', created.user.id)
      } else {
        // User exists — sync the password in case env var changed
        const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
          existing.user.id,
          { password, email_confirm: true }
        )
        if (updateError) {
          console.error('[/api/auth/login] admin password sync failed:', updateError)
          // Non-fatal — fall through to signInWithPassword
        }
      }
    }

    // --- Sign in (works for both env-admin and regular users) ---
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    })
  } catch (err) {
    console.error('[/api/auth/login] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
