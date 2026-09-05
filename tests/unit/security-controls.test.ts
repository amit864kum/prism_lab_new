import { beforeAll, describe, expect, it } from 'vitest'
import { SignJWT } from 'jose'
import { NextRequest } from 'next/server'
import sharp from 'sharp'
import { verifyToken } from '../../src/lib/auth'
import { enforceSameOriginApiRequest } from '../../src/middleware/security'
import { PDFDocument, PDFName, PDFString } from 'pdf-lib'
import { prepareSafePdf } from '../../src/lib/storage/pdf'
import { prepareImageForStorage } from '../../src/lib/storage/compress'
import {
  assetUrl,
  optionalGoogleMapsEmbedUrl,
  optionalHttpsUrl,
} from '../../src/validators/url'

const JWT_SECRET = 'security-test-secret-with-at-least-32-characters'

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET
  process.env.NEXT_PUBLIC_BASE_URL = 'https://prismlab.example'
})

describe('security URL policy', () => {
  it('accepts HTTPS and managed assets while rejecting executable or credentialed URLs', () => {
    expect(optionalHttpsUrl().safeParse('https://example.org/path').success).toBe(true)
    expect(assetUrl().safeParse('/uploads/members/photo.jpg').success).toBe(true)
    expect(optionalHttpsUrl().safeParse('javascript:alert(1)').success).toBe(false)
    expect(optionalHttpsUrl().safeParse('data:text/html,test').success).toBe(false)
    expect(optionalHttpsUrl().safeParse('http://example.org').success).toBe(false)
    expect(optionalHttpsUrl().safeParse('https://user:pass@example.org').success).toBe(false)
  })

  it('allowlists Google Maps embed URLs', () => {
    const schema = optionalGoogleMapsEmbedUrl()
    expect(schema.safeParse('https://www.google.com/maps/embed?pb=test').success).toBe(true)
    expect(schema.safeParse('https://evil.example/maps/embed').success).toBe(false)
  })
})

describe('session token policy', () => {
  it('rejects tokens without required expiry or issuer/audience claims', async () => {
    const key = new TextEncoder().encode(JWT_SECRET)
    const noExpiry = await new SignJWT({
      userId: 'admin-id',
      email: 'admin@example.org',
      sessionVersion: 0,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('prism-lab')
      .setAudience('prism-lab-admin')
      .sign(key)
    const legacy = await new SignJWT({
      userId: 'admin-id',
      email: 'admin@example.org',
      sessionVersion: 0,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(key)

    expect(await verifyToken(noExpiry)).toBeNull()
    expect(await verifyToken(legacy)).toBeNull()
  })
})

describe('request-origin enforcement', () => {
  it('rejects missing and cross-site origins and accepts the canonical origin', () => {
    const missing = new NextRequest('https://prismlab.example/api/about', { method: 'PUT' })
    const crossSite = new NextRequest('https://prismlab.example/api/about', {
      method: 'PUT',
      headers: { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' },
    })
    const sameOrigin = new NextRequest('https://prismlab.example/api/about', {
      method: 'PUT',
      headers: { origin: 'https://prismlab.example', 'sec-fetch-site': 'same-origin' },
    })

    expect(enforceSameOriginApiRequest(missing)?.status).toBe(403)
    expect(enforceSameOriginApiRequest(crossSite)?.status).toBe(403)
    expect(enforceSameOriginApiRequest(sameOrigin)).toBeNull()
  })
})

describe('upload content policy', () => {
  it('rejects active PDF content and structurally normalizes safe documents', async () => {
    const safeSource = await PDFDocument.create()
    safeSource.addPage([72, 72])
    const safe = await prepareSafePdf(Buffer.from(await safeSource.save()))

    const activeSource = await PDFDocument.create()
    activeSource.addPage([72, 72])
    activeSource.catalog.set(PDFName.of('OpenAction'), PDFString.of('JavaScript'))
    const active = await prepareSafePdf(Buffer.from(await activeSource.save({ useObjectStreams: false })))

    expect(safe).not.toBeNull()
    expect(await prepareSafePdf(Buffer.from('%PDF-1.7\ninvalid'))).toBeNull()
    expect(active).toBeNull()
  })

  it('decodes images and strips metadata while preserving valid output', async () => {
    const source = await sharp({
      create: { width: 2, height: 2, channels: 3, background: '#ffffff' },
    }).withMetadata({ orientation: 6 }).jpeg().toBuffer()
    const output = await prepareImageForStorage(source, 'jpg')
    const metadata = await sharp(output).metadata()

    expect(metadata.format).toBe('jpeg')
    expect(metadata.orientation).toBeUndefined()
    expect(metadata.exif).toBeUndefined()
  })
})
