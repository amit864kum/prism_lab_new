import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Member from '@/models/Member'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    await connectDB()

    const query = q
      ? { name: { $regex: q, $options: 'i' } }
      : {}

    const members = await Member.find(query)
      .select('_id name role')
      .limit(10)
      .lean()

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Member autocomplete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
