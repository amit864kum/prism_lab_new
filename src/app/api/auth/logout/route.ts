import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { endAdminSession } from '@/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const email = user ? user.email : 'Admin'

    await endAdminSession(email)

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    return handleApiError(error, 'auth.logout', request)
  }
}
