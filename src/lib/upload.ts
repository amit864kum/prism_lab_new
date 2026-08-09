// Backward-compatible exports while callers migrate to the storage service.
export { uploadFile, removeStoredFile as deleteUploadedFile } from '@/services/storage.service'
export { validateFile } from '@/lib/storage/validator'
export type { UploadResult } from '@/types/upload'

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
