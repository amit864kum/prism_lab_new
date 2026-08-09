import { handleApiError } from '@/lib/errors/api-error'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getDashboardStatistics } from '@/services/dashboard.service'

// Required: reads cookies via getCurrentUser — must be server-rendered on demand.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(await getDashboardStatistics())
  } catch (error) {
    return handleApiError(error, 'get.dashboard.stats')
  }
}
