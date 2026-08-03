import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { LogoutButton } from '@/components/admin/logout-button'
import { DeleteRecipeButton } from '@/components/admin/delete-recipe-button'

export const dynamic = 'force-dynamic'

type RecipeRow = {
  id: string
  name: string
  file_size_bytes: number | null
  is_custom: boolean | null
  is_official: boolean | null
  created_at: string | null
}

async function loadRecipes(): Promise<RecipeRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('id, name, file_size_bytes, is_custom, is_official, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load recipes:', error.message)
    return []
  }
  return (data ?? []) as RecipeRow[]
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default async function AdminRecipesPage() {
  await requireAdmin()
  const recipes = await loadRecipes()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recipes</h1>
          <p className="mt-2 text-sm text-slate-600">
            All recipes in your catalog. Custom recipes can be deleted.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Size</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recipes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No recipes loaded. Run <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run sync-recipes</code> or upload one from <a className="text-indigo-600 hover:underline" href="/admin/upload">/admin/upload</a>.
                </td>
              </tr>
            )}
            {recipes.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{r.id}</td>
                <td className="px-4 py-3 text-slate-900">{r.name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {r.is_custom ? 'custom' : r.is_official ? 'official' : 'standard'}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{formatBytes(r.file_size_bytes)}</td>
                <td className="px-4 py-3 text-right">
                  {r.is_custom ? (
                    <DeleteRecipeButton id={r.id} name={r.name} />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
