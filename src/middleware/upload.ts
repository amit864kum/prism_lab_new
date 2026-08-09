import { NextRequest, NextResponse } from 'next/server'
import { MAX_UPLOAD_SIZE_BYTES } from '@/constants/upload'

const MULTIPART_OVERHEAD_ALLOWANCE = 1024 * 1024

export function enforceUploadRequestLimit(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_SIZE_BYTES + MULTIPART_OVERHEAD_ALLOWANCE) {
    return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
  }
  return null
}
