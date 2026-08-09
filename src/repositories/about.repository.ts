import AboutSection from '@/models/AboutSection'
import { connectDB } from '@/lib/mongodb'

const DEFAULT_ABOUT_CONTENT = 'Welcome to Prism Lab at IIT Patna.'

export async function getAboutSection() {
  await connectDB()
  return AboutSection.findOne().lean()
}

export async function getOrCreateAboutSection() {
  await connectDB()
  const existing = await AboutSection.findOne().lean()
  if (existing) return existing

  const created = await AboutSection.create({ content: DEFAULT_ABOUT_CONTENT })
  return created.toObject()
}

export async function upsertAboutSection(data: { content: string }) {
  await connectDB()
  const existing = await AboutSection.findOne().select('_id').lean()

  if (!existing) {
    const created = await AboutSection.create(data)
    return created.toObject()
  }

  return AboutSection.findByIdAndUpdate(existing._id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}
