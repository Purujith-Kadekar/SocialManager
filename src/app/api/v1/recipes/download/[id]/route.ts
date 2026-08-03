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
      .createSignedUrl(recipe.storage_path, 300) // 5-minute URL

    if (urlError || !signedUrlData?.signedUrl) {
      return NextResponse.json({ error: 'Failed to create download URL' }, { status: 500 })
    }

    return NextResponse.redirect(signedUrlData.signedUrl, 302)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
