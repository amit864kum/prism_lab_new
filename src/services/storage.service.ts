import { mkdir, rename } from 'fs/promises'
import { join } from 'path'
import type { StorageCategory } from '@/config/storage'
import type { PreparedUpload, UploadKind, UploadResult } from '@/types/upload'
import { deleteStoredFile } from '@/lib/storage/delete'
import {
  normalizeStorageCategory,
  parseStorageUrl,
  resolveInside,
  storageRoot,
  storageUrl,
  tempStorageRoot,
} from '@/lib/storage/path'
import { readStoredFile } from '@/lib/storage/read'
import { intendedCategoryFromTemporaryFilename, stageUpload } from '@/lib/storage/upload'
import { uploadLogger } from '@/lib/logger'

export function uploadFile(file: File, kind: UploadKind, requestedCategory: string): Promise<UploadResult> {
  return stageUpload(file, kind, requestedCategory)
}

export async function prepareUploadForPersistence(
  url: string | null | undefined,
  category: StorageCategory
): Promise<PreparedUpload> {
  if (!url) return { url: url || undefined, promoted: false }

  const parsed = parseStorageUrl(url)
  if (!parsed || parsed.directory !== 'temp') return { url, promoted: false }
  if (intendedCategoryFromTemporaryFilename(parsed.filename) !== category) {
    throw new Error('Uploaded file category does not match the destination field')
  }

  const source = resolveInside(tempStorageRoot, [parsed.filename])
  const destinationRoot = join(storageRoot, category)
  const destination = resolveInside(destinationRoot, [parsed.filename])
  if (!source || !destination) throw new Error('Invalid staged upload path')

  await mkdir(destinationRoot, { recursive: true })
  await rename(source, destination)
  return { url: storageUrl(category, parsed.filename), promoted: true }
}

export async function prepareUploadsForPersistence(
  uploads: readonly { url?: string | null; category: StorageCategory }[]
) {
  const prepared: PreparedUpload[] = []
  try {
    for (const upload of uploads) {
      prepared.push(await prepareUploadForPersistence(upload.url, upload.category))
    }
    return prepared
  } catch (error) {
    await rollbackPreparedUploads(prepared)
    throw error
  }
}

export async function rollbackPreparedUpload(upload: PreparedUpload) {
  if (upload.promoted) await removeStoredFile(upload.url)
}

export async function rollbackPreparedUploads(uploads: readonly PreparedUpload[]) {
  await Promise.all(uploads.map(rollbackPreparedUpload))
}

export async function removeStoredFile(url?: string | null) {
  try {
    return await deleteStoredFile(url)
  } catch (error) {
    uploadLogger.error('Stored file deletion failed', { error })
    return false
  }
}

export async function replaceStoredFile(previousUrl?: string | null, nextUrl?: string | null) {
  if (previousUrl && previousUrl !== nextUrl) await removeStoredFile(previousUrl)
}

export { normalizeStorageCategory, readStoredFile }
