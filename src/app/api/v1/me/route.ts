/**
 * GET /api/v1/me
 * Returns the current user's profile + admin status.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ user: null, isAdmin: false })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.is_admin || isAdminEmail(user.email ?? '')

    return NextResponse.json({
      user: profile,
      isAdmin,
    })
  } catch (err) {
    console.error('[/api/v1/me] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
