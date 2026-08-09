import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { handleApiError } from '@/lib/errors/api-error'
import { heroSlideSchema } from '@/validators/hero'
import { addHeroSlide, getHeroSlides } from '@/services/hero.service'

export async function GET(request: NextRequest) {
  try {
    const includeInactive = new URL(request.url).searchParams.get('all') === 'true'
    const slides = await getHeroSlides(includeInactive)
    return NextResponse.json({ slides })
  } catch (error) {
    return handleApiError(error, 'get.hero.slides', request)
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await getCurrentUser())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const validation = heroSlideSchema.safeParse(await request.json())
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }
    const slide = await addHeroSlide(validation.data)
    return NextResponse.json({ slide }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.hero.slide', request)
  }
}
