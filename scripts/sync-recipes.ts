/**
 * Recipe Sync Script (v2 — GitHub archive source)
 * ================================================
 * The Ferdium API at https://api.ferdium.org/v1/recipes/download/{id} is
 * currently returning HTTP 400 "Recipe not found" for every recipe, so we
 * pull the canonical recipe source code directly from GitHub instead.
 *
 * Strategy:
 *   1. Fetch the recipe catalog from api.ferdium.org (gives us the canonical
 *      `featured` flag + the 310 "official" recipe IDs).
 *   2. Download the entire ferdium-recipes repo as a single tarball from
 *      GitHub (~9 MB, one request).
 *   3. Extract to a temp dir.
 *   4. For each recipe folder, read its package.json + repack the folder as
 *      {id}.tar.gz (the format the SocialManager desktop app expects).
 *   5. Upload to Supabase Storage + insert metadata into Postgres.
 *
 * Usage:
 *   npm run sync-recipes
 *
 * Environment variables required (loaded from .env.local automatically):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_STORAGE_BUCKET (default: recipe-packages)
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local (Next.js convention) — tsx does not auto-load env files.
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import * as tar from 'tar'

// --- Config ---
const FERDIUM_CATALOG_URL = 'https://api.ferdium.org/v1/recipes'
const GITHUB_ARCHIVE_URL  = 'https://github.com/ferdium/ferdium-recipes/archive/refs/heads/main.tar.gz'
const ARCHIVE_ROOT_FOLDER = 'ferdium-recipes-main'  // GitHub names it {repo}-{ref}/
const RECIPES_SUBPATH     = 'recipes'                // .../recipes/{id}/ inside archive

// --- Supabase client ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucket      = process.env.SUPABASE_STORAGE_BUCKET ?? 'recipe-packages'

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// --- Types ---
type FerdiumRecipe = {
  id: string
  name: string
  version?: string
  featured?: boolean
  icons?: { svg?: string; png?: string }
  [key: string]: unknown
}

type RecipePackageJson = {
  id: string
  name: string
  version: string
  description?: string
  author?: string | { name?: string; email?: string; url?: string }
  license?: string
  config?: {
    serviceURL?: string
    hasDirectMessages?: boolean
    hasIndirectMessages?: boolean
    hasNotificationSound?: boolean
    hasTeamId?: boolean
    hasCustomUrl?: boolean
    hasHostedOption?: boolean
    hasCallServices?: boolean
  }
}

// --- Helpers ---
async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url, {
    headers: {
      // Some hosts (Ferdium, GitHub) reject bare Node fetch UA
      'User-Agent': 'SocialManager-RecipeSync/1.0',
      'Accept': '*/*',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  if (!res.body) throw new Error(`No response body for ${url}`)
  await pipeline(res.body as unknown as NodeJS.ReadableStream, createWriteStream(dest))
}

function getAuthorString(author?: RecipePackageJson['author']): string | null {
  if (!author) return null
  if (typeof author === 'string') return author
  return author.name ?? author.url ?? null
}

// --- Main ---
async function main() {
  console.log('🚀 Starting SocialManager recipe sync (GitHub source)...')
  console.log(`   Source:  ${GITHUB_ARCHIVE_URL}`)
  console.log(`   Target:  ${supabaseUrl}`)
  console.log('')

  // 1. OPTIONAL: fetch Ferdium catalog for the `featured` flag.
  // If Ferdium is rate-limiting you (HTTP 403/429 — common after a failed run),
  // we just skip it and treat every recipe as non-featured. Not a big deal.
  let featuredIds = new Set<string>()
  let catalogIds  = new Set<string>()
  console.log('📥 Fetching Ferdium recipe catalog (optional, for featured flag)...')
  try {
    const catalogRes = await fetch(FERDIUM_CATALOG_URL, {
      headers: { 'User-Agent': 'SocialManager-RecipeSync/1.0' },
    })
    if (!catalogRes.ok) {
      throw new Error(`HTTP ${catalogRes.status}`)
    }
    const catalog: FerdiumRecipe[] = await catalogRes.json()
    featuredIds = new Set(catalog.filter(r => r.featured).map(r => r.id))
    catalogIds  = new Set(catalog.map(r => r.id))
    console.log(`✅ Catalog fetched: ${catalog.length} recipes (${featuredIds.size} featured)`)
  } catch (err) {
    console.log(`⚠️  Catalog fetch failed (${err instanceof Error ? err.message : 'unknown'}) — continuing without it.`)
    console.log(`    Featured flags will be false for all recipes. Re-run later to restore them.`)
  }
  console.log('')

  // 2. Download the GitHub archive once
  const tmpRoot = join(tmpdir(), `socialmanager-sync-${Date.now()}`)
  mkdirSync(tmpRoot, { recursive: true })
  const archiveTarball = join(tmpRoot, 'ferdium-recipes.tar.gz')
  const extractDir     = join(tmpRoot, 'extracted')

  console.log('📥 Downloading ferdium-recipes archive (~9 MB)...')
  await downloadFile(GITHUB_ARCHIVE_URL, archiveTarball)
  console.log(`✅ Downloaded ${(statSync(archiveTarball).size / 1024 / 1024).toFixed(1)} MB`)

  // 3. Extract
  console.log('📂 Extracting archive...')
  mkdirSync(extractDir, { recursive: true })
  await tar.x({
    file: archiveTarball,
    cwd:  extractDir,
  })
  const recipesDir = join(extractDir, ARCHIVE_ROOT_FOLDER, RECIPES_SUBPATH)
  if (!existsSync(recipesDir)) {
    console.error(`❌ Expected recipes folder not found at: ${recipesDir}`)
    console.error('   Archive layout may have changed. Inspect:')
    console.error(`   tar -tzf ${archiveTarball} | head -20`)
    process.exit(1)
  }

  // 4. List all recipe folders in the archive
  const allRecipeFolders = readdirSync(recipesDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name)
  console.log(`✅ Found ${allRecipeFolders.length} recipe folders in archive`)
  console.log('')

  // 5. Check existing recipes in DB
  const { data: existing } = await supabase.from('recipes').select('id')
  const existingIds = new Set((existing ?? []).map((r: { id: string }) => r.id))
  const toSync = allRecipeFolders.filter(id => !existingIds.has(id))
  const skipped = allRecipeFolders.length - toSync.length
  console.log(`📊 ${toSync.length} new recipes to sync (${skipped} already in DB)`)
  console.log('')

  if (toSync.length === 0) {
    console.log('✅ All recipes are already synced. Nothing to do.')
    await rmSync(tmpRoot, { recursive: true, force: true })
    return
  }

  // 6. Sync each recipe
  let success = 0
  let failed  = 0
  let totalBytes = 0

  for (let i = 0; i < toSync.length; i++) {
    const recipeId = toSync[i]
    const progress = `[${i + 1}/${toSync.length}]`
    const recipeFolder = join(recipesDir, recipeId)

    try {
      // Read package.json for accurate metadata
      const pkgPath = join(recipeFolder, 'package.json')
      if (!existsSync(pkgPath)) {
        console.log(`${progress} ⚠️  SKIP ${recipeId} — no package.json in folder`)
        failed++
        continue
      }
      const pkg: RecipePackageJson = JSON.parse(readFileSync(pkgPath, 'utf8'))

      // Pack the recipe folder into {id}.tar.gz.
      // The SocialManager desktop app extracts this directly into a temp dir
      // and then reads `package.json` from the root, so we pack the *contents*
      // of the recipe folder (cwd = recipe folder), not the folder itself.
      const localTarball = join(tmpRoot, `${recipeId}.tar.gz`)
      const filesInFolder = readdirSync(recipeFolder).filter(f => !f.startsWith('.'))
      await tar.c({
        gzip: true,
        file:  localTarball,
        cwd:   recipeFolder,
      }, filesInFolder)

      const fileBytes = statSync(localTarball).size
      const sizeKB = (fileBytes / 1024).toFixed(0)
      totalBytes += fileBytes

      // Read back as buffer for Supabase upload
      const fileBuffer = readFileSync(localTarball)

      const storagePath = `${recipeId}.tar.gz`
      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType: 'application/gzip',
          upsert: false,
        })

      if (uploadError) {
        console.log(`${progress} ⚠️  SKIP ${recipeId} — storage upload failed: ${uploadError.message}`)
        failed++
        continue
      }

      // Insert into DB
      const isFeatured = featuredIds.has(recipeId)
      const isOfficial = catalogIds.has(recipeId)
      const cfg = pkg.config ?? {}

      const { error: dbError } = await supabase
        .from('recipes')
        .insert({
          id: pkg.id || recipeId,
          name: pkg.name,
          description: pkg.description ?? null,
          category: 'other',
          author: getAuthorString(pkg.author),
          website: null,
          icon_url: null,
          is_featured: isFeatured,
          is_official: isOfficial,
          is_custom: false,
          is_approved: true,
          storage_path: storagePath,
          file_size_bytes: fileBytes,
          recipe_metadata: {
            version: pkg.version,
            license: pkg.license ?? null,
            hasDirectMessages: cfg.hasDirectMessages ?? false,
            hasIndirectMessages: cfg.hasIndirectMessages ?? false,
            hasNotificationSound: cfg.hasNotificationSound ?? false,
            hasTeamId: cfg.hasTeamId ?? false,
            hasCustomUrl: cfg.hasCustomUrl ?? false,
            hasHostedOption: cfg.hasHostedOption ?? false,
            hasCallServices: cfg.hasCallServices ?? false,
            serviceURL: cfg.serviceURL ?? null,
          },
        })

      if (dbError) {
        console.log(`${progress} ⚠️  SKIP ${recipeId} — DB insert failed: ${dbError.message}`)
        await supabase.storage.from(bucket).remove([storagePath])
        failed++
        continue
      }

      success++
      console.log(`${progress} ✅ ${(pkg.id || recipeId).padEnd(30)} ${sizeKB.padStart(6)} KB  ${pkg.name}`)
    } catch (err) {
      console.log(`${progress} ❌ ${recipeId} — ${err instanceof Error ? err.message : 'unknown error'}`)
      failed++
    }

    // Tiny delay every 25 recipes to be nice to Supabase
    if ((i + 1) % 25 === 0) {
      await new Promise(r => setTimeout(r, 200))
    }
  }

  // 7. Summary
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Sync complete!')
  console.log(`   ✅ Synced:  ${success}`)
  console.log(`   ⚠️  Skipped: ${failed}`)
  console.log(`   💾 Total:   ${(totalBytes / 1024 / 1024).toFixed(2)} MB uploaded`)
  console.log(`   📦 Total recipes in DB: ${existingIds.size + success}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Cleanup
  rmSync(tmpRoot, { recursive: true, force: true })

  // Force clean exit — Node on Windows sometimes throws a libuv assertion
  // ("!(handle->flags & UV_HANDLE_CLOSING)") if there are pending async
  // handles (Supabase client keep-alive sockets, etc.) when the process exits.
  process.exit(0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
