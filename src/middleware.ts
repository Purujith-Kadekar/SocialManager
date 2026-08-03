import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/auth'

/**
 * Middleware (Node.js runtime).
 *
 * The only protected surface area is /admin/* (and /api/admin/*).
 * The landing page, /login, and /api/v1/* (public recipe API) are
 * never redirected.
 *
 * Auth check is done by verifying the HMAC-signed admin cookie. No
 * Supabase lookup is performed — the cookie is stateless.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value

  // For API routes, return 401 JSON instead of redirecting.
  if (pathname.startsWith('/api/admin')) {
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // For /admin pages, redirect to /login if not authed.
  if (!verifySessionToken(token)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Use Node.js runtime so we can use node:crypto (createHmac, timingSafeEqual).
// This is stable in Next.js 16+ and works on Vercel.
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
  runtime: 'nodejs',
}
