import { randomUUID } from 'crypto'
import { mkdir, readdir, rename, stat, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import type { StorageCategory } from '@/config/storage'
import type { UploadKind, UploadResult } from '@/types/upload'
import { prepareImageForStorage } from './compress'
import { normalizeStorageCategory, storageUrl, tempStorageRoot } from './path'
import { validateUpload } from './validator'
import { uploadLogger } from '@/lib/logger'
import {
  MAX_TEMP_UPLOAD_STORAGE_BYTES,
  TEMP_UPLOAD_MAX_AGE_MS,
} from '@/constants/upload'

const PDF_CATEGORIES = new Set<StorageCategory>(['publications', 'resumes'])

export async function cleanAndMeasureTemporaryStorage() {
  await mkdir(tempStorageRoot, { recursive: true })
  const entries = await readdir(tempStorageRoot, { withFileTypes: true })
  const now = Date.now()
  let totalBytes = 0

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const filePath = join(tempStorageRoot, entry.name)
    const details = await stat(filePath).catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return null
      throw error
    })
    if (!details) continue
    if (now - details.mtimeMs > TEMP_UPLOAD_MAX_AGE_MS) {
      await unlink(filePath).catch(() => undefined)
      continue
    }
    totalBytes += details.size
  }
  return totalBytes
}

export async function stageUpload(
  file: File,
  kind: UploadKind,
  requestedCategory: string
): Promise<UploadResult> {
  const category = normalizeStorageCategory(requestedCategory)
  if (!category) return { success: false, error: 'Invalid upload category' }
  if ((kind === 'pdf') !== PDF_CATEGORIES.has(category)) {
    return { success: false, error: 'File type is not allowed for this upload category' }
  }

  const validation = await validateUpload(file, kind)
  if (!validation.valid) return { success: false, error: validation.error }

  let buffer: Buffer
  try {
    buffer = kind === 'image'
      ? await prepareImageForStorage(validation.buffer, validation.extension)
      : validation.buffer
  } catch (error) {
    uploadLogger.warn('Upload normalization rejected content', { category, kind, error })
    return { success: false, error: 'File content could not be safely processed' }
  }

  const stagedBytes = await cleanAndMeasureTemporaryStorage()
  if (stagedBytes + buffer.length > MAX_TEMP_UPLOAD_STORAGE_BYTES) {
    return { success: false, error: 'Temporary upload quota exceeded' }
  }
  const filename = `${category}__${randomUUID()}.${validation.extension}`
  const temporaryPath = join(tempStorageRoot, `.${filename}.writing`)
  const finalTemporaryPath = join(tempStorageRoot, filename)
  try {
    await writeFile(temporaryPath, buffer, { flag: 'wx' })
    await rename(temporaryPath, finalTemporaryPath)
    return { success: true, url: storageUrl('temp', filename) }
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined)
    uploadLogger.error('Upload write failed', { category, kind, error })
    return { success: false, error: 'Failed to upload file' }
  }
}

export function intendedCategoryFromTemporaryFilename(filename: string): StorageCategory | null {
  const category = filename.slice(0, filename.indexOf('__'))
  return normalizeStorageCategory(category)
}
