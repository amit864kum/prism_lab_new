import type { RateLimitConfig, RateLimitResult } from '@/types/rate-limit'

interface RateLimitRecord {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitRecord>()
let nextCleanupAt = 0

export type { RateLimitConfig, RateLimitResult } from '@/types/rate-limit'

export function rateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const record = store.get(identifier)

  if (now >= nextCleanupAt) {
    cleanupExpiredEntries()
    nextCleanupAt = now + 60_000
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    store.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    })

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: now + config.interval,
    }
  }

  if (record.count < config.maxRequests) {
    // Within limit
    record.count++

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - record.count,
      reset: record.resetTime,
    }
  }

  // Rate limit exceeded
  return {
    success: false,
    limit: config.maxRequests,
    remaining: 0,
    reset: record.resetTime,
  }
}

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, record] of Array.from(store.entries())) {
    if (record.resetTime < now) store.delete(key)
  }
}

// Preset configurations
export const rateLimitConfig = {
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  api: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
}
