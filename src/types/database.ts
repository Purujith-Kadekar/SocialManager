export const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB

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
  storage_path: string
  file_size_bytes: number
  recipe_metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}
