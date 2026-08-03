/**
 * GET /api/v1/recipes
 *
 * Returns ALL approved recipes. This is the main catalog endpoint
 * consumed by the SocialManager desktop app.
 *
 * Ferdium-compatible response format:
 *   [{ id, name, icons: { svg }, featured, ...recipe_metadata, ... }]
 *
 * The `icons.svg` URL points at the jsDelivr CDN mirror of the ferdium-recipes
 * GitHub repo. Every recipe in our DB came from that repo, so every id has a
 * matching icon.svg at:
 *   https://cdn.jsdelivr.net/gh/ferdium/ferdium-recipes/recipes/{id}/icon.svg
 *
 * No auth required — public endpoint.
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
      .order('name', { ascending: true })

    if (error) {
      console.error('[/api/v1/recipes] DB error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recipes', details: error.message },
        { status: 500 }
      )
    }

    // Format like Ferdium API: flat array with id, name, icons, and metadata spread
    const formatted = (recipes as Recipe[]).map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      author: r.author,
      website: r.website,
      icon: r.icon_url,
      featured: r.is_featured,
      // Ferdium-compatible icons field — renderer's RecipeItem.js does
      //   <img src={recipe.icons.svg}>
      // Without this, only the recipe name renders (no icon).
      icons: {
        svg: iconUrlFor(r.id),
      },
      // Spread all Ferdium-compatible metadata
      ...r.recipe_metadata,
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('[/api/v1/recipes] fatal:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
