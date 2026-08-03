import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Plus, Settings, LogOut, Shield, Server } from 'lucide-react'
import { getProfile, isAdminEmail } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  const supabase = await createClient()
  const { data: services } = await supabase
    .from('user_services')
    .select(`
      id,
      service_name,
      sort_order,
      is_enabled,
      recipes (
        id,
        name,
        icon_url,
        category
      )
    `)
    .eq('user_id', profile.id)
    .order('sort_order', { ascending: true })

  const isAdmin = profile.is_admin || isAdminEmail(profile.email)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-gradient flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">SocialManager</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              </Button>
            )}
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile.full_name || profile.email.split('@')[0]}
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage your synced services below. These will appear in the SocialManager desktop app
            when you sign in with the same account.
          </p>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your services ({services?.length ?? 0})</h2>
            <Button asChild className="bg-indigo-gradient text-white border-0 hover:opacity-90">
              <Link href="/api/v1/recipes">
                <Plus className="h-4 w-4 mr-1" />
                Add service
              </Link>
            </Button>
          </div>

          {services && services.length > 0 ? (
            <div className="grid gap-3">
              {services.map((svc) => (
                <Card key={svc.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-gradient flex items-center justify-center text-white font-bold">
                      {(svc as { recipes?: { name?: string } }).recipes?.name?.[0] ?? '?'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{svc.service_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(svc as { recipes?: { id?: string; category?: string } }).recipes?.id} · {(svc as { recipes?: { category?: string } }).recipes?.category}
                      </div>
                    </div>
                    {svc.is_enabled ? (
                      <span className="text-xs text-green-500">Enabled</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Disabled</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Server className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No services yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse the recipe catalog and add your favorite services.
                </p>
                <Button asChild className="bg-indigo-gradient text-white border-0 hover:opacity-90">
                  <Link href="/api/v1/recipes">
                    <Plus className="h-4 w-4 mr-1" />
                    Browse recipes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Desktop app setup
              </CardTitle>
              <CardDescription>
                To use this API with your SocialManager desktop app:
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>
                1. Open SocialManager Settings → Server
              </p>
              <p>
                2. Set the server URL to:{' '}
                <code className="text-foreground bg-muted px-2 py-0.5 rounded">
                  {process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-app.vercel.app'}
                </code>
              </p>
              <p>
                3. Sign in with <strong>{profile.email}</strong> to sync your services
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
