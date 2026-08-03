import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    name: 'SocialManager API',
    version: '1.0.0',
    endpoints: {
      recipes:  '/api/v1/recipes',
      popular:  '/api/v1/recipes/popular',
      search:   '/api/v1/recipes/search?needle=X',
      download: '/api/v1/recipes/download/{id}',
    },
  })
}
