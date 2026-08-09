import { resolve, relative, sep } from 'path'
import {
  LEGACY_STORAGE_CATEGORY_ALIASES,
  STORAGE_CATEGORIES,
  STORAGE_ROOT_DIRECTORY,
  STORAGE_ROUTE_PREFIX,
  TEMP_UPLOAD_DIRECTORY,
  type StorageCategory,
} from '@/config/storage'

export const storageRoot = process.env.UPLOADS_ROOT
  ? resolve(/* turbopackIgnore: true */ process.env.UPLOADS_ROOT)
  : resolve(process.cwd(), 'uploads')
export const legacyStorageRoot = resolve(process.cwd(), 'public', 'uploads')
export const tempStorageRoot = resolve(/* turbopackIgnore: true */ storageRoot, 'temp')

export function normalizeStorageCategory(value: string | null | undefined): StorageCategory | null {
  if (!value) return null
  if ((STORAGE_CATEGORIES as readonly string[]).includes(value)) return value as StorageCategory
  return LEGACY_STORAGE_CATEGORY_ALIASES[value] || null
}

export function isPathInside(root: string, candidate: string) {
  const pathFromRoot = relative(root, candidate)
  return pathFromRoot === '' || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== '..')
}

export function resolveInside(root: string, segments: readonly string[]) {
  const candidate = resolve(root, ...segments)
  return isPathInside(root, candidate) ? candidate : null
}

export function storageUrl(category: StorageCategory | typeof TEMP_UPLOAD_DIRECTORY, filename: string) {
  return `${STORAGE_ROUTE_PREFIX}${category}/${filename}`
}

export function parseStorageUrl(url?: string | null) {
  if (!url?.startsWith(STORAGE_ROUTE_PREFIX)) return null
  const segments = url.slice(STORAGE_ROUTE_PREFIX.length).split('/').filter(Boolean)
  if (segments.length !== 2 || segments.some((segment) => segment === '.' || segment === '..')) {
    return null
  }
  return { directory: segments[0], filename: segments[1] }
}
