/**
 * GET /api/v1/recipes/search?needle=whatsapp
 *
 * Search recipes by name. Returns matching approved recipes.
 * Ferdium-compatible format.
 *
 * Special needle: "socialmanager:custom" returns only custom (user-uploaded) recipes.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Recipe } from '@/types/database'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const needle = searchParams.get('needle')

    if (!needle) {
      return NextResponse.json(
        { message: 'Please provide a needle', status: 401 },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_approved', true)

    if (needle === 'socialmanager:custom') {
      query = query.eq('is_custom', true)
    } else {
      // Case-insensitive substring search
      query = query.ilike('name', `%${needle}%`)
    }

    const { data: recipes, error } = await query.order('name', { ascending: true })

    if (error) {
      console.error('[/api/v1/recipes/search] DB error:', error)
      return NextResponse.json(
        { error: 'Failed to search recipes' },
        { status: 500 }
      )
    }

    const formatted = (recipes as Recipe[]).map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      author: r.author,
      website: r.website,
      icon: r.icon_url,
      featured: r.is_featured,
      ...r.recipe_metadata,
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('[/api/v1/recipes/search] fatal:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
