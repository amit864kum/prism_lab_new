import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Publication from '@/models/Publication'
import Member from '@/models/Member'
import { getCurrentUser } from '@/lib/auth'
import { publicationSchema } from '@/lib/validations/publication'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const publication = await Publication.findById(id).populate('authors')

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    return NextResponse.json({ publication })
  } catch (error) {
    console.error('Get publication error:', error)
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
    const validationResult = publicationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    // Get current publication to compare authors
    const currentPublication = await Publication.findById(id)
    if (!currentPublication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    // Check for duplicate slug (excluding current publication)
    const existing = await Publication.findOne({
      slug: validationResult.data.slug,
      _id: { $ne: id },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A publication with this slug already exists' },
        { status: 409 }
      )
    }

    // Bidirectional sync: Update member references
    const oldAuthors = currentPublication.authors.map(a => a.toString())
    const newAuthors = validationResult.data.authors

    // Remove publication from old authors who are no longer authors
    const removedAuthors = oldAuthors.filter(a => !newAuthors.includes(a))
    if (removedAuthors.length > 0) {
      await Member.updateMany(
        { _id: { $in: removedAuthors } },
        { $pull: { publications: id } }
      )
    }

    // Add publication to new authors
    const addedAuthors = newAuthors.filter(a => !oldAuthors.includes(a))
    if (addedAuthors.length > 0) {
      await Member.updateMany(
        { _id: { $in: addedAuthors } },
        { $addToSet: { publications: id } }
      )
    }

    // Update publication
    const publication = await Publication.findByIdAndUpdate(
      id,
      validationResult.data,
      { new: true, runValidators: true }
    ).populate('authors')

    return NextResponse.json({ publication })
  } catch (error) {
    console.error('Update publication error:', error)
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

    const publication = await Publication.findById(id)

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    // Bidirectional sync: Remove publication from all authors
    if (publication.authors && publication.authors.length > 0) {
      await Member.updateMany(
        { _id: { $in: publication.authors.map(a => a.toString()) } },
        { $pull: { publications: id } }
      )
    }

    await Publication.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete publication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
