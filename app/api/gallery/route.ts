import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import GalleryImage from '@/models/GalleryImage'
import { getCurrentUser } from '@/lib/auth'
import { galleryImageSchema } from '@/lib/validations/content'

// GET all gallery images (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const query = category ? { category } : {}
    const images = await GalleryImage.find(query).sort({ uploadDate: -1 })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Get gallery images error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create gallery image (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = galleryImageSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    const image = await GalleryImage.create(validationResult.data)

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    console.error('Create gallery image error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
