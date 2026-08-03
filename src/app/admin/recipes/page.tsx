import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminRecipesPage() {
  await requireAdmin()

  return (
    <div className="relative min-h-screen overflow-hidden bg-indigo-radial">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-indigo-gradient" />

      <main className="relative mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold text-white">Recipes</h1>
        <p className="mt-2 text-sm text-slate-400">
          All recipes in your catalog. Custom recipes can be deleted.
        </p>
        <div className="mt-8 rounded-xl border border-indigo-900/40 bg-white/5 p-6 backdrop-blur">
          <p className="text-sm text-slate-300">
            Load recipes via the API: <code className="rounded bg-indigo-950/60 px-2 py-1 text-indigo-200">GET /api/v1/recipes</code>
          </p>
        </div>
      </main>
    </div>
  )
}
