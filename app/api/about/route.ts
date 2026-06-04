import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AboutSection from '@/models/AboutSection'
import { getCurrentUser } from '@/lib/auth'
import { aboutSectionSchema } from '@/lib/validations/content'

// GET about section (public)
export async function GET() {
  try {
    await connectDB()
    
    // Get the first (and only) about section, or create default
    let about = await AboutSection.findOne()
    
    if (!about) {
      about = await AboutSection.create({
        content: 'Welcome to Prism Lab at IIT Patna.',
      })
    }

    return NextResponse.json({ about })
  } catch (error) {
    console.error('Get about section error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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

    await connectDB()

    // Update or create the singleton about section
    let about = await AboutSection.findOne()
    
    if (about) {
      about = await AboutSection.findByIdAndUpdate(
        about._id,
        validationResult.data,
        { new: true, runValidators: true }
      )
    } else {
      about = await AboutSection.create(validationResult.data)
    }

    return NextResponse.json({ about })
  } catch (error) {
    console.error('Update about section error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
