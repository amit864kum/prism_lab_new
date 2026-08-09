import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { newsItemSchema } from '@/validators/news'
import { addNewsItem, getNewsItems } from '@/services/news.service'
import { paginateResults, parsePagination } from '@/lib/pagination'

// GET all news items (public)
export async function GET(request: NextRequest) {
  try {
    const paginationOptions = parsePagination(new URL(request.url).searchParams)
    const results = await getNewsItems(paginationOptions.queryLimit, paginationOptions.skip)
    const { items: news, pagination } = paginateResults(results, paginationOptions)

    return NextResponse.json({ news, pagination })
  } catch (error) {
    return handleApiError(error, 'get.news')
  }
}

// POST create news item (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = newsItemSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const newsItem = await addNewsItem(validationResult.data)

    return NextResponse.json({ newsItem }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.news')
  }
}
