import { z } from 'zod'

const serverEnvironmentSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DNS_SERVERS: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  UPLOADS_ROOT: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>

let cachedEnvironment: ServerEnvironment | undefined

/**
 * Validates server-only configuration on demand. It is intentionally not
 * evaluated during module import so build tooling and Edge middleware remain
 * free to load client-safe configuration modules.
 */
export function getServerEnvironment(): ServerEnvironment {
  if (!cachedEnvironment) {
    cachedEnvironment = serverEnvironmentSchema.parse({
      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_DNS_SERVERS: process.env.MONGODB_DNS_SERVERS,
      JWT_SECRET: process.env.JWT_SECRET,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      UPLOADS_ROOT: process.env.UPLOADS_ROOT,
      NODE_ENV: process.env.NODE_ENV,
    })
  }

  return cachedEnvironment
}
