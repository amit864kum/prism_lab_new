export const AUTH_COOKIE_NAME = 'auth-token'
export const AUTH_TOKEN_LIFETIME = '7d'
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
}
