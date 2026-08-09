import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getMemberAutocomplete } from '@/services/member.service'

// Required: reads cookies via getCurrentUser and uses dynamic request.url
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    const members = await getMemberAutocomplete(q)

    return NextResponse.json({ members })
  } catch (error) {
    return handleApiError(error, 'member.autocomplete')
  }
}
