import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { memberSchema } from '@/validators/member'
import type { MemberRole } from '@/constants/roles'
import type { MemberStatus } from '@/constants/memberStatus'
import { addMember, getMembers } from '@/services/member.service'
import { paginateResults, parsePagination } from '@/lib/pagination'

// GET all members (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    const paginationOptions = parsePagination(searchParams)
    const results = await getMembers(
      {
        status: status as MemberStatus | undefined,
        role: role as MemberRole | undefined,
      },
      { limit: paginationOptions.queryLimit, skip: paginationOptions.skip }
    )
    const { items: members, pagination } = paginateResults(results, paginationOptions)

    return NextResponse.json({ members, pagination })
  } catch (error) {
    return handleApiError(error, 'get.members')
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

    const result = await addMember(validationResult.data)
    if (result.conflict) {
      return NextResponse.json(
        { error: 'A member with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({ member: result.member }, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'create.member')
  }
}
