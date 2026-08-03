import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminUploadPage() {
  await requireAdmin()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Upload custom recipe</h1>
      <p className="mt-2 text-sm text-slate-600">
        Upload a .tar.gz recipe package. Max size 50 MB.
      </p>
      <form className="mt-8 space-y-4" action="/api/admin/recipes" method="POST" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-slate-700">Recipe ID</label>
          <input
            type="text"
            name="id"
            required
            placeholder="e.g. my-custom-service"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Display name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. My Custom Service"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Description (optional)</label>
          <input
            type="text"
            name="description"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">.tar.gz file</label>
          <input
            type="file"
            name="file"
            accept=".tar.gz,.tgz,application/gzip"
            required
            className="mt-1 block w-full text-sm text-slate-700"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Upload recipe
        </button>
      </form>
    </main>
  )
}
