import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
          SocialManager API
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          A self-hosted recipe catalog for the SocialManager desktop app (a Ferdium fork).
          Browse 410+ recipes and download them directly to your client.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/api/v1/recipes"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            Browse recipes
          </Link>
          <a
            href="https://github.com/ferdium/ferdium-app"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-2xl">📦</div>
          <h3 className="mt-3 font-semibold text-slate-900">410+ Recipes</h3>
          <p className="mt-1 text-sm text-slate-600">
            Mirror of the Ferdium recipe catalog, served from your own storage.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-2xl">🔌</div>
          <h3 className="mt-3 font-semibold text-slate-900">Public API</h3>
          <p className="mt-1 text-sm text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5">GET /api/v1/recipes</code>{' '}
            — no auth, no rate-limit headaches.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-2xl">🛡️</div>
          <h3 className="mt-3 font-semibold text-slate-900">Self-hosted</h3>
          <p className="mt-1 text-sm text-slate-600">
            Deploy to Vercel in one click. Your recipes, your storage, your rules.
          </p>
        </div>
      </div>

      <div className="mt-16 rounded-xl border border-slate-200 bg-slate-50 p-8">
        <h2 className="text-lg font-semibold text-slate-900">API endpoints</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>
            <code className="rounded bg-white px-2 py-1">GET /api/v1/recipes</code> — list all approved recipes
          </li>
          <li>
            <code className="rounded bg-white px-2 py-1">GET /api/v1/recipes/search?q=whatsapp</code> — search by name
          </li>
          <li>
            <code className="rounded bg-white px-2 py-1">GET /api/v1/recipes/popular</code> — top downloads
          </li>
          <li>
            <code className="rounded bg-white px-2 py-1">GET /api/v1/recipes/download/[id]</code> — download .tar.gz package
          </li>
        </ul>
      </div>
    </main>
  )
}
