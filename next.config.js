/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV === 'development'
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
].join('; ')

const nextConfig = {
  experimental: {
    sri: { algorithm: 'sha256' },
    proxyClientMaxBodySize: '11mb',
  },
  images: {
    remotePatterns: [],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/people/current-members',
        destination: '/members',
        permanent: true,
      },
      {
        source: '/people/current-members/:slug',
        destination: '/members/:slug',
        permanent: true,
      },
    ]
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      {
        key: 'Content-Security-Policy',
        value: contentSecurityPolicy,
      },
      ...(process.env.NODE_ENV === 'production'
        ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
        : []),
    ]

    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
      { source: '/(.*)', headers: securityHeaders },
    ]
  },
}

module.exports = nextConfig
