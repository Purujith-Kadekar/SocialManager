/**
 * GET  /api/v1/services  — list current user's synced services
 * POST /api/v1/services  — create or update a service
 * DELETE /api/v1/services?id=X — delete a service
 *
 * Requires authentication.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { UserService } from '@/types/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: services, error } = await supabase
      .from('user_services')
      .select(`
        *,
        recipes (
          id,
          name,
          icon_url,
          category
        )
      `)
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[/api/v1/services] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(services)
  } catch (err) {
    console.error('[/api/v1/services GET] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { recipe_id, service_name, custom_icon_url, settings, sort_order } = body

    if (!recipe_id || !service_name) {
      return NextResponse.json(
        { error: 'recipe_id and service_name are required' },
        { status: 400 }
      )
    }

    const { data: service, error } = await supabase
      .from('user_services')
      .upsert({
        user_id: user.id,
        recipe_id,
        service_name,
        custom_icon_url,
        settings: settings ?? {},
        sort_order: sort_order ?? 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[/api/v1/services POST] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(service as UserService)
  } catch (err) {
    console.error('[/api/v1/services POST] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('id')

    if (!serviceId) {
      return NextResponse.json(
        { error: 'id query parameter required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('user_services')
      .delete()
      .eq('id', serviceId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[/api/v1/services DELETE] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/v1/services DELETE] fatal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
