interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests per interval
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function rateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const record = store[identifier]

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    store[identifier] = {
      count: 1,
      resetTime: now + config.interval,
    }

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
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
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
