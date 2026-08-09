import PIProfile from '@/models/PIProfile'
import { connectDB } from '@/lib/mongodb'
import type { PIProfileInput } from '@/validators/pi-profile'

export async function getPIProfile() {
  await connectDB()
  const profile = await PIProfile.findOne()
  return profile && typeof profile.toObject === 'function' ? profile.toObject() : profile
}

export async function piProfileExists() {
  await connectDB()
  return Boolean(await PIProfile.exists({}))
}

export async function createPIProfile(data: PIProfileInput) {
  await connectDB()
  const created = await PIProfile.create(data)
  return created.toObject()
}

export async function upsertPIProfile(data: PIProfileInput) {
  await connectDB()
  const existing = await PIProfile.findOne().select('_id').lean()
  if (!existing) return createPIProfile(data)
  return PIProfile.findByIdAndUpdate(existing._id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}
