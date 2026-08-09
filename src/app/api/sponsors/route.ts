import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { sponsorSchema } from '@/validators/sponsor'
import { addSponsor, getSponsors } from '@/services/sponsor.service'
import { paginateResults, parsePagination } from '@/lib/pagination'

// GET all sponsors (public)
export async function GET(request: NextRequest) {
  try {
    const paginationOptions = parsePagination(new URL(request.url).searchParams)
    const results = await getSponsors(paginationOptions.queryLimit, paginationOptions.skip)
    const { items: sponsors, pagination } = paginateResults(results, paginationOptions)

    return NextResponse.json({ sponsors, pagination })
  } catch (error) {
    return handleApiError(error, 'get.sponsors')
  }
}

// POST create sponsor (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = sponsorSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const sponsor = await addSponsor(validationResult.data)

    return NextResponse.json({ sponsor }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.sponsor')
  }
}
