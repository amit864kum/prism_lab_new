import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { researchAreaSchema } from '@/validators/research'
import { addResearchArea, getResearchAreas } from '@/services/research-area.service'
import { paginateResults, parsePagination } from '@/lib/pagination'

// GET all research areas (public)
export async function GET(request: NextRequest) {
  try {
    const paginationOptions = parsePagination(new URL(request.url).searchParams)
    const results = await getResearchAreas(paginationOptions.queryLimit, paginationOptions.skip)
    const { items: researchAreas, pagination } = paginateResults(results, paginationOptions)

    return NextResponse.json({ researchAreas, pagination })
  } catch (error) {
    return handleApiError(error, 'get.research.areas')
  }
}

// POST create research area (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = researchAreaSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const result = await addResearchArea(validationResult.data)
    if (result.conflict) {
      return NextResponse.json(
        { error: 'A research area with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({ researchArea: result.researchArea }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.research.area')
  }
}
