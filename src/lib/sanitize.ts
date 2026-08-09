import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent Stored XSS attacks.
 * Uses isomorphic-dompurify which works in both server and client environments.
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty)
}
