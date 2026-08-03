'use client'

/**
 * Catches `?code=...` in the URL on the homepage and exchanges it for a
 * Supabase session. This is a safety net for the email-confirmation flow.
 *
 * Why this exists:
 *   Supabase's email confirmation link should go to /api/auth/callback?code=...
 *   (which is handled by src/app/api/auth/callback/route.ts). BUT if the
 *   Redirect URLs allowlist in Supabase dashboard doesn't include the
 *   /api/auth/callback path, Supabase silently falls back to the Site URL
 *   (i.e. https://your-app.vercel.app/?code=...). Without this handler,
 *   the user lands on the homepage with a `code` param that goes unused
 *   and they never get logged in.
 *
 *   This component picks up that orphaned `code` and finishes the exchange
 *   client-side. Must be wrapped in <Suspense> because it uses useSearchParams.
 */
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthCodeHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) return

    const supabase = createClient()
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          console.error('[AuthCodeHandler] exchange error:', error)
          router.replace(`/login?error=${encodeURIComponent(error.message)}`)
        } else {
          router.replace('/dashboard')
        }
      })
      .catch((err) => {
        console.error('[AuthCodeHandler] fatal:', err)
        router.replace('/login?error=verification_failed')
      })
  }, [searchParams, router])

  return null
}
