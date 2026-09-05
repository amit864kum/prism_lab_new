import { SignJWT } from 'jose/jwt/sign'
import { jwtVerify } from 'jose/jwt/verify'
import { cookies } from 'next/headers'
import type { JWTPayload } from '@/types/auth'

export type { JWTPayload } from '@/types/auth'

export const AUTH_COOKIE_NAME = 'auth-token'
const TOKEN_ISSUER = 'prism-lab'
const TOKEN_AUDIENCE = 'prism-lab-admin'

function jwtSecret() {
  const value = process.env.JWT_SECRET
  if (!value || value.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters')
  }
  if (process.env.NODE_ENV === 'production' && /change|example|your-secret/i.test(value)) {
    throw new Error('JWT_SECRET contains a production-unsafe placeholder')
  }
  return new TextEncoder().encode(value)
}

export async function createToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setExpirationTime('7d')
    .sign(jwtSecret())

  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret(), {
      algorithms: ['HS256'],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    })
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.sessionVersion !== 'number' ||
      typeof payload.exp !== 'number'
    ) return null
    return payload as JWTPayload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    priority: 'high',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)
  return token?.value || null
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken()
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null

  const { findAdminSessionIdentityById } = await import('@/repositories/admin.repository')
  const admin = await findAdminSessionIdentityById(payload.userId)
  const currentSessionVersion = admin?.sessionVersion ?? 0
  if (!admin || admin.email !== payload.email || currentSessionVersion !== payload.sessionVersion) {
    return null
  }
  return payload
}
