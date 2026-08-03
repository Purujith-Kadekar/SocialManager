/**
 * GET /api/v1/recipes/download/{id}
 *
 * Downloads a recipe .tar.gz package.
 * Generates a signed URL from Supabase Storage and redirects.
 *
 * Ferdium-compatible: returns the binary file (or redirects to a signed URL).
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await params

    // Validate recipe ID (no path traversal)
    if (/\.\.?\//.test(recipeId) || /\/+/.test(recipeId)) {
      return NextResponse.json(
        { message: 'Invalid recipe name' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Look up the recipe
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('id, name, storage_path, is_approved')
      .eq('id', recipeId)
      .single()

    if (error || !recipe) {
      return NextResponse.json(
        { message: 'Recipe not found', code: 'recipe-not-found' },
        { status: 404 }
      )
    }

    if (!recipe.storage_path) {
      return NextResponse.json(
        { message: 'Recipe package not available', code: 'recipe-not-found' },
        { status: 404 }
      )
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages'

    // Generate a signed URL valid for 1 hour
    const { data: signedUrlData, error: signError } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(recipe.storage_path, 3600)

    if (signError || !signedUrlData?.signedUrl) {
      console.error('[/api/v1/recipes/download] signed URL error:', signError)
      return NextResponse.json(
        { error: 'Failed to generate download URL' },
        { status: 500 }
      )
    }

    // Redirect to the signed URL — the client follows and downloads the .tar.gz
    return NextResponse.redirect(signedUrlData.signedUrl, { status: 302 })
  } catch (err) {
    console.error('[/api/v1/recipes/download] fatal:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
