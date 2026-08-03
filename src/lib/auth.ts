import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Storage cap for the recipe bucket.
 * Mirrors the 5 GB free-tier ceiling we document on the landing page.
 */
export const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB

/** Cookie name used for the admin session. */
export const ADMIN_COOKIE = 'sm_admin'

/** Token lifetime — 7 days. */
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

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
 *   - AUTH_SECRET  (used to sign the session cookie)
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
 * Build an HMAC-signed session token. Token shape:
 *   <expiresAtMs>.<base64url(hmac-sha256(secret, expiresAtMs))>
 *
 * Stateless — verifying it does not require a DB lookup, only AUTH_SECRET.
 */
export function createSessionToken(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error('AUTH_SECRET env var is not set — cannot sign admin session.')
  }
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = String(expiresAt)
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

/**
 * Verify a session token. Returns true when the signature is valid
 * AND the token has not expired.
 */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const secret = process.env.AUTH_SECRET
  if (!secret) return false

  const dot = token.indexOf('.')
  if (dot === -1) return false
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)

  const expectedSig = createHmac('sha256', secret).update(payload).digest('base64url')
  if (!safeEqual(sig, expectedSig)) return false

  const expiresAt = Number(payload)
  if (!Number.isFinite(expiresAt)) return false
  return expiresAt > Date.now()
}

/** Cookie options applied to the admin session cookie. */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: Math.floor(SESSION_TTL_MS / 1000),
}

/**
 * Server-Component / Server-Action helper — set the admin session
 * cookie on the response (or via cookies() in a Server Component).
 */
export async function setAdminSessionCookie(token: string) {
  const store = await cookies()
  store.set(ADMIN_COOKIE, token, COOKIE_OPTIONS)
}

/**
 * Server-Action helper — clear the admin session cookie.
 */
export async function clearAdminSessionCookie() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

/**
 * Server-Component guard for /admin pages.
 * Reads the cookie, verifies the token, and redirects to /login
 * if the session is missing or invalid.
 */
export async function requireAdmin() {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!verifySessionToken(token)) {
    redirect('/login')
  }
}

/**
 * API-route guard. Returns true when the incoming request carries
 * a valid admin session cookie. Use this in /api/admin/* handlers
 * to gate writes.
 */
export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  return verifySessionToken(token)
}

/**
 * Convenience for API routes that want to short-circuit with a 401.
 * Returns null if authorized; returns a 401 NextResponse otherwise.
 */
export function requireAdminOr401(request: NextRequest): NextResponse | null {
  if (isAdminRequest(request)) return null
  return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
}
