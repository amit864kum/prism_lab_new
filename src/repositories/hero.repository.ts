import HeroSlide from '@/models/HeroSlide'
import { connectDB } from '@/lib/mongodb'
import type { HeroSlideInput } from '@/validators/hero'

export async function listHeroSlides(includeInactive = false, limit?: number) {
  await connectDB()
  let query = HeroSlide.find(includeInactive ? {} : { isActive: true }).sort({ order: 1 })
  if (limit !== undefined) query = query.limit(limit)
  return query.lean()
}

export async function getHeroSlideById(id: string) {
  await connectDB()
  return HeroSlide.findById(id).lean()
}

export async function createHeroSlide(data: HeroSlideInput) {
  await connectDB()
  const created = await HeroSlide.create(data)
  return created.toObject()
}

export async function updateHeroSlide(id: string, data: HeroSlideInput) {
  await connectDB()
  return HeroSlide.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}

export async function deleteHeroSlide(id: string) {
  await connectDB()
  return HeroSlide.findByIdAndDelete(id).lean()
}

export async function countHeroSlides() {
  await connectDB()
  return HeroSlide.countDocuments()
}
