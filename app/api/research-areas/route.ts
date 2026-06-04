import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ResearchArea from '@/models/ResearchArea'
import { getCurrentUser } from '@/lib/auth'
import { researchAreaSchema } from '@/lib/validations/content'

// GET all research areas (public)
export async function GET() {
  try {
    await connectDB()
    const researchAreas = await ResearchArea.find().sort({ order: 1 })

    return NextResponse.json({ researchAreas })
  } catch (error) {
    console.error('Get research areas error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create research area (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = researchAreaSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    // Check for duplicate slug
    const existing = await ResearchArea.findOne({ slug: validationResult.data.slug })
    if (existing) {
      return NextResponse.json(
        { error: 'A research area with this slug already exists' },
        { status: 409 }
      )
    }

    const researchArea = await ResearchArea.create(validationResult.data)

    return NextResponse.json({ researchArea }, { status: 201 })
  } catch (error) {
    console.error('Create research area error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
