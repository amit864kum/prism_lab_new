import { z } from 'zod'

const MAX_URL_LENGTH = 2048
const MANAGED_ASSET_PATH = /^\/uploads\/[a-z0-9-]+\/[A-Za-z0-9._-]+$/
const GOOGLE_MAPS_EMBED_HOSTS = new Set(['www.google.com', 'maps.google.com'])

function isSafeHttpsUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

export function httpsUrl(message = 'A secure HTTPS URL is required') {
  return z.string().trim().max(MAX_URL_LENGTH, 'URL is too long').refine(isSafeHttpsUrl, message)
}

export function optionalHttpsUrl(message?: string) {
  return httpsUrl(message).optional().or(z.literal(''))
}

export function assetUrl(message = 'A managed upload path or secure HTTPS URL is required') {
  return z
    .string()
    .trim()
    .max(MAX_URL_LENGTH, 'URL is too long')
    .refine((value) => MANAGED_ASSET_PATH.test(value) || isSafeHttpsUrl(value), message)
}

export function optionalAssetUrl(message?: string) {
  return assetUrl(message).optional().or(z.literal(''))
}

export function optionalGoogleMapsEmbedUrl() {
  return optionalHttpsUrl('Invalid Google Maps embed URL').refine((value) => {
    if (!value) return true
    const url = new URL(value)
    return GOOGLE_MAPS_EMBED_HOSTS.has(url.hostname) && url.pathname.startsWith('/maps/embed')
  }, 'Only Google Maps embed URLs are allowed')
}
