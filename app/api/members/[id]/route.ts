import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Member from '@/models/Member'
import Publication from '@/models/Publication'
import { getCurrentUser } from '@/lib/auth'
import { memberSchema } from '@/lib/validations/member'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const member = await Member.findById(id).populate('publications')

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Get member error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
    const validationResult = memberSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    // Check for duplicate slug (excluding current member)
    const existing = await Member.findOne({
      slug: validationResult.data.slug,
      _id: { $ne: id },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A member with this slug already exists' },
        { status: 409 }
      )
    }

    const member = await Member.findByIdAndUpdate(
      id,
      validationResult.data,
      { new: true, runValidators: true }
    ).populate('publications')

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Update member error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const member = await Member.findById(id)

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Remove member from all publications (bidirectional sync)
    if (member.publications && member.publications.length > 0) {
      await Publication.updateMany(
        { _id: { $in: member.publications.map(p => p.toString()) } },
        { $pull: { authors: id } }
      )
    }

    await Member.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete member error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
