import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, rateLimitConfig } from '@/lib/rate-limit'

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const candidate = request.headers.get('x-real-ip')?.trim() || forwarded || 'unknown'
  return /^[A-Fa-f0-9:.]{2,64}$/.test(candidate) ? candidate : 'unknown'
}

function rateLimitHeaders(result: ReturnType<typeof rateLimit>) {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  }
}

export function enforceApiRateLimit(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) return null
  const result = rateLimit(`api:${getClientIp(request)}`, rateLimitConfig.api)
  if (result.success) return null
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers: rateLimitHeaders(result) }
  )
}

export function enforceLoginRateLimit(request: NextRequest) {
  const result = rateLimit(`login:${getClientIp(request)}`, rateLimitConfig.auth)
  if (result.success) return null
  return NextResponse.json(
    { error: 'Too many login attempts. Please try again later.' },
    { status: 429, headers: rateLimitHeaders(result) }
  )
}
