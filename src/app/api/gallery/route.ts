import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { galleryImageSchema } from '@/validators/gallery'
import { addGalleryImage, getGalleryImages } from '@/services/gallery.service'
import { paginateResults, parsePagination } from '@/lib/pagination'

// GET all gallery images (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const paginationOptions = parsePagination(searchParams)
    const results = await getGalleryImages(
      category,
      paginationOptions.queryLimit,
      paginationOptions.skip
    )
    const { items: images, pagination } = paginateResults(results, paginationOptions)

    return NextResponse.json({ galleryImages: images, images, pagination })
  } catch (error) {
    return handleApiError(error, 'get.gallery.images')
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

    const image = await addGalleryImage(validationResult.data)

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.gallery.image')
  }
}
