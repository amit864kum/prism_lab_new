import { readFile, stat } from 'fs/promises'
import { extname } from 'path'
import { parseStorageUrl, resolveInside, storageRoot, legacyStorageRoot } from './path'

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
}

const LEGACY_FILE_ALIASES: Readonly<Record<string, string>> = {
  '/uploads/logos/1781192510738-el6a73.png': '/uploads/logos/1781176012722-0v9lgt.png',
}

export async function readStoredFile(url: string) {
  const parsed = parseStorageUrl(LEGACY_FILE_ALIASES[url] || url)
  if (!parsed) return null
  const contentType = CONTENT_TYPES[extname(parsed.filename).toLowerCase()]
  if (!contentType) return null

  for (const root of [storageRoot, legacyStorageRoot]) {
    const filePath = resolveInside(root, [parsed.directory, parsed.filename])
    if (!filePath) continue
    try {
      const [buffer, details] = await Promise.all([readFile(filePath), stat(filePath)])
      if (!details.isFile()) return null
      return { buffer, contentType, size: details.size, modifiedAt: details.mtime }
    } catch (error: any) {
      if (error?.code !== 'ENOENT') throw error
    }
  }
  return null
}
