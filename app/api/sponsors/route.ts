import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Sponsor from '@/models/Sponsor'
import { getCurrentUser } from '@/lib/auth'
import { sponsorSchema } from '@/lib/validations/content'

// GET all sponsors (public)
export async function GET() {
  try {
    await connectDB()
    const sponsors = await Sponsor.find().sort({ order: 1 })

    return NextResponse.json({ sponsors })
  } catch (error) {
    console.error('Get sponsors error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create sponsor (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = sponsorSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    const sponsor = await Sponsor.create(validationResult.data)

    return NextResponse.json({ sponsor }, { status: 201 })
  } catch (error) {
    console.error('Create sponsor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
