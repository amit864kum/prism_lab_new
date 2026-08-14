import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { handleApiError } from '@/lib/errors/api-error'
import { publicationSchema } from '@/validators/publication'
import {
  editScopedPublication,
  getScopedPublication,
  removeScopedPublication,
} from '@/services/publication.service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const publication = await getScopedPublication(id, true)
    if (!publication) {
      return NextResponse.json({ error: 'Member publication not found' }, { status: 404 })
    }
    return NextResponse.json({ publication })
  } catch (error) {
    return handleApiError(error, 'get.member.publication')
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
    const validationResult = publicationSchema.safeParse({
      ...body,
      profileOnly: true,
      researchAreas: [],
    })
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const result = await editScopedPublication(id, validationResult.data, true)
    if (result.notFound) {
      return NextResponse.json({ error: 'Member publication not found' }, { status: 404 })
    }
    if (result.conflict) {
      return NextResponse.json(
        { error: 'A publication with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json({ publication: result.publication })
  } catch (error) {
    return handleApiError(error, 'update.member.publication')
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const publication = await removeScopedPublication(id, true)
    if (!publication) {
      return NextResponse.json({ error: 'Member publication not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'delete.member.publication')
  }
}
