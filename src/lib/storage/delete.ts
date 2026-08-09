import { unlink } from 'fs/promises'
import { parseStorageUrl, resolveInside, storageRoot, legacyStorageRoot } from './path'

export async function deleteStoredFile(url?: string | null) {
  const parsed = parseStorageUrl(url)
  if (!parsed) return false

  const segments = [parsed.directory, parsed.filename]
  const candidates = [resolveInside(storageRoot, segments), resolveInside(legacyStorageRoot, segments)]

  let deleted = false
  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      await unlink(candidate)
      deleted = true
    } catch (error: any) {
      if (error?.code !== 'ENOENT') throw error
    }
  }
  return deleted
}
