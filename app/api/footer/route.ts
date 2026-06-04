import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Footer from '@/models/Footer'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const footerSchema = z.object({
  copyrightText: z.string().min(1, 'Copyright text is required').trim(),
  developerName: z.string().min(1, 'Developer name is required').trim(),
  developerLink: z.string().url('Invalid developer link URL').trim(),
})

// GET footer settings (public)
export async function GET() {
  try {
    await connectDB()
    let footer = await Footer.findOne()

    if (!footer) {
      // Seed default footer if it doesn't exist
      footer = await Footer.create({
        copyrightText: '© 2026 Prism Lab, IIT Patna. All rights reserved.',
        developerName: 'Designed & Developed by Amit Kumar',
        developerLink: 'https://amit-three.vercel.app/',
      })
    }

    return NextResponse.json({ footer })
  } catch (error) {
    console.error('Get footer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update footer settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = footerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    await connectDB()

    let footer = await Footer.findOne()
    if (footer) {
      footer.copyrightText = validationResult.data.copyrightText
      footer.developerName = validationResult.data.developerName
      footer.developerLink = validationResult.data.developerLink
      await footer.save()
    } else {
      footer = await Footer.create(validationResult.data)
    }

    return NextResponse.json({ footer })
  } catch (error) {
    console.error('Update footer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
