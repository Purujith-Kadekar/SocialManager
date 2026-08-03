import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

/**
 * Storage cap for the recipe bucket.
 * Mirrors the 5 GB free-tier ceiling we document on the landing page.
 */
export const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB

/**
 * Constant-time string compare to avoid timing-attack leaks
 * of the admin password.
 */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/**
 * Verify an email/password pair against the env-configured admin
 * credentials. Returns true ONLY when both match exactly.
 *
 * No Supabase Auth call happens here — the admin identity lives
 * purely in Vercel environment variables:
 *   - ADMIN_EMAIL
 *   - ADMIN_PASSWORD
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL ?? ''
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ''

  if (!expectedEmail || !expectedPassword) {
    return false
  }

  return (
    safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase()) &&
    safeEqual(password, expectedPassword)
  )
}

/**
 * Parse the HTTP Basic `Authorization` header from a request.
 * Returns `{ email, password }` when a valid Basic header is present,
 * or `null` otherwise.
 *
 * Browsers send this automatically after the user dismisses the native
 * 401 challenge dialog with credentials filled in. No login page needed.
 */
export function parseBasicAuth(request: NextRequest): { email: string; password: string } | null {
  const header = request.headers.get('authorization')
  if (!header) return null

  const parts = header.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') return null

  let decoded: string
  try {
    decoded = Buffer.from(parts[1], 'base64').toString('utf8')
  } catch {
    return null
  }

  const colon = decoded.indexOf(':')
  if (colon === -1) return null

  return {
    email: decoded.slice(0, colon),
    password: decoded.slice(colon + 1),
  }
}

/**
 * Returns true when the incoming request carries valid HTTP Basic
 * admin credentials. Used by middleware + /api/admin/* handlers.
 */
export function isAdminRequest(request: NextRequest): boolean {
  const creds = parseBasicAuth(request)
  if (!creds) return false
  return verifyAdminCredentials(creds.email, creds.password)
}

/**
 * Convenience for API routes that want to short-circuit with a 401.
 * Returns null if authorized; returns a 401 NextResponse otherwise.
 */
export function requireAdminOr401(request: NextRequest): NextResponse | null {
  if (isAdminRequest(request)) return null
  return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
}
