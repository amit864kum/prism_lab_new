import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Member from '@/models/Member'
import Publication from '@/models/Publication'
import { getCurrentUser } from '@/lib/auth'
import { memberSchema } from '@/lib/validations/member'

// GET all members (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    
    const query: any = {}
    if (status) query.status = status
    if (role) query.role = role
    
    const members = await Member.find(query)
      .populate('publications')
      .sort({ yearJoined: -1, role: 1 })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Get members error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create member (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = memberSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    // Check for duplicate slug
    const existing = await Member.findOne({ slug: validationResult.data.slug })
    if (existing) {
      return NextResponse.json(
        { error: 'A member with this slug already exists' },
        { status: 409 }
      )
    }

    const member = await Member.create(validationResult.data)

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error('Create member error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
