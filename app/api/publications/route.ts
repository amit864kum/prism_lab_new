import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Publication from '@/models/Publication'
import Member from '@/models/Member'
import { getCurrentUser } from '@/lib/auth'
import { publicationSchema } from '@/lib/validations/publication'

// GET all publications (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const year = searchParams.get('year')
    
    const query: any = {}
    if (type) query.type = type
    if (year) query.year = parseInt(year)
    
    const publications = await Publication.find(query)
      .populate('authors')
      .sort({ year: -1, createdAt: -1 })

    return NextResponse.json({ publications })
  } catch (error) {
    console.error('Get publications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create publication (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = publicationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    // Check for duplicate slug
    const existing = await Publication.findOne({ slug: validationResult.data.slug })
    if (existing) {
      return NextResponse.json(
        { error: 'A publication with this slug already exists' },
        { status: 409 }
      )
    }

    // Create publication
    const publication = await Publication.create(validationResult.data)

    // Bidirectional sync: Add publication to all authors' publications array
    if (validationResult.data.authors && validationResult.data.authors.length > 0) {
      await Member.updateMany(
        { _id: { $in: validationResult.data.authors } },
        { $addToSet: { publications: publication._id } }
      )
    }

    const populatedPublication = await Publication.findById(publication._id).populate('authors')

    return NextResponse.json({ publication: populatedPublication }, { status: 201 })
  } catch (error) {
    console.error('Create publication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
