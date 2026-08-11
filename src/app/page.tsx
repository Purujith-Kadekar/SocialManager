export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-indigo-radial">
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />

      {/* Accent underline at the very bottom of the page */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-indigo-gradient" />

      <div className="relative">
        {/* ============ NAVBAR ============ */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-gradient shadow-lg shadow-indigo-900/40">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-white">SocialManager</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#recipes" className="transition hover:text-white">Recipes</a>
            <a href="/api/v1/recipes" className="transition hover:text-white">API</a>
            <a
              href="/download"
              className="rounded-lg bg-indigo-gradient px-4 py-1.5 font-medium text-white transition hover:opacity-90"
            >
              Download
            </a>
            <a
              href="https://github.com/Purujith-Kadekar/SocialManager"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </header>

        {/* ============ HERO ============ */}
        <section className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center sm:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-700/40 bg-indigo-900/20 px-3 py-1 text-xs text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Self-hosted recipe API • Supabase powered
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
            All your messaging apps
            <br />
            <span className="text-indigo-gradient">in one place</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            SocialManager is a free, open-source desktop app that combines WhatsApp,
            Telegram, Discord, Slack, Gmail, and 300+ more services into a single
            unified inbox. This is the recipe API that powers it.
          </p>

          <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
            <li className="inline-flex items-center gap-2">
              <span className="text-indigo-400">✓</span> 310+ recipes
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Cross-device sync
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Custom recipe uploads
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Open source
            </li>
          </ul>
        </section>

        {/* ============ FEATURES ============ */}
        <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-indigo-900/40 bg-white/5 p-6 backdrop-blur">
              <div className="text-2xl">📦</div>
              <h3 className="mt-3 font-semibold text-white">310+ Recipes</h3>
              <p className="mt-1 text-sm text-slate-400">
                Mirror of the Ferdium recipe catalog, served from your own Supabase storage.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-900/40 bg-white/5 p-6 backdrop-blur">
              <div className="text-2xl">🔌</div>
              <h3 className="mt-3 font-semibold text-white">Public API</h3>
              <p className="mt-1 text-sm text-slate-400">
                <code className="rounded bg-indigo-950/60 px-1.5 py-0.5 text-indigo-200">GET /api/v1/recipes</code>
                {' '}— no auth, no rate-limit headaches.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-900/40 bg-white/5 p-6 backdrop-blur">
              <div className="text-2xl">🛡️</div>
              <h3 className="mt-3 font-semibold text-white">Self-hosted</h3>
              <p className="mt-1 text-sm text-slate-400">
                Deploy to Vercel in one click. Your recipes, your storage, your rules.
              </p>
            </div>
          </div>
        </section>

        {/* ============ API ENDPOINTS ============ */}
        <section id="recipes" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-2xl border border-indigo-900/40 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">API endpoints</h2>
            <p className="mt-1 text-sm text-slate-400">
              All public endpoints are open — no auth, no API key required.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-3 text-slate-300">
                <code className="rounded bg-indigo-950/60 px-2 py-1 text-indigo-200">GET /api/v1/recipes</code>
                <span className="text-slate-400">— list all approved recipes</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <code className="rounded bg-indigo-950/60 px-2 py-1 text-indigo-200">GET /api/v1/recipes/search?q=whatsapp</code>
                <span className="text-slate-400">— search by name</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <code className="rounded bg-indigo-950/60 px-2 py-1 text-indigo-200">GET /api/v1/recipes/popular</code>
                <span className="text-slate-400">— top downloads</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <code className="rounded bg-indigo-950/60 px-2 py-1 text-indigo-200">GET /api/v1/recipes/download/[id]</code>
                <span className="text-slate-400">— download .tar.gz package</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="mx-auto max-w-6xl px-6 pb-10 pt-6 text-center text-xs text-slate-500">
          <p>SocialManager API · Open source · MIT licensed</p>
        </footer>
      </div>
    </div>
  )
}
