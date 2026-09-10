import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors/api-error'
import { migrateLegacyVisitor, registerVisitor } from '@/services/visitor.service'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const VISITOR_COOKIE = 'prism_visitor_counted'
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const visitorIdSchema = z.uuid()
const visitorRequestSchema = z.object({ visitorId: visitorIdSchema })

export async function POST(request: NextRequest) {
  try {
    const rawVisitorCookie = request.cookies.get(VISITOR_COOKIE)?.value
    const cookieVisitorId = visitorIdSchema.safeParse(
      rawVisitorCookie,
    )
    let visitorId: string

    if (cookieVisitorId.success) {
      visitorId = cookieVisitorId.data
    } else {
      const requestBody = visitorRequestSchema.safeParse(
        await request.json().catch(() => null),
      )
      if (!requestBody.success) {
        return NextResponse.json(
          { error: 'Invalid visitor identifier' },
          { status: 400 },
        )
      }
      visitorId = requestBody.data.visitorId
    }
    const totalVisitors =
      rawVisitorCookie === '1'
        ? await migrateLegacyVisitor(visitorId)
        : await registerVisitor(visitorId)

    const response = NextResponse.json(
      { totalVisitors },
      { headers: { 'Cache-Control': 'no-store' } },
    )

    if (!cookieVisitorId.success) {
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: VISITOR_COOKIE_MAX_AGE,
        priority: 'medium',
      })
    }

    return response
  } catch (error) {
    return handleApiError(error, 'register.visitor', request)
  }
}
