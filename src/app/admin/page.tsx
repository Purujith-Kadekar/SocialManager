import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Admin</h1>
      <p className="mt-2 text-sm text-slate-600">
        Storage usage and recipe management.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a
          href="/admin/recipes"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
        >
          <div className="text-2xl">📚</div>
          <h3 className="mt-3 font-semibold text-slate-900">Recipes</h3>
          <p className="mt-1 text-sm text-slate-600">View and delete recipes</p>
        </a>
        <a
          href="/admin/upload"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
        >
          <div className="text-2xl">📤</div>
          <h3 className="mt-3 font-semibold text-slate-900">Upload</h3>
          <p className="mt-1 text-sm text-slate-600">Add a custom recipe</p>
        </a>
        <a
          href="/api/admin/stats"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
        >
          <div className="text-2xl">📊</div>
          <h3 className="mt-3 font-semibold text-slate-900">Stats JSON</h3>
          <p className="mt-1 text-sm text-slate-600">Raw storage usage data</p>
        </a>
      </div>
    </main>
  )
}
