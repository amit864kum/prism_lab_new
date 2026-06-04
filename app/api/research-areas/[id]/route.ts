import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ResearchArea from '@/models/ResearchArea'
import { getCurrentUser } from '@/lib/auth'
import { researchAreaSchema } from '@/lib/validations/content'

// GET single research area
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const researchArea = await ResearchArea.findById(id)

    if (!researchArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ researchArea })
  } catch (error) {
    console.error('Get research area error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

    await connectDB()

    // Check for duplicate slug (excluding current document)
    const existing = await ResearchArea.findOne({
      slug: validationResult.data.slug,
      _id: { $ne: id },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A research area with this slug already exists' },
        { status: 409 }
      )
    }

    const researchArea = await ResearchArea.findByIdAndUpdate(
      id,
      validationResult.data,
      { new: true, runValidators: true }
    )

    if (!researchArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ researchArea })
  } catch (error) {
    console.error('Update research area error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
    await connectDB()

    const researchArea = await ResearchArea.findByIdAndDelete(id)

    if (!researchArea) {
      return NextResponse.json(
        { error: 'Research area not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete research area error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
