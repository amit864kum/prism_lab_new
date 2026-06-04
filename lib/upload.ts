import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_PDF_TYPES = ['application/pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function validateFile(
  file: File,
  type: 'image' | 'pdf'
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }

  // Check file type
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_PDF_TYPES
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    }
  }

  return { valid: true }
}

export async function uploadFile(
  file: File,
  type: 'image' | 'pdf',
  subfolder?: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = await validateFile(file, type)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${ext}`

    // Determine target directory
    let targetDir = UPLOAD_DIR
    if (subfolder) {
      targetDir = join(UPLOAD_DIR, subfolder)
      if (!existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true })
      }
    }

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filepath = join(targetDir, filename)
    await writeFile(filepath, buffer)

    // Return relative URL
    const url = subfolder ? `/uploads/${subfolder}/${filename}` : `/uploads/${filename}`
    return { success: true, url }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
