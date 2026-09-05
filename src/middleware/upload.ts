import { NextRequest, NextResponse } from 'next/server'
import { MAX_UPLOAD_SIZE_BYTES } from '@/constants/upload'

const MULTIPART_OVERHEAD_ALLOWANCE = 1024 * 1024
const MAX_JSON_REQUEST_SIZE_BYTES = 1024 * 1024

export function enforceApiRequestLimit(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname === '/api/upload') {
    return null
  }
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_REQUEST_SIZE_BYTES) {
    return NextResponse.json({ error: 'Request body exceeds 1MB limit' }, { status: 413 })
  }
  return null
}

export function enforceUploadRequestLimit(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_SIZE_BYTES + MULTIPART_OVERHEAD_ALLOWANCE) {
    return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 413 })
  }
  return null
}
