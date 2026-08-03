/**
 * Database types matching the Supabase schema.
 * See supabase/migrations/0001_initial.sql
 */

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type Recipe = {
  id: string
  name: string
  description: string | null
  category: string
  author: string | null
  website: string | null
  icon_url: string | null
  is_featured: boolean
  is_official: boolean
  is_custom: boolean
  is_approved: boolean
  storage_path: string | null
  file_size_bytes: number
  recipe_metadata: RecipeMetadata
  created_at: string
  updated_at: string
}

export type RecipeMetadata = {
  // Ferdium recipe fields (stored as JSON)
  hasDirectMessages?: boolean
  hasIndirectMessages?: boolean
  hasNotificationSound?: boolean
  hasTeamId?: boolean
  hasCustomUrl?: boolean
  hasHostedOption?: boolean
  allowFavoritesDelineationInUnreadCount?: boolean
  isMuted?: boolean
  disablewebsecurity?: boolean
  spellcheckerLanguage?: boolean | string
  // Original Ferdium fields
  [key: string]: unknown
}

export type UserService = {
  id: string
  user_id: string
  recipe_id: string
  service_name: string
  custom_icon_url: string | null
  settings: Record<string, unknown>
  sort_order: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export type StorageUsage = {
  file_count: number
  total_bytes: number
  total_gb: number
  custom_count: number
  official_count: number
}

// 5GB Supabase free tier limit
export const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024 // 5,368,709,120 bytes
