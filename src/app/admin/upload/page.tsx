import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminUploadPage() {
  await requireAdmin()

  return (
    <div className="relative min-h-screen overflow-hidden bg-indigo-radial">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-indigo-gradient" />

      <main className="relative mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold text-white">Upload custom recipe</h1>
        <p className="mt-2 text-sm text-slate-400">
          Upload a .tar.gz recipe package. Max size 50 MB.
        </p>
        <form className="mt-8 space-y-4" action="/api/admin/recipes" method="POST" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-slate-300">Recipe ID</label>
            <input
              type="text"
              name="id"
              required
              placeholder="e.g. my-custom-service"
              className="mt-1 block w-full rounded-md border border-indigo-900/50 bg-indigo-950/40 px-3 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Display name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. My Custom Service"
              className="mt-1 block w-full rounded-md border border-indigo-900/50 bg-indigo-950/40 px-3 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Description (optional)</label>
            <input
              type="text"
              name="description"
              className="mt-1 block w-full rounded-md border border-indigo-900/50 bg-indigo-950/40 px-3 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Icon (optional)</label>
            <input
              type="file"
              name="icon"
              accept=".svg,.png,image/svg+xml,image/png"
              className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-gradient file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />
            <p className="mt-1 text-xs text-slate-500">SVG or PNG. Shown in the desktop app&apos;s recipe list.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">.tar.gz file</label>
            <input
              type="file"
              name="file"
              accept=".tar.gz,.tgz,application/gzip"
              required
              className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-gradient file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-gradient px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-900/40 transition hover:opacity-90"
          >
            Upload recipe
          </button>
        </form>
      </main>
    </div>
  )
}
