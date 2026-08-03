import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  STORAGE_LIMIT_BYTES,
  requireAdminOr401,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/recipes
 * Returns the full catalog with storage stats. Admin-only.
 */
export async function GET(request: NextRequest) {
  const unauthorized = requireAdminOr401(request)
  if (unauthorized) return unauthorized

  try {
    const admin = createAdminClient()
    const { data: recipes, error } = await admin
      .from('recipes')
      .select('id, name, file_size_bytes, is_custom, is_official, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const list = recipes ?? []
    const totalBytes = list.reduce((sum, r: any) => sum + (r.file_size_bytes ?? 0), 0)
    const customCount = list.filter((r: any) => r.is_custom).length

    return NextResponse.json({
      total_bytes: totalBytes,
      total_mb: (totalBytes / 1024 / 1024).toFixed(2),
      limit_bytes: STORAGE_LIMIT_BYTES,
      limit_mb: STORAGE_LIMIT_BYTES / 1024 / 1024,
      percent_used: ((totalBytes / STORAGE_LIMIT_BYTES) * 100).toFixed(2),
      available_bytes: STORAGE_LIMIT_BYTES - totalBytes,
      file_count: list.length,
      custom_count: customCount,
      recipes: list,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/recipes
 * Upload a new custom recipe. Admin-only.
 */
export async function POST(request: NextRequest) {
  const unauthorized = requireAdminOr401(request)
  if (unauthorized) return unauthorized

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const id = formData.get('id') as string | null
    const name = formData.get('name') as string | null

    if (!file || !id || !name) {
      return NextResponse.json({ error: 'file, id, and name are required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Check storage limit BEFORE uploading.
    const { data: existing } = await admin
      .from('recipes')
      .select('file_size_bytes')
    const usedBytes = (existing ?? []).reduce((sum, r: any) => sum + (r.file_size_bytes ?? 0), 0)
    if (usedBytes + file.size > STORAGE_LIMIT_BYTES) {
      return NextResponse.json(
        {
          error: `Upload would exceed 5GB storage limit (current: ${(usedBytes / 1024 / 1024).toFixed(2)} MB, file: ${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        },
        { status: 413 }
      )
    }

    // Upload to storage.
    const storagePath = `${id}.tar.gz`
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await admin
      .storage
      .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/gzip',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Insert into DB.
    const { data: recipe, error: dbError } = await admin
      .from('recipes')
      .insert({
        id,
        name,
        description: (formData.get('description') as string | null) ?? null,
        category: (formData.get('category') as string) ?? 'other',
        author: (formData.get('author') as string | null) ?? null,
        is_featured: false,
        is_official: false,
        is_custom: true,
        is_approved: true,
        storage_path: storagePath,
        file_size_bytes: file.size,
        recipe_metadata: {},
      })
      .select()
      .single()

    if (dbError) {
      // Roll back the storage upload on DB failure.
      await admin.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages')
        .remove([storagePath])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json(recipe)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/recipes?id=<recipe-id>
 * Removes a custom recipe from storage AND the DB. Admin-only.
 */
export async function DELETE(request: NextRequest) {
  const unauthorized = requireAdminOr401(request)
  if (unauthorized) return unauthorized

  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing "id" query parameter' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: recipe } = await admin
      .from('recipes')
      .select('storage_path, is_custom')
      .eq('id', id)
      .single()

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    if (recipe.storage_path) {
      await admin.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages')
        .remove([recipe.storage_path])
    }

    const { error: dbError } = await admin
      .from('recipes')
      .delete()
      .eq('id', id)

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
