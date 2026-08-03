/**
 * Supabase session refresh middleware.
 *
 * THIS IS THE MISSING PIECE — without middleware, session cookies set by
 * Route Handlers (e.g. /api/auth/login) don't get refreshed on subsequent
 * navigations, and the user appears "logged out" immediately after login.
 *
 * The middleware:
 *   1. Reads the session cookie from the request
 *   2. Calls supabase.auth.getUser() — if the session is expired but the
 *      refresh token is valid, Supabase returns a new session and the
 *      `setAll` callback writes updated cookies to the response.
 *   3. Forwards the request with the refreshed cookies.
 *
 * Docs: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, don't crash — just pass through. The route
  // handlers will surface a diagnostic error instead.
  if (!supabaseUrl || !anonKey) {
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Set on the request so downstream handlers see the new value
          request.cookies.set(name, value)
          // Set on the response so the browser persists it
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // IMPORTANT: do not run any logic between createServerClient
  // and getUser(). A simple mistake here can make it very hard
  // to debug issues with users being randomly logged out.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     *   - _next/static (static files)
     *   - _next/image (image optimization files)
     *   - favicon.ico, icon-*, apple-touch-icon, logo.svg, manifest, og-image
     *   - robots.txt
     *   - public assets in /icons/
     */
    '/((?!_next/static|_next/image|favicon\\.ico|icon-.*|apple-touch-icon.*|logo\\.svg|manifest\\.webmanifest|og-image\\.png|robots\\.txt|icons/).*)',
  ],
}
