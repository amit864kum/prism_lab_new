import Sponsor from '@/models/Sponsor'
import { connectDB } from '@/lib/mongodb'
import type { SponsorInput } from '@/validators/sponsor'

export async function listSponsors(limit?: number, skip?: number) {
  await connectDB()
  let query = Sponsor.find().sort({ order: 1 })
  if (skip !== undefined) query = query.skip(skip)
  if (limit !== undefined) query = query.limit(limit)
  return query.lean()
}

export async function getSponsorById(id: string) {
  await connectDB()
  return Sponsor.findById(id).lean()
}

export async function createSponsor(data: SponsorInput) {
  await connectDB()
  const created = await Sponsor.create(data)
  return created.toObject()
}

export async function updateSponsor(id: string, data: SponsorInput) {
  await connectDB()
  return Sponsor.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}

export async function deleteSponsor(id: string) {
  await connectDB()
  return Sponsor.findByIdAndDelete(id).lean()
}

export async function countSponsors() {
  await connectDB()
  return Sponsor.countDocuments()
}
