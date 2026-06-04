import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import NewsItem from '@/models/NewsItem'
import { getCurrentUser } from '@/lib/auth'
import { newsItemSchema } from '@/lib/validations/content'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const newsItem = await NewsItem.findById(id)

    if (!newsItem) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 })
    }

    return NextResponse.json({ newsItem })
  } catch (error) {
    console.error('Get news item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validationResult = newsItemSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    const newsItem = await NewsItem.findByIdAndUpdate(
      id,
      validationResult.data,
      { new: true, runValidators: true }
    )

    if (!newsItem) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 })
    }

    return NextResponse.json({ newsItem })
  } catch (error) {
    console.error('Update news item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const newsItem = await NewsItem.findByIdAndDelete(id)

    if (!newsItem) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete news item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
