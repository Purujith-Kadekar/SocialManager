/**
 * Release Upload Script
 * ======================
 * Uploads a built SocialManager-Setup-x.x.x.exe to the public
 * `app-releases` Supabase Storage bucket, and records it in the
 * `app_releases` table so the /download page and API always show the
 * latest version without needing a code change.
 *
 * Run this once per release, after building the installer locally.
 *
 * Usage:
 *   npm run upload-release -- /path/to/SocialManager-Setup-1.0.0.exe 1.0.0
 *   npm run upload-release -- /path/to/SocialManager-Setup-1.0.0.exe 1.0.0 "Fixed maximize clipping, added installer retry logic"
 *
 * Required env vars (loaded from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { existsSync, readFileSync, statSync } from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucket      = 'app-releases'

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const [, , filePath, version, releaseNotes] = process.argv

if (!filePath || !version) {
  console.error('Usage: npm run upload-release -- /path/to/SocialManager-Setup-x.x.x.exe <version> ["release notes"]')
  process.exit(1)
}

if (!existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const fileSizeBytes = statSync(filePath).size
  const storagePath = `SocialManager-Setup-${version}.exe`

  console.log(`📦 Uploading ${storagePath} (${(fileSizeBytes / 1024 / 1024).toFixed(1)} MB)...`)

  const { error: uploadError } = await supabase
    .storage
    .from(bucket)
    .upload(storagePath, readFileSync(filePath), {
      contentType: 'application/x-msdownload',
      upsert: true,
    })

  if (uploadError) {
    console.error('❌ Upload failed:', uploadError.message)
    process.exit(1)
  }
  console.log('✅ Uploaded to storage')

  // Only one release should be "latest" at a time.
  const { error: clearError } = await supabase
    .from('app_releases')
    .update({ is_latest: false })
    .eq('platform', 'windows')
    .eq('is_latest', true)

  if (clearError) {
    console.error('⚠️  Failed to clear previous latest flag:', clearError.message)
  }

  const { error: insertError } = await supabase
    .from('app_releases')
    .insert({
      platform: 'windows',
      version,
      storage_path: storagePath,
      file_size_bytes: fileSizeBytes,
      release_notes: releaseNotes ?? null,
      is_latest: true,
    })

  if (insertError) {
    console.error('❌ Failed to record release:', insertError.message)
    process.exit(1)
  }

  console.log(`✅ v${version} is now the latest release`)
  console.log(`   Download page will now serve this build automatically.`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
