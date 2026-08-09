import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { piProfileSchema } from '@/validators/pi-profile'
import {
  addPrincipalInvestigatorProfile,
  getPrincipalInvestigatorProfile,
  updatePrincipalInvestigatorProfile,
} from '@/services/pi-profile.service'

function normalizePoints(item: any) {
  const rawPoints = Array.isArray(item.points)
    ? item.points
    : [
        {
          text: item.description || item.content || '',
          link: '',
        },
      ]

  return rawPoints
    .map((point: any) => ({
      text: typeof point.text === 'string' ? point.text.trim() : '',
      link: typeof point.link === 'string' ? point.link.trim() : '',
    }))
    .filter((point: any) => point.text.length > 0)
}

function normalizePointSection(items: any[], meta: 'duration' | 'year' | 'date' | null = null) {
  return items
    .map((item: any) => {
      const normalizedItem: any = {
        title: typeof item.title === 'string' ? item.title.trim() : '',
        points: normalizePoints(item),
      }

      if (meta === 'duration') {
        normalizedItem.duration = item.duration || ''
      }

      if (meta === 'year') {
        normalizedItem.year = item.year ? Number(item.year) : undefined
      }

      if (meta === 'date') {
        normalizedItem.date = item.date || ''
      }

      return normalizedItem
    })
    .filter((item: any) => item.title.length > 0 && item.points.length > 0)
}

function normalizeStringList(value: any, legacyValue?: any) {
  const values = Array.isArray(value) ? value : []
  if (typeof legacyValue === 'string' && legacyValue.trim()) {
    values.push(legacyValue)
  }

  return Array.from(
    new Set(
      values
        .filter((item: any) => typeof item === 'string')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0)
    )
  )
}

function normalizePIPublications(items: any[]) {
  return items
    .map((item: any, index: number) => ({
      authors: typeof item.authors === 'string' ? item.authors.trim() : '',
      title: typeof item.title === 'string' ? item.title.trim() : '',
      doiLink: typeof item.doiLink === 'string' ? item.doiLink.trim() : '',
      journalName: typeof item.journalName === 'string' ? item.journalName.trim() : '',
      conferenceName: typeof item.conferenceName === 'string' ? item.conferenceName.trim() : '',
      bookTitle: typeof item.bookTitle === 'string' ? item.bookTitle.trim() : '',
      publisher: typeof item.publisher === 'string' ? item.publisher.trim() : '',
      patentNumber: typeof item.patentNumber === 'string' ? item.patentNumber.trim() : '',
      year: Number(item.year),
      displayOrder: item.displayOrder ? Number(item.displayOrder) : index + 1,
    }))
    .filter((item: any) => item.authors.length > 0 && item.title.length > 0 && item.year)
    .sort((a: any, b: any) => (a.displayOrder || 9999) - (b.displayOrder || 9999) || b.year - a.year)
}

function normalizePIProfilePayload(body: any) {
  return {
    ...body,
    emails: normalizeStringList(body.emails, body.email),
    phoneNumbers: normalizeStringList(body.phoneNumbers, body.phoneNumber),
    education: Array.isArray(body.education)
      ? body.education.map((item: any) => ({
          degree: item.degree,
          year: Number(item.year),
          thesis_title: item.thesis_title || '',
          specialization: item.specialization || '',
          supervisor: item.supervisor || '',
          department: item.department || '',
          institute: item.institute || item.institution || '',
          university: item.university || '',
          grade: item.grade || '',
        }))
      : [],
    teaching: Array.isArray(body.teaching) ? normalizePointSection(body.teaching, 'duration') : [],
    activities: Array.isArray(body.activities)
      ? normalizePointSection(body.activities, 'year')
      : [],
    achievements: Array.isArray(body.achievements) ? normalizePointSection(body.achievements, 'date') : [],
    miscellaneous: Array.isArray(body.miscellaneous) ? normalizePointSection(body.miscellaneous) : [],
    journalPublications: Array.isArray(body.journalPublications)
      ? normalizePIPublications(body.journalPublications)
      : [],
    conferencePublications: Array.isArray(body.conferencePublications)
      ? normalizePIPublications(body.conferencePublications)
      : [],
    bookChapters: Array.isArray(body.bookChapters) ? normalizePIPublications(body.bookChapters) : [],
    patents: Array.isArray(body.patents) ? normalizePIPublications(body.patents) : [],
  }
}

// GET PI profile (public)
export async function GET() {
  try {
    const piProfile = await getPrincipalInvestigatorProfile()

    if (!piProfile) {
      return NextResponse.json(
        { error: 'PI profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      piProfile: {
        ...piProfile,
        emails: normalizeStringList((piProfile as any).emails, (piProfile as any).email),
        phoneNumbers: normalizeStringList((piProfile as any).phoneNumbers, (piProfile as any).phoneNumber),
        teaching: normalizePointSection((piProfile as any).teaching || [], 'duration'),
        activities: normalizePointSection((piProfile as any).activities || [], 'year'),
        achievements: normalizePointSection((piProfile as any).achievements || [], 'date'),
        miscellaneous: normalizePointSection((piProfile as any).miscellaneous || []),
        journalPublications: normalizePIPublications((piProfile as any).journalPublications || []),
        conferencePublications: normalizePIPublications((piProfile as any).conferencePublications || []),
        bookChapters: normalizePIPublications((piProfile as any).bookChapters || []),
        patents: normalizePIPublications((piProfile as any).patents || []),
      },
    })
  } catch (error) {
    return handleApiError(error, 'get.pi.profile')
  }
}

// PUT update PI profile (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = normalizePIProfilePayload(await request.json())
    const validationResult = piProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const piProfile = await updatePrincipalInvestigatorProfile(validationResult.data)

    return NextResponse.json({ piProfile })
  } catch (error) {
    return handleApiError(error, 'update.pi.profile')
  }
}

// POST create PI profile (admin only) - for initial setup
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = normalizePIProfilePayload(await request.json())
    const validationResult = piProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const result = await addPrincipalInvestigatorProfile(validationResult.data)
    if (result.conflict) {
      return NextResponse.json(
        { error: 'PI profile already exists. Use PUT to update.' },
        { status: 409 }
      )
    }

    return NextResponse.json({ piProfile: result.profile }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.pi.profile')
  }
}
