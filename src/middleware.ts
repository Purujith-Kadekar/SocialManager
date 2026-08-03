import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/auth'

/**
 * Middleware (Node.js runtime).
 *
 * The only protected surface area is /admin/* (and /api/admin/*).
 * The landing page and /api/v1/* (public recipe API) are never touched.
 *
 * Auth is HTTP Basic — the browser shows its native login dialog on the
 * first protected request, caches credentials for the session, and reuses
 * them on every subsequent request. No login page, no cookie, no session
 * store, no Supabase Auth.
 *
 * Credentials are checked against the ADMIN_EMAIL / ADMIN_PASSWORD env vars.
 */
function unauthorizedResponse(): NextResponse {
  const res = new NextResponse(
    process.env.ADMIN_EMAIL ? 'Authentication required' : 'ADMIN_EMAIL / ADMIN_PASSWORD env vars not set',
    { status: 401 }
  )
  res.headers.set(
    'www-authenticate',
    'Basic realm="SocialManager Admin", charset="UTF-8"'
  )
  return res
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  if (!isProtected) {
    return NextResponse.next()
  }

  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

// Use Node.js runtime so we can use node:crypto (timingSafeEqual).
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
  runtime: 'nodejs',
}
