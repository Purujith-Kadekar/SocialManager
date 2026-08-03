'use client'

import { useState } from 'react'

export function UploadRecipeForm() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setOk(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/admin/recipes', { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? `HTTP ${res.status}`)
        setBusy(false)
        return
      }
      setOk(`Uploaded "${data?.name ?? formData.get('name')}" successfully.`)
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label className="block text-sm font-medium text-slate-700">Recipe ID</label>
        <input
          type="text"
          name="id"
          required
          disabled={busy}
          placeholder="e.g. my-custom-service"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Display name</label>
        <input
          type="text"
          name="name"
          required
          disabled={busy}
          placeholder="e.g. My Custom Service"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Description (optional)</label>
        <input
          type="text"
          name="description"
          disabled={busy}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">.tar.gz file</label>
        <input
          type="file"
          name="file"
          accept=".tar.gz,.tgz,application/gzip"
          required
          disabled={busy}
          className="mt-1 block w-full text-sm text-slate-700 disabled:bg-slate-50"
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {ok}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Uploading…' : 'Upload recipe'}
      </button>
    </form>
  )
}
