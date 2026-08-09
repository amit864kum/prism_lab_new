import { NextRequest, NextResponse } from 'next/server'
import { enforceAdminAuthentication } from '@/middleware/auth'
import { requestCorrelation, attachRequestId, logMiddlewareResult } from '@/middleware/logger'
import { enforceApiRateLimit } from '@/middleware/rate-limit'
import { enforceSameOriginApiRequest } from '@/middleware/security'
import { enforceUploadRequestLimit } from '@/middleware/upload'

export async function proxy(request: NextRequest) {
  const { requestId, headers } = requestCorrelation(request)
  const response =
    enforceSameOriginApiRequest(request) ||
    (request.nextUrl.pathname === '/api/upload' ? enforceUploadRequestLimit(request) : null) ||
    enforceApiRateLimit(request) ||
    (await enforceAdminAuthentication(request)) ||
    NextResponse.next({ request: { headers } })

  attachRequestId(response, requestId)
  logMiddlewareResult(request, response, requestId)
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/uploads/:path*'],
}
