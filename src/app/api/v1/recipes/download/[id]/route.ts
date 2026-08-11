import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('storage_path, name')
      .eq('id', id)
      .eq('is_approved', true)
      .single()

    if (error || !recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    const { data: signedUrlData, error: urlError } = await supabase
      .storage
      .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages')
      .createSignedUrl(recipe.storage_path, 300) // 5-minute URL, fetched server-side only

    if (urlError || !signedUrlData?.signedUrl) {
      return NextResponse.json({ error: 'Failed to create download URL' }, { status: 500 })
    }

    // Stream the file from our own domain instead of redirecting the client
    // to *.supabase.co. The desktop app downloads this with a plain
    // fetch() (no custom headers), and a cross-origin redirect target that
    // doesn't send back permissive CORS headers can cause the browser to
    // silently hand back an unreadable/empty body even though the network
    // request itself "succeeds" — which then corrupts the .tar.gz on disk.
    // Fetching it here, server-side, and returning the bytes directly
    // keeps the whole exchange same-origin from the client's perspective.
    const upstream = await fetch(signedUrlData.signedUrl)
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'Failed to fetch recipe package from storage' }, { status: 502 })
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Disposition': `attachment; filename="${id}.tar.gz"`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
