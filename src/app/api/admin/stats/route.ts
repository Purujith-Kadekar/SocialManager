import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { STORAGE_LIMIT_BYTES, requireAdminOr401 } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/stats
 * Returns storage-usage stats. Admin-only.
 */
export async function GET(request: NextRequest) {
  const unauthorized = requireAdminOr401(request)
  if (unauthorized) return unauthorized

  try {
    const admin = createAdminClient()
    const { data: recipes, error } = await admin
      .from('recipes')
      .select('id, name, file_size_bytes, is_custom, is_official, created_at')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const list = recipes ?? []
    const totalBytes = list.reduce((sum, r: any) => sum + (r.file_size_bytes ?? 0), 0)
    const customCount = list.filter((r: any) => r.is_custom).length
    const officialCount = list.filter((r: any) => r.is_official).length

    return NextResponse.json({
      total_bytes: totalBytes,
      total_mb: (totalBytes / 1024 / 1024).toFixed(2),
      limit_bytes: STORAGE_LIMIT_BYTES,
      limit_mb: STORAGE_LIMIT_BYTES / 1024 / 1024,
      percent_used: ((totalBytes / STORAGE_LIMIT_BYTES) * 100).toFixed(2),
      available_bytes: STORAGE_LIMIT_BYTES - totalBytes,
      file_count: list.length,
      custom_count: customCount,
      official_count: officialCount,
      recipes: list,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
