export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-indigo-radial">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-indigo-gradient" />

      <main className="relative mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold text-white">Admin</h1>
        <p className="mt-2 text-sm text-slate-400">
          Storage usage and recipe management.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="/admin/recipes"
            className="rounded-xl border border-indigo-900/40 bg-white/5 p-6 backdrop-blur transition hover:border-indigo-500/60 hover:bg-white/10"
          >
            <div className="text-2xl">📚</div>
            <h3 className="mt-3 font-semibold text-white">Recipes</h3>
            <p className="mt-1 text-sm text-slate-400">View and delete recipes</p>
          </a>
          <a
            href="/api/admin/stats"
            className="rounded-xl border border-indigo-900/40 bg-white/5 p-6 backdrop-blur transition hover:border-indigo-500/60 hover:bg-white/10"
          >
            <div className="text-2xl">📊</div>
            <h3 className="mt-3 font-semibold text-white">Stats JSON</h3>
            <p className="mt-1 text-sm text-slate-400">Raw storage usage data</p>
          </a>
        </div>
      </main>
    </div>
  )
}
