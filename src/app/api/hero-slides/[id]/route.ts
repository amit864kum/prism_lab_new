import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { handleApiError } from '@/lib/errors/api-error'
import { heroSlideSchema } from '@/validators/hero'
import {
  editHeroSlide,
  getHeroSlide,
  removeHeroSlide,
} from '@/services/hero.service'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const slide = await getHeroSlide((await params).id)
    if (!slide) return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    return NextResponse.json({ slide })
  } catch (error) {
    return handleApiError(error, 'get.hero.slide', request)
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
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
    const slide = await editHeroSlide((await params).id, validation.data)
    if (!slide) return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    return NextResponse.json({ slide })
  } catch (error) {
    return handleApiError(error, 'update.hero.slide', request)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    if (!(await getCurrentUser())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const slide = await removeHeroSlide((await params).id)
    if (!slide) return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'delete.hero.slide', request)
  }
}
