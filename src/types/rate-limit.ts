export interface RateLimitConfig {
  interval: number
  maxRequests: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}
