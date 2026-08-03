import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminRecipesPage() {
  await requireAdmin()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Recipes</h1>
      <p className="mt-2 text-sm text-slate-600">
        All recipes in your catalog. Custom recipes can be deleted.
      </p>
      <div className="mt-8">
        <p className="text-sm text-slate-500">
          Load recipes via the API: <code className="rounded bg-slate-100 px-2 py-1">GET /api/v1/recipes</code>
        </p>
      </div>
    </main>
  )
}
