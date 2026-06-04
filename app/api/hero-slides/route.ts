import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HeroSlide from '@/models/HeroSlide'
import { getCurrentUser } from '@/lib/auth'
import { heroSlideSchema } from '@/lib/validations/content'

// GET all hero slides (public: active only, admin: can query all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    await connectDB()
    const query = all ? {} : { isActive: true }
    const slides = all 
      ? await HeroSlide.find(query).sort({ order: 1 })
      : await HeroSlide.find(query).sort({ order: 1 }).limit(3)

    return NextResponse.json({ slides })
  } catch (error) {
    console.error('Get hero slides error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create hero slide (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = heroSlideSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    const slide = await HeroSlide.create(validationResult.data)

    return NextResponse.json({ slide }, { status: 201 })
  } catch (error) {
    console.error('Create hero slide error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
