export const DEFAULT_SITE_URL = 'https://prismlab.iitp.ac.in'

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_SITE_URL
}
