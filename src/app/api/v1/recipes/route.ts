import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, description, author, icon_url, is_featured, is_official, recipe_metadata')
      .eq('is_approved', true)
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // The desktop app's RecipePreview model reads `recipe.icons.svg`
    // (an <img src={recipe.icons?.svg}>), not a flat `icon_url` string —
    // so we mirror icon_url into that shape here. icon_url is kept too,
    // for admin tooling and backwards compatibility.
    const shaped = (data ?? []).map(r => ({
      ...r,
      icons: { svg: r.icon_url },
    }))

    return NextResponse.json(shaped)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
