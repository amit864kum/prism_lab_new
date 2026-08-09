import { NextRequest, NextResponse } from 'next/server'
import { apiLogger, appLogger, uploadLogger } from '@/lib/logger'

export function requestCorrelation(request: NextRequest) {
  const incoming = request.headers.get('x-request-id')
  const requestId = incoming && /^[A-Za-z0-9._-]{8,128}$/.test(incoming)
    ? incoming
    : crypto.randomUUID()
  const headers = new Headers(request.headers)
  headers.set('x-request-id', requestId)
  return { requestId, headers }
}

export function attachRequestId(response: NextResponse, requestId: string) {
  response.headers.set('X-Request-ID', requestId)
  return response
}

export function logMiddlewareResult(
  request: NextRequest,
  response: NextResponse,
  requestId: string
) {
  const context = {
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    ...(response.headers.has('x-middleware-next')
      ? { outcome: 'forwarded' }
      : { outcome: 'handled', status: response.status }),
  }
  if (request.nextUrl.pathname === '/api/upload' || request.nextUrl.pathname.startsWith('/uploads/')) {
    uploadLogger.info('Middleware request decision', context)
  } else if (request.nextUrl.pathname.startsWith('/api/')) {
    apiLogger.info('Middleware request decision', context)
  } else {
    appLogger.info('Middleware request decision', context)
  }
}
