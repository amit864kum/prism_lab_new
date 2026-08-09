import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { aboutSectionSchema } from '@/validators/about'
import { getAboutContent, updateAboutContent } from '@/services/about.service'

export const dynamic = 'force-dynamic'

// GET about section (public)
export async function GET() {
  try {
    const about = await getAboutContent()

    return NextResponse.json({ about })
  } catch (error) {
    return handleApiError(error, 'get.about.section')
  }
}

// PUT update about section (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = aboutSectionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const about = await updateAboutContent(validationResult.data)

    return NextResponse.json({ about })
  } catch (error) {
    return handleApiError(error, 'update.about.section')
  }
}
