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

/**
 * Returns a JSON 500 with the REAL error message so you can diagnose
 * missing env vars / Supabase errors from the browser network tab
 * instead of seeing a generic "Internal server error".
 *
 * (Safe to expose: env-var *names* are not secrets, and Supabase error
 * messages are already user-facing. Just don't ever log the service-role
 * key value itself.)
 */
function diagnosticError(stage: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(`[/api/auth/login] ${stage}:`, err)
  return NextResponse.json(
    {
      error: `[${stage}] ${msg}`,
      // surface which env vars look missing — names only, not values
      env_hint: {
        has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        has_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        has_admin_email: !!process.env.ADMIN_EMAIL,
        has_admin_password: !!process.env.ADMIN_PASSWORD,
      },
    },
    { status: 500 }
  )
}

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
      // createAdminClient throws if SUPABASE_SERVICE_ROLE_KEY is missing.
      // Surface a helpful error instead of letting it bubble up as generic 500.
      let adminSupabase
      try {
        adminSupabase = createAdminClient()
      } catch (err) {
        return diagnosticError('admin_client_init', err)
      }

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
          return diagnosticError('admin_create', createError ?? new Error('No user returned'))
        }
        console.log('[/api/auth/login] admin user created:', created.user.id)
      } else {
        // User exists — sync the password in case env var changed
        const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
          existing.user.id,
          { password, email_confirm: true }
        )
        if (updateError) {
          // Non-fatal — fall through to signInWithPassword
          console.error('[/api/auth/login] admin password sync failed:', updateError)
        }
      }
    }

    // --- Sign in (works for both env-admin and regular users) ---
    let supabase
    try {
      supabase = await createClient()
    } catch (err) {
      return diagnosticError('server_client_init', err)
    }

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
    return diagnosticError('fatal', err)
  }
}
