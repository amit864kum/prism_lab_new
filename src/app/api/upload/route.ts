import { handleApiError } from '@/lib/errors/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { normalizeStorageCategory, uploadFile } from '@/services/storage.service'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const type = formData.get('type') as 'image' | 'pdf'
    const requestedCategory = formData.get('subfolder')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!type || !['image', 'pdf'].includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if (typeof requestedCategory !== 'string' || !normalizeStorageCategory(requestedCategory)) {
      return NextResponse.json({ error: 'Invalid upload category' }, { status: 400 })
    }

    const result = await uploadFile(file, type, requestedCategory)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ url: result.url })
  } catch (error) {
    return handleApiError(error, 'upload.create', request)
  }
}
