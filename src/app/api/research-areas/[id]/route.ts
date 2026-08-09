import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { researchAreaSchema } from '@/validators/research'
import {
  editResearchArea,
  getResearchArea,
  removeResearchArea,
} from '@/services/research-area.service'

// GET single research area
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const researchArea = await getResearchArea(id)

    if (!researchArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ researchArea })
  } catch (error) {
    return handleApiError(error, 'get.research.area')
  }
}

// PUT update research area
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
    const validationResult = researchAreaSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const result = await editResearchArea(id, validationResult.data)
    if (result.conflict) {
      return NextResponse.json(
        { error: 'A research area with this slug already exists' },
        { status: 409 }
      )
    }

    const researchArea = result.researchArea

    if (!researchArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ researchArea })
  } catch (error) {
    return handleApiError(error, 'update.research.area')
  }
}

// DELETE research area
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
    const researchArea = await removeResearchArea(id)

    if (!researchArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'delete.research.area')
  }
}
