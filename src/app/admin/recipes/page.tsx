import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Shield, Upload, Package, LogOut, Search, Trash2 } from 'lucide-react'
import { getProfile, isAdminEmail } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeleteRecipeButton } from '@/components/admin/delete-recipe-button'

export const dynamic = 'force-dynamic'

export default async function AdminRecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  const isAdmin = profile.is_admin || isAdminEmail(profile.email)
  if (!isAdmin) redirect('/?error=admin_required')

  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const supabase = createAdminClient()
  let recipesQuery = supabase
    .from('recipes')
    .select('id, name, description, category, is_custom, is_official, is_featured, file_size_bytes, created_at')
    .order('name', { ascending: true })

  if (query) {
    recipesQuery = recipesQuery.ilike('name', `%${query}%`)
  }

  const { data: recipes } = await recipesQuery

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-gradient flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">SocialManager</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-2">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">← Back to admin</Link>
            </Button>
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-1" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Recipes ({recipes?.length ?? 0})
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage the recipe catalog
              </p>
            </div>
            <Button asChild className="bg-indigo-gradient text-white border-0 hover:opacity-90">
              <Link href="/admin/upload">
                <Upload className="h-4 w-4 mr-1" />
                Upload new
              </Link>
            </Button>
          </div>

          {/* Search */}
          <form className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search recipes..."
                className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm"
              />
            </div>
          </form>

          {/* Recipe list */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40 max-h-[70vh] overflow-y-auto">
                {recipes && recipes.length > 0 ? (
                  recipes.map((r) => (
                    <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
                      <div className="h-10 w-10 rounded-lg bg-indigo-gradient flex items-center justify-center text-white font-bold">
                        {r.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{r.name}</span>
                          {r.is_featured && (
                            <Badge variant="secondary" className="text-xs">Featured</Badge>
                          )}
                          {r.is_custom ? (
                            <Badge variant="outline" className="text-xs">Custom</Badge>
                          ) : r.is_official ? (
                            <Badge variant="outline" className="text-xs">Official</Badge>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">
                          {r.id} · {r.category} · {(r.file_size_bytes / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <DeleteRecipeButton recipeId={r.id} recipeName={r.name} />
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No recipes found</p>
                    <p className="text-sm mt-1">
                      {query
                        ? `No recipes match "${query}"`
                        : 'Upload a custom recipe or run the sync script to import Ferdium recipes.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
