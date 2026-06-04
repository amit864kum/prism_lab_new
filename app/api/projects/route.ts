import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import { getCurrentUser } from '@/lib/auth'
import { projectSchema } from '@/lib/validations/content'

// GET all projects (public)
export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find().sort({ createdAt: -1 })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create project (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = projectSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    const existing = await Project.findOne({ slug: validationResult.data.slug })
    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      )
    }

    const project = await Project.create(validationResult.data)

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
