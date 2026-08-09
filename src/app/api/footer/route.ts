import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'
import { getFooterSettings, updateFooterSettings } from '@/services/footer.service'

export const dynamic = 'force-dynamic'

const footerSchema = z.object({
  copyrightText: z.string().min(1, 'Copyright text is required').trim(),
  developerName: z.string().min(1, 'Developer name is required').trim(),
  developerLink: z.string().url('Invalid developer link URL').trim(),
  prismLogoUrl: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  contactNumber: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  googleMapsEmbedUrl: z.string().url('Invalid Google Maps embed URL').optional().or(z.literal('')),
  heroPublicationsCount: z.coerce.number().int().min(0).nullable().optional().or(z.literal('')),
  heroResearchAreasCount: z.coerce.number().int().min(0).nullable().optional().or(z.literal('')),
  heroScholarsCount: z.coerce.number().int().min(0).nullable().optional().or(z.literal('')),
  heroProjectsCount: z.coerce.number().int().min(0).nullable().optional().or(z.literal('')),
}).transform((data) => ({
  ...data,
  heroPublicationsCount: data.heroPublicationsCount === '' ? null : data.heroPublicationsCount,
  heroResearchAreasCount: data.heroResearchAreasCount === '' ? null : data.heroResearchAreasCount,
  heroScholarsCount: data.heroScholarsCount === '' ? null : data.heroScholarsCount,
  heroProjectsCount: data.heroProjectsCount === '' ? null : data.heroProjectsCount,
}))

// GET footer settings (public)
export async function GET() {
  try {
    const footer = await getFooterSettings()

    return NextResponse.json({ footer })
  } catch (error) {
    return handleApiError(error, 'get.footer')
  }
}

// PUT update footer/developer settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = footerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const footer = await updateFooterSettings(validationResult.data)

    return NextResponse.json({ footer })
  } catch (error) {
    return handleApiError(error, 'update.footer')
  }
}
