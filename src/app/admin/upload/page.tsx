import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Shield, Upload, LogOut, ArrowLeft } from 'lucide-react'
import { getProfile, isAdminEmail } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { UploadForm } from '@/components/admin/upload-form'

export const dynamic = 'force-dynamic'

export default async function AdminUploadPage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  const isAdmin = profile.is_admin || isAdminEmail(profile.email)
  if (!isAdmin) redirect('/?error=admin_required')

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
              <Link href="/admin/recipes">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Recipes
              </Link>
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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Upload Recipe</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Upload a custom recipe package (.tar.gz) with metadata.
            The recipe will appear in the catalog immediately.
          </p>

          <UploadForm />
        </div>
      </main>
    </div>
  )
}
