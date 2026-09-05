import { NextRequest, NextResponse } from 'next/server'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function canonicalOrigin(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_BASE_URL
  if (configured) return new URL(configured).origin
  if (process.env.NODE_ENV === 'production') return null
  return request.nextUrl.origin
}

function requestSourceOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin) return origin
  const referer = request.headers.get('referer')
  if (!referer) return null
  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

export function enforceSameOriginApiRequest(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/') || SAFE_METHODS.has(request.method)) return null
  const expectedOrigin = canonicalOrigin(request)
  const sourceOrigin = requestSourceOrigin(request)
  const fetchSite = request.headers.get('sec-fetch-site')
  if (!expectedOrigin || sourceOrigin !== expectedOrigin || fetchSite === 'cross-site') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
