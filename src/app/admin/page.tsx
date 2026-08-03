import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Shield, Upload, Database, HardDrive, Package, LogOut, ArrowRight } from 'lucide-react'
import { getProfile, isAdminEmail } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { STORAGE_LIMIT_BYTES } from '@/types/database'
import { StorageTracker } from '@/components/admin/storage-tracker'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  const isAdmin = profile.is_admin || isAdminEmail(profile.email)
  if (!isAdmin) redirect('/?error=admin_required')

  // Fetch stats
  const supabase = createAdminClient()
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, name, is_custom, is_official, file_size_bytes, created_at')
    .order('created_at', { ascending: false })

  const allRecipes = recipes ?? []
  const totalBytes = allRecipes.reduce((s, r) => s + (r.file_size_bytes ?? 0), 0)
  const customCount = allRecipes.filter(r => r.is_custom).length
  const officialCount = allRecipes.filter(r => r.is_official).length
  const percentUsed = (totalBytes / STORAGE_LIMIT_BYTES) * 100
  const availableMB = Math.max(0, (STORAGE_LIMIT_BYTES - totalBytes) / 1024 / 1024)

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
              <Link href="/dashboard">Dashboard</Link>
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
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Manage recipes, monitor storage usage, and keep your API healthy.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total recipes</span>
                </div>
                <div className="text-2xl font-bold mt-2">{allRecipes.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Official</span>
                </div>
                <div className="text-2xl font-bold mt-2">{officialCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Custom</span>
                </div>
                <div className="text-2xl font-bold mt-2">{customCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <HardDrive className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Available</span>
                </div>
                <div className="text-2xl font-bold mt-2">{availableMB.toFixed(0)} MB</div>
              </CardContent>
            </Card>
          </div>

          {/* Storage tracker */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Usage
              </CardTitle>
              <CardDescription>
                Supabase free tier includes 5GB of storage. Recipe packages are stored as .tar.gz files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StorageTracker
                totalBytes={totalBytes}
                limitBytes={STORAGE_LIMIT_BYTES}
                percentUsed={percentUsed}
                fileCount={allRecipes.length}
              />
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Recipe
                </CardTitle>
                <CardDescription>
                  Add a new custom recipe. Upload a .tar.gz package with metadata.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-indigo-gradient text-white border-0 hover:opacity-90">
                  <Link href="/admin/upload">
                    Upload new recipe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Manage Recipes
                </CardTitle>
                <CardDescription>
                  View, search, and delete existing recipes. Sync from Ferdium upstream.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/recipes">
                    Browse recipes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent recipes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recently added</CardTitle>
              <CardDescription>Latest 10 recipes in the catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allRecipes.slice(0, 10).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <div className="h-8 w-8 rounded bg-indigo-gradient flex items-center justify-center text-white text-sm font-bold">
                      {r.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.id}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.is_custom ? 'Custom' : 'Official'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(r.file_size_bytes / 1024).toFixed(0)} KB
                    </div>
                  </div>
                ))}
                {allRecipes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No recipes yet. Run the sync script or upload a custom recipe.
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
