import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import NewsItem from '@/models/NewsItem'
import { getCurrentUser } from '@/lib/auth'
import { newsItemSchema } from '@/lib/validations/content'

// GET all news items (public)
export async function GET() {
  try {
    await connectDB()
    const news = await NewsItem.find().sort({ date: -1 })

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

    await connectDB()

    const newsItem = await NewsItem.create(validationResult.data)

    return NextResponse.json({ newsItem }, { status: 201 })
  } catch (error) {
    console.error('Create news error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
