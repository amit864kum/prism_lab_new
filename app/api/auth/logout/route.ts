import { NextResponse } from 'next/server'
import { removeAuthCookie, getCurrentUser } from '@/lib/auth'
import { logActivity } from '@/lib/activity'

export async function POST() {
  try {
    const user = await getCurrentUser()
    const email = user ? user.email : 'Admin'

    await removeAuthCookie()

    // Log activity
    await logActivity('LOGOUT', 'Admin', email)

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
