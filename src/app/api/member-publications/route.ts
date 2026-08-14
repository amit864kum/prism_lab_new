import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { handleApiError } from '@/lib/errors/api-error'
import { paginateResults, parsePagination } from '@/lib/pagination'
import { publicationSchema } from '@/validators/publication'
import { addScopedPublication, getPublications } from '@/services/publication.service'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paginationOptions = parsePagination(searchParams)
    const results = await getPublications(
      { profileOnly: true },
      { limit: paginationOptions.queryLimit, skip: paginationOptions.skip }
    )
    const { items: publications, pagination } = paginateResults(results, paginationOptions)
    return NextResponse.json({ publications, pagination })
  } catch (error) {
    return handleApiError(error, 'get.member.publications')
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = publicationSchema.safeParse({
      ...body,
      profileOnly: true,
      researchAreas: [],
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const result = await addScopedPublication(validationResult.data, true)
    if (result.conflict) {
      return NextResponse.json(
        { error: 'A publication with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({ publication: result.publication }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.member.publication')
  }
}
