/**
 * GET /api/admin/stats
 *
 * Returns storage usage stats for the admin dashboard.
 * Shows total bytes used, file count, and % of 5GB limit.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/auth'
import { STORAGE_LIMIT_BYTES } from '@/types/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin && !isAdminEmail(user.email ?? '')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const adminSupabase = createAdminClient()

    // Query the storage_usage view
    const { data: usage, error } = await adminSupabase
      .from('storage_usage')
      .select('*')
      .single()

    if (error) {
      console.error('[/api/admin/stats] error:', error)
      // Fallback: compute manually
      const { data: recipes } = await adminSupabase
        .from('recipes')
        .select('file_size_bytes, is_custom, is_official')
        .not('storage_path', 'is', null)

      const list = recipes ?? []
      const totalBytes = list.reduce((s, r) => s + (r.file_size_bytes ?? 0), 0)
      return NextResponse.json({
        file_count: list.length,
        total_bytes: totalBytes,
        total_gb: totalBytes / 1073741824,
        custom_count: list.filter(r => r.is_custom).length,
        official_count: list.filter(r => r.is_official).length,
        limit_bytes: STORAGE_LIMIT_BYTES,
        limit_gb: STORAGE_LIMIT_BYTES / 1073741824,
        percent_used: (totalBytes / STORAGE_LIMIT_BYTES) * 100,
        available_bytes: Math.max(0, STORAGE_LIMIT_BYTES - totalBytes),
        available_mb: Math.max(0, (STORAGE_LIMIT_BYTES - totalBytes) / 1024 / 1024),
      })
    }

    const totalBytes = Number(usage?.total_bytes ?? 0)
    return NextResponse.json({
      file_count: Number(usage?.file_count ?? 0),
      total_bytes: totalBytes,
      total_gb: Number(usage?.total_gb ?? 0),
      custom_count: Number(usage?.custom_count ?? 0),
      official_count: Number(usage?.official_count ?? 0),
      limit_bytes: STORAGE_LIMIT_BYTES,
      limit_gb: STORAGE_LIMIT_BYTES / 1073741824,
      percent_used: (totalBytes / STORAGE_LIMIT_BYTES) * 100,
      available_bytes: Math.max(0, STORAGE_LIMIT_BYTES - totalBytes),
      available_mb: Math.max(0, (STORAGE_LIMIT_BYTES - totalBytes) / 1024 / 1024),
    })
  } catch (err) {
    console.error('[/api/admin/stats] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
