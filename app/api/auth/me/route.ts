import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const admin = await Admin.findById(user.userId).select('-passwordHash')

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
