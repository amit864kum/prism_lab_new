import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PIProfile from '@/models/PIProfile'
import { getCurrentUser } from '@/lib/auth'
import { piProfileSchema } from '@/lib/validations/content'

// GET PI profile (public)
export async function GET() {
  try {
    await connectDB()
    
    // Get the first (and only) PI profile
    const piProfile = await PIProfile.findOne()

    if (!piProfile) {
      return NextResponse.json(
        { error: 'PI profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ piProfile })
  } catch (error) {
    console.error('Get PI profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update PI profile (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = piProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    // Update or create the singleton PI profile
    let piProfile = await PIProfile.findOne()
    
    if (piProfile) {
      piProfile = await PIProfile.findByIdAndUpdate(
        piProfile._id,
        validationResult.data,
        { new: true, runValidators: true }
      )
    } else {
      piProfile = await PIProfile.create(validationResult.data)
    }

    return NextResponse.json({ piProfile })
  } catch (error) {
    console.error('Update PI profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create PI profile (admin only) - for initial setup
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = piProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if PI profile already exists
    const existing = await PIProfile.findOne()
    if (existing) {
      return NextResponse.json(
        { error: 'PI profile already exists. Use PUT to update.' },
        { status: 409 }
      )
    }

    const piProfile = await PIProfile.create(validationResult.data)

    return NextResponse.json({ piProfile }, { status: 201 })
  } catch (error) {
    console.error('Create PI profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
