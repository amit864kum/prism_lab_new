import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HeroSlide from '@/models/HeroSlide'
import { getCurrentUser } from '@/lib/auth'
import { heroSlideSchema } from '@/lib/validations/content'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const slide = await HeroSlide.findById(id)

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    }

    return NextResponse.json({ slide })
  } catch (error) {
    console.error('Get hero slide error:', error)
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
    const validationResult = heroSlideSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    const slide = await HeroSlide.findByIdAndUpdate(
      id,
      validationResult.data,
      { new: true, runValidators: true }
    )

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    }

    return NextResponse.json({ slide })
  } catch (error) {
    console.error('Update hero slide error:', error)
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

    const slide = await HeroSlide.findByIdAndDelete(id)

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete hero slide error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
