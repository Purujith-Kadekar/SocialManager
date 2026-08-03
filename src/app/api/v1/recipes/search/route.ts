import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const needle = request.nextUrl.searchParams.get('needle')
    if (!needle) {
      return NextResponse.json(
        { error: 'Missing "needle" query parameter' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, description, author, icon_url, is_featured')
      .eq('is_approved', true)
      .ilike('name', `%${needle}%`)
      .order('name')
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
