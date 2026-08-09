import Footer from '@/models/Footer'
import { connectDB } from '@/lib/mongodb'

export const DEFAULT_FOOTER = {
  copyrightText: '© 2026 Prism Lab, IIT Patna. All rights reserved.',
  developerName: 'Designed & Developed by Amit Kumar',
  developerLink: 'https://amit-three.vercel.app/',
  prismLogoUrl: '',
  address: '',
  contactNumber: '',
  email: '',
  googleMapsEmbedUrl: '',
  heroPublicationsCount: null,
  heroResearchAreasCount: null,
  heroScholarsCount: null,
  heroProjectsCount: null,
}

export async function getFooter() {
  await connectDB()
  return Footer.findOne().lean()
}

export async function getOrCreateFooter() {
  await connectDB()
  const existing = await Footer.findOne().lean()
  if (existing) return existing
  const created = await Footer.create(DEFAULT_FOOTER)
  return created.toObject()
}

export async function upsertFooter(data: Record<string, unknown>) {
  await connectDB()
  const existing = await Footer.findOne().select('_id').lean()
  if (!existing) {
    const created = await Footer.create(data)
    return created.toObject()
  }
  return Footer.findByIdAndUpdate(existing._id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}
