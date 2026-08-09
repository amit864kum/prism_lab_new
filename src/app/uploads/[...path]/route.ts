import { NextRequest, NextResponse } from 'next/server'
import { readStoredFile } from '@/services/storage.service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  if (!Array.isArray(path) || path.length !== 2) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const url = `/uploads/${path.join('/')}`
  const file = await readStoredFile(url)
  if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  const ifModifiedSince = request.headers.get('if-modified-since')
  if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= file.modifiedAt.setMilliseconds(0)) {
    return new NextResponse(null, { status: 304 })
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': String(file.size),
      'Content-Type': file.contentType,
      'Content-Disposition': 'inline',
      'Last-Modified': file.modifiedAt.toUTCString(),
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  })
}
