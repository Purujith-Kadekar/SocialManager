import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

async function getLatestRelease() {
  const supabase = createAdminClient()

  const { data: release } = await supabase
    .from('app_releases')
    .select('version, storage_path, file_size_bytes, release_notes, created_at')
    .eq('platform', 'windows')
    .eq('is_latest', true)
    .single()

  if (!release) return null

  const { data: urlData } = supabase
    .storage
    .from('app-releases')
    .getPublicUrl(release.storage_path)

  return {
    version: release.version as string,
    downloadUrl: urlData.publicUrl,
    fileSizeBytes: release.file_size_bytes as number | null,
    releaseNotes: release.release_notes as string | null,
    releasedAt: release.created_at as string,
  }
}

export default async function DownloadPage() {
  const release = await getLatestRelease()

  return (
    <div className="relative min-h-screen overflow-hidden bg-indigo-radial">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-indigo-gradient" />

      <div className="relative">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-gradient shadow-lg shadow-indigo-900/40">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-white">SocialManager</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="/#features" className="transition hover:text-white">Features</a>
            <a href="/#recipes" className="transition hover:text-white">Recipes</a>
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

        <section className="mx-auto max-w-2xl px-6 pb-24 pt-16 text-center sm:pt-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-700/40 bg-indigo-900/20 px-4 py-1.5 text-sm text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
            Windows
          </div>

          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Download SocialManager
          </h1>

          {release ? (
            <>
              <p className="mt-4 text-slate-400">
                Version {release.version}
                {release.fileSizeBytes ? ` · ${(release.fileSizeBytes / 1024 / 1024).toFixed(0)} MB` : ''}
              </p>

              <a
                href={release.downloadUrl}
                download
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-gradient px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-900/40 transition hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14" />
                </svg>
                Download for Windows
              </a>

              {release.releaseNotes && (
                <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-left">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    What&apos;s new in {release.version}
                  </p>
                  <p className="text-sm text-slate-300">{release.releaseNotes}</p>
                </div>
              )}

              <div className="mt-10 rounded-xl border border-amber-900/30 bg-amber-950/20 p-5 text-left">
                <p className="mb-1 text-sm font-semibold text-amber-400">
                  Windows may show a &quot;Windows protected your PC&quot; warning
                </p>
                <p className="text-sm text-slate-400">
                  This is expected for an app without a paid code-signing certificate,
                  not a sign anything is wrong. Click <strong className="text-slate-300">More info</strong> →{' '}
                  <strong className="text-slate-300">Run anyway</strong> to continue.
                </p>
              </div>
            </>
          ) : (
            <p className="mt-6 text-slate-400">
              No release is available yet. Check back soon.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
