import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { projectSchema } from '@/validators/project'
import { addProject, getProjects } from '@/services/project.service'
import { paginateResults, parsePagination } from '@/lib/pagination'

// GET all projects (public)
export async function GET(request: NextRequest) {
  try {
    const paginationOptions = parsePagination(new URL(request.url).searchParams)
    const results = await getProjects(
      { createdAt: -1 },
      paginationOptions.queryLimit,
      paginationOptions.skip
    )
    const { items: projects, pagination } = paginateResults(results, paginationOptions)

    return NextResponse.json({ projects, pagination })
  } catch (error) {
    return handleApiError(error, 'get.projects')
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

    const result = await addProject(validationResult.data)
    if (result.conflict) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({ project: result.project }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.project')
  }
}
