import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * Keep-alive ping for the Supabase project.
 *
 * Supabase's free tier auto-pauses a project after ~7 days with no
 * activity. This endpoint does the cheapest possible real query against
 * the database (just a row count on `recipes`, already indexed / trivial)
 * so Supabase sees genuine activity and never pauses, even if nobody
 * opens the desktop app or the admin panel for weeks.
 *
 * Triggered by a scheduled GitHub Actions workflow (see
 * .github/workflows/keepalive.yml) rather than Vercel Cron, since Vercel
 * Cron requires a paid plan. This endpoint is intentionally left
 * unauthenticated - it's a harmless read-only count, nothing sensitive.
 */
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { count, error } = await supabase
      .from('recipes')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.error('Keep-alive query failed:', error.message)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    console.log(`Keep-alive ping OK — ${count} recipes, ${new Date().toISOString()}`)
    return NextResponse.json({ ok: true, recipeCount: count, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('Keep-alive ping error:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
