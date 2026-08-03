/**
 * GET /api/v1/recipes/popular
 *
 * Returns featured recipes for the "Popular" tab in the desktop app.
 * Ferdium-compatible format: includes icons.svg URL.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Recipe } from '@/types/database'

export const dynamic = 'force-dynamic'

const ICON_CDN_BASE =
  'https://cdn.jsdelivr.net/gh/ferdium/ferdium-recipes/recipes'

function iconUrlFor(recipeId: string): string {
  return `${ICON_CDN_BASE}/${recipeId}/icon.svg`
}

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_approved', true)
      .eq('is_featured', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('[/api/v1/recipes/popular] DB error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch popular recipes' },
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
      icons: {
        svg: iconUrlFor(r.id),
      },
      ...r.recipe_metadata,
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('[/api/v1/recipes/popular] fatal:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
