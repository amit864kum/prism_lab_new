import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { publicationSchema } from '@/validators/publication'
import { normalizePublicationType } from '@/lib/publication-types'
import { addPublication, getPublications } from '@/services/publication.service'
import { paginateResults, parsePagination } from '@/lib/pagination'

// GET all publications (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const year = searchParams.get('year')
    const paginationOptions = parsePagination(searchParams)
    const results = await getPublications(
      {
        type: type ? normalizePublicationType(type) : undefined,
        year: year ? Number.parseInt(year, 10) : undefined,
      },
      { limit: paginationOptions.queryLimit, skip: paginationOptions.skip }
    )
    const { items: publications, pagination } = paginateResults(results, paginationOptions)
    return NextResponse.json({ publications, pagination })
  } catch (error) {
    return handleApiError(error, 'get.publications')
  }
}

// POST create publication (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = publicationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const result = await addPublication(validationResult.data)
    if (result.conflict) {
      return NextResponse.json(
        { error: 'A publication with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({ publication: result.publication }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.publication')
  }
}
