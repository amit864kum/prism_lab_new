import { NextRequest, NextResponse } from 'next/server'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export function enforceSameOriginApiRequest(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/') || SAFE_METHODS.has(request.method)) return null
  const origin = request.headers.get('origin')
  if (!origin) return null

  const allowedOrigins = new Set([request.nextUrl.origin, process.env.NEXT_PUBLIC_BASE_URL].filter(Boolean))
  if (!allowedOrigins.has(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
