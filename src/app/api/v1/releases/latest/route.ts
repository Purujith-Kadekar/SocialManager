import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: release, error } = await supabase
      .from('app_releases')
      .select('version, storage_path, file_size_bytes, release_notes, created_at')
      .eq('platform', 'windows')
      .eq('is_latest', true)
      .single()

    if (error || !release) {
      return NextResponse.json({ error: 'No release available yet' }, { status: 404 })
    }

    const { data: urlData } = supabase
      .storage
      .from('app-releases')
      .getPublicUrl(release.storage_path)

    return NextResponse.json({
      version: release.version,
      downloadUrl: urlData.publicUrl,
      fileSizeBytes: release.file_size_bytes,
      releaseNotes: release.release_notes,
      releasedAt: release.created_at,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
