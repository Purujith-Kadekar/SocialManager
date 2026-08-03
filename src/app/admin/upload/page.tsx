import { requireAdmin } from '@/lib/auth'
import { LogoutButton } from '@/components/admin/logout-button'
import { UploadRecipeForm } from '@/components/admin/upload-recipe-form'

export const dynamic = 'force-dynamic'

export default async function AdminUploadPage() {
  await requireAdmin()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Upload custom recipe</h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload a .tar.gz recipe package. Max size 50 MB.
          </p>
        </div>
        <LogoutButton />
      </div>

      <UploadRecipeForm />
    </main>
  )
}
