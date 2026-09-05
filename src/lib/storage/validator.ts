import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_PDF_EXTENSIONS,
  ALLOWED_PDF_MIME_TYPES,
  MAX_IMAGE_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_BYTES,
} from '@/constants/upload'
import type { FileValidationResult, UploadKind, ValidatedUpload } from '@/types/upload'
import { hasValidImageSignature } from './image'
import { prepareSafePdf } from './pdf'

function extensionOf(filename: string) {
  return (filename.split('.').pop() || '').trim().toLowerCase()
}

export function validateFile(file: File, kind: UploadKind): FileValidationResult {
  const maximumSize = kind === 'image' ? MAX_IMAGE_UPLOAD_SIZE_BYTES : MAX_UPLOAD_SIZE_BYTES
  if (file.size > maximumSize) {
    return { valid: false, error: `File size exceeds ${kind === 'image' ? '2MB' : '10MB'} limit` }
  }

  const extension = extensionOf(file.name)
  const allowedMimeTypes = kind === 'image' ? ALLOWED_IMAGE_MIME_TYPES : ALLOWED_PDF_MIME_TYPES
  const allowedExtensions = kind === 'image' ? ALLOWED_IMAGE_EXTENSIONS : ALLOWED_PDF_EXTENSIONS
  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}` }
  }
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}` }
  }
  return { valid: true }
}

export async function validateUpload(file: File, kind: UploadKind): Promise<
  | ({ valid: true; error?: undefined } & ValidatedUpload)
  | ({ valid: false } & FileValidationResult)
> {
  if (file.size <= 0) return { valid: false, error: 'File is empty' }
  const metadata = validateFile(file, kind)
  if (!metadata.valid) return { valid: false, error: metadata.error }

  const extension = extensionOf(file.name)
  const buffer = Buffer.from(await file.arrayBuffer())
  if (kind === 'image' && !hasValidImageSignature(buffer, extension)) {
    return { valid: false, error: 'File content does not match its declared type' }
  }

  const safeBuffer = kind === 'pdf' ? await prepareSafePdf(buffer) : buffer
  if (!safeBuffer) return { valid: false, error: 'PDF structure or active content is not allowed' }

  return { valid: true, buffer: safeBuffer, extension, mimeType: file.type, size: safeBuffer.length }
}
