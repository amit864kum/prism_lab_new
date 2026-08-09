import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/validators/auth'
import { establishAdminSession } from '@/services/auth.service'
import { enforceLoginRateLimit } from '@/middleware/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const rateLimited = enforceLoginRateLimit(request)
    if (rateLimited) return rateLimited

    // Parse and validate request body
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const admin = await establishAdminSession(
      validationResult.data.email,
      validationResult.data.password
    )
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, admin })
  } catch (error) {
    return handleApiError(error, 'auth.login', request)
  }
}
