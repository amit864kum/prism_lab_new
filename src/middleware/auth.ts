import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth'

const ADMIN_PREFIX = '/admin'
const LOGIN_PATH = '/admin/login'

export async function enforceAdminAuthentication(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (!pathname.startsWith(ADMIN_PREFIX)) return null

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (pathname.startsWith(LOGIN_PATH)) {
    if (token && await verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return null
  }

  if (!token || !(await verifyToken(token))) {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url))
    if (token) response.cookies.delete(AUTH_COOKIE_NAME)
    return response
  }

  return null
}
