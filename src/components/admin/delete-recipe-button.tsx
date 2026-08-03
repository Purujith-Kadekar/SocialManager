'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteRecipeButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm(`Delete recipe "${name}"? This also removes the .tar.gz from storage.`)) {
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/recipes?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? `HTTP ${res.status}`)
        setBusy(false)
        return
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setBusy(false)
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      >
        {busy ? 'Deleting…' : 'Delete'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  )
}
