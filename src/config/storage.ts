export const STORAGE_ROOT_DIRECTORY = 'uploads'
export const LEGACY_PUBLIC_UPLOAD_PREFIX = '/uploads/'
export const TEMP_UPLOAD_DIRECTORY = 'temp'

export const STORAGE_CATEGORIES = [
  'hero',
  'members',
  'principal-investigator',
  'research',
  'gallery',
  'news',
  'sponsors',
  'publications',
  'resumes',
  'projects',
  'logos',
] as const

export type StorageCategory = (typeof STORAGE_CATEGORIES)[number]

export const LEGACY_STORAGE_CATEGORY_ALIASES: Readonly<Record<string, StorageCategory>> = {
  pi: 'principal-investigator',
  'research-areas': 'research',
}

export const STORAGE_ROUTE_PREFIX = '/uploads/'
