import { randomUUID } from 'crypto'
import { mkdir, rename, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import type { StorageCategory } from '@/config/storage'
import type { UploadKind, UploadResult } from '@/types/upload'
import { prepareImageForStorage } from './compress'
import { normalizeStorageCategory, storageUrl, tempStorageRoot } from './path'
import { validateUpload } from './validator'
import { uploadLogger } from '@/lib/logger'

const PDF_CATEGORIES = new Set<StorageCategory>(['publications', 'resumes'])

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

  await mkdir(tempStorageRoot, { recursive: true })
  const filename = `${category}__${randomUUID()}.${validation.extension}`
  const temporaryPath = join(tempStorageRoot, `.${filename}.writing`)
  const finalTemporaryPath = join(tempStorageRoot, filename)
  const buffer = kind === 'image' ? await prepareImageForStorage(validation.buffer) : validation.buffer

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
