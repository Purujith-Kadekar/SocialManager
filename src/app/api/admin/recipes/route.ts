/**
 * POST /api/admin/recipes
 *
 * Upload a new custom recipe.
 * Multipart form data:
 *   - file: the recipe .tar.gz file
 *   - metadata: JSON string with { id, name, description, category, ... }
 *
 * Requires admin auth.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/auth'
import { STORAGE_LIMIT_BYTES } from '@/types/database'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin via env var whitelist OR is_admin flag
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin && !isAdminEmail(user.email ?? '')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Parse multipart form
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const metadataStr = formData.get('metadata') as string | null

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (!metadataStr) {
      return NextResponse.json({ error: 'Metadata is required' }, { status: 400 })
    }

    let metadata: {
      id: string
      name: string
      description?: string
      category?: string
      author?: string
      website?: string
      icon_url?: string
      is_featured?: boolean
      recipe_metadata?: Record<string, unknown>
    }

    try {
      metadata = JSON.parse(metadataStr)
    } catch {
      return NextResponse.json({ error: 'Invalid metadata JSON' }, { status: 400 })
    }

    if (!metadata.id || !metadata.name) {
      return NextResponse.json(
        { error: 'metadata.id and metadata.name are required' },
        { status: 400 }
      )
    }

    // Validate recipe ID (no path traversal, alphanumeric + dashes only)
    if (!/^[a-z0-9-]+$/.test(metadata.id)) {
      return NextResponse.json(
        { error: 'Recipe ID must be lowercase alphanumeric with dashes only' },
        { status: 400 }
      )
    }

    // Check storage limit (5GB Supabase free tier)
    const adminSupabase = createAdminClient()
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages'

    const { data: usage } = await adminSupabase
      .from('recipes')
      .select('file_size_bytes')
      .not('storage_path', 'is', null)

    const currentBytes = (usage ?? []).reduce((sum, r) => sum + (r.file_size_bytes ?? 0), 0)
    const newTotalBytes = currentBytes + file.size

    if (newTotalBytes > STORAGE_LIMIT_BYTES) {
      const availableMB = Math.max(0, (STORAGE_LIMIT_BYTES - currentBytes) / 1024 / 1024).toFixed(1)
      return NextResponse.json(
        {
          error: `Storage limit exceeded. Available: ${availableMB} MB. File size: ${(file.size / 1024 / 1024).toFixed(1)} MB.`,
        },
        { status: 413 }
      )
    }

    // Check if recipe already exists
    const { data: existing } = await adminSupabase
      .from('recipes')
      .select('id')
      .eq('id', metadata.id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: `Recipe "${metadata.id}" already exists. Use a different ID or delete the existing one first.` },
        { status: 409 }
      )
    }

    // Upload to Supabase Storage
    const storagePath = `${metadata.id}.tar.gz`
    const fileBuffer = await file.arrayBuffer()

    const { error: uploadError } = await adminSupabase
      .storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: 'application/gzip',
        upsert: false,
      })

    if (uploadError) {
      console.error('[/api/admin/recipes] upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload recipe file', details: uploadError.message },
        { status: 500 }
      )
    }

    // Insert recipe record
    const { data: recipe, error: dbError } = await adminSupabase
      .from('recipes')
      .insert({
        id: metadata.id,
        name: metadata.name,
        description: metadata.description ?? null,
        category: metadata.category ?? 'other',
        author: metadata.author ?? null,
        website: metadata.website ?? null,
        icon_url: metadata.icon_url ?? null,
        is_featured: metadata.is_featured ?? false,
        is_official: false,
        is_custom: true,
        is_approved: true,
        storage_path: storagePath,
        file_size_bytes: file.size,
        recipe_metadata: metadata.recipe_metadata ?? {},
      })
      .select()
      .single()

    if (dbError) {
      console.error('[/api/admin/recipes] DB insert error:', dbError)
      // Clean up the uploaded file
      await adminSupabase.storage.from(bucket).remove([storagePath])
      return NextResponse.json(
        { error: 'Failed to create recipe record', details: dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(recipe, { status: 201 })
  } catch (err) {
    console.error('[/api/admin/recipes] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/recipes?id=X
 * Delete a recipe and its storage file.
 */
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const recipeId = searchParams.get('id')

    if (!recipeId) {
      return NextResponse.json({ error: 'id query parameter required' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages'

    // Get the recipe to find its storage path
    const { data: recipe, error: fetchErr } = await adminSupabase
      .from('recipes')
      .select('storage_path, is_official')
      .eq('id', recipeId)
      .single()

    if (fetchErr || !recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Delete from storage
    if (recipe.storage_path) {
      await adminSupabase.storage.from(bucket).remove([recipe.storage_path])
    }

    // Delete from DB
    const { error: delErr } = await adminSupabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)

    if (delErr) {
      console.error('[/api/admin/recipes DELETE] DB error:', delErr)
      return NextResponse.json({ error: delErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/admin/recipes DELETE] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
