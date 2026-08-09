export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export type UploadKind = 'image' | 'pdf'

export interface ValidatedUpload {
  buffer: Buffer
  extension: string
  mimeType: string
  size: number
}

export interface PreparedUpload {
  url?: string
  promoted: boolean
}
