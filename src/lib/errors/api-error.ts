import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { AppError } from './app-error'
import { errorLogger } from '@/lib/logger'

export function requestIdFrom(request?: Request) {
  return request?.headers.get('x-request-id') || randomUUID()
}

export function handleApiError(
  error: unknown,
  operation: string,
  request?: Request
) {
  const requestId = requestIdFrom(request)
  const knownError = error instanceof AppError

  errorLogger.error('API operation failed', {
    requestId,
    operation,
    error,
    ...(knownError ? { code: error.code, status: error.status } : {}),
  })

  const body: Record<string, unknown> = {
    error: knownError ? error.message : 'Internal server error',
  }
  if (knownError && error.details !== undefined) body.details = error.details

  return NextResponse.json(body, {
    status: knownError ? error.status : 500,
    headers: {
      ...(knownError ? error.headers : undefined),
      'X-Request-ID': requestId,
    },
  })
}
