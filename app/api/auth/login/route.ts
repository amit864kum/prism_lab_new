import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { loginSchema } from '@/lib/validations/auth'
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth'
import { rateLimit, rateLimitConfig } from '@/lib/rate-limit'
import { logActivity } from '@/lib/activity'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimitResult = rateLimit(`login:${ip}`, rateLimitConfig.auth)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Connect to database
    await connectDB()

    // Find admin by email
    const admin = await Admin.findOne({ email })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      userId: admin._id.toString(),
      email: admin.email,
    })

    // Set auth cookie
    await setAuthCookie(token)

    // Log activity
    await logActivity('LOGIN', 'Admin', admin.email)

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
