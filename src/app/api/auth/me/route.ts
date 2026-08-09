import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getAdminProfile } from '@/services/auth.service'

// Required: this route reads cookies (via getCurrentUser) so it must always
// be server-rendered on demand, never statically pre-generated at build time.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const admin = await getAdminProfile(user.userId)

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ admin })
  } catch (error) {
    return handleApiError(error, 'auth.me', request)
  }
}
