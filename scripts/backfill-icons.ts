/**
 * Icon Backfill Script
 * ====================
 * For recipes that already exist in the DB with icon_url = null (i.e. every
 * recipe synced before the icon fix), this fetches each recipe's icon.svg
 * from the ferdium-recipes GitHub archive, uploads it to the public
 * `recipe-icons` bucket, and UPDATEs the row's icon_url.
 *
 * This does NOT touch recipe-packages, does NOT re-insert or duplicate any
 * rows, and does NOT re-download recipe tarballs — it's icon-only, additive,
 * and safe to run against a DB that already has recipes.
 *
 * Prereq: run supabase/migrations/0002_recipe_icons_bucket.sql first.
 *
 * Usage:
 *   npm run backfill-icons
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import * as tar from 'tar'

const GITHUB_ARCHIVE_URL  = 'https://github.com/ferdium/ferdium-recipes/archive/refs/heads/main.tar.gz'
const ARCHIVE_ROOT_FOLDER = 'ferdium-recipes-main'
const RECIPES_SUBPATH     = 'recipes'
const ICON_FILENAMES      = ['icon.svg', 'icon.png']

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
const iconBucket  = process.env.SUPABASE_ICON_BUCKET ?? 'recipe-icons'

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SocialManager-IconBackfill/1.0', 'Accept': '*/*' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  if (!res.body) throw new Error(`No response body for ${url}`)
  await pipeline(res.body as unknown as NodeJS.ReadableStream, createWriteStream(dest))
}

async function main() {
  console.log('🚀 Starting icon backfill...')

  // 1. Which recipes actually need an icon?
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id')
    .is('icon_url', null)

  if (error) {
    console.error('❌ Failed to read recipes:', error.message)
    process.exit(1)
  }
  if (!recipes || recipes.length === 0) {
    console.log('✅ Every recipe already has an icon_url. Nothing to do.')
    process.exit(0)
  }
  console.log(`📊 ${recipes.length} recipes missing an icon`)

  // 2. Download + extract the recipe archive (same source as sync-recipes.ts)
  const tmpRoot = join(tmpdir(), `socialmanager-icon-backfill-${Date.now()}`)
  mkdirSync(tmpRoot, { recursive: true })
  const archiveTarball = join(tmpRoot, 'ferdium-recipes.tar.gz')
  const extractDir     = join(tmpRoot, 'extracted')

  console.log('📥 Downloading ferdium-recipes archive (~9 MB)...')
  await downloadFile(GITHUB_ARCHIVE_URL, archiveTarball)
  mkdirSync(extractDir, { recursive: true })
  await tar.x({ file: archiveTarball, cwd: extractDir })

  const recipesDir = join(extractDir, ARCHIVE_ROOT_FOLDER, RECIPES_SUBPATH)
  if (!existsSync(recipesDir)) {
    console.error(`❌ Expected recipes folder not found at: ${recipesDir}`)
    process.exit(1)
  }
  console.log('✅ Archive ready')
  console.log('')

  // 3. Upload icon + update DB row, one at a time
  let updated = 0
  let noIcon  = 0
  let failed  = 0

  for (let i = 0; i < recipes.length; i++) {
    const recipeId = recipes[i].id
    const progress = `[${i + 1}/${recipes.length}]`
    const recipeFolder = join(recipesDir, recipeId)

    if (!existsSync(recipeFolder)) {
      console.log(`${progress} ⚠️  ${recipeId} — folder not in archive (renamed/removed upstream?), skipping`)
      noIcon++
      continue
    }

    let iconUrl: string | null = null
    for (const filename of ICON_FILENAMES) {
      const iconPath = join(recipeFolder, filename)
      if (!existsSync(iconPath)) continue

      const ext = filename.split('.').pop()!
      const storagePath = `${recipeId}.${ext}`
      const { error: uploadError } = await supabase
        .storage
        .from(iconBucket)
        .upload(storagePath, readFileSync(iconPath), {
          contentType: ext === 'svg' ? 'image/svg+xml' : 'image/png',
          upsert: true,
        })

      if (uploadError) {
        console.log(`${progress} ❌ ${recipeId} — icon upload failed: ${uploadError.message}`)
        failed++
        break
      }

      const { data } = supabase.storage.from(iconBucket).getPublicUrl(storagePath)
      iconUrl = data.publicUrl
      break
    }

    if (!iconUrl) {
      if (failed === 0 || true) {
        console.log(`${progress} ⚠️  ${recipeId} — no icon.svg/icon.png in this recipe's folder`)
      }
      noIcon++
      continue
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ icon_url: iconUrl })
      .eq('id', recipeId)

    if (updateError) {
      console.log(`${progress} ❌ ${recipeId} — DB update failed: ${updateError.message}`)
      failed++
      continue
    }

    updated++
    console.log(`${progress} ✅ ${recipeId}`)

    if ((i + 1) % 25 === 0) {
      await new Promise(r => setTimeout(r, 150))
    }
  }

  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Icon backfill complete!')
  console.log(`   ✅ Updated:    ${updated}`)
  console.log(`   ⚠️  No icon:    ${noIcon}`)
  console.log(`   ❌ Failed:     ${failed}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  rmSync(tmpRoot, { recursive: true, force: true })
  process.exit(0)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
