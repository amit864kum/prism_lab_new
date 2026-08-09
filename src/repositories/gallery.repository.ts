import GalleryImage from '@/models/GalleryImage'
import { connectDB } from '@/lib/mongodb'
import type { GalleryImageInput } from '@/validators/gallery'

export async function listGalleryImages(category?: string | null, limit?: number, skip?: number) {
  await connectDB()
  let query = GalleryImage.find(category ? { category } : {}).sort({ uploadDate: -1 })
  if (skip !== undefined) query = query.skip(skip)
  if (limit !== undefined) query = query.limit(limit)
  return query.lean()
}

export async function getGalleryImageById(id: string) {
  await connectDB()
  return GalleryImage.findById(id).lean()
}

export async function createGalleryImage(data: GalleryImageInput) {
  await connectDB()
  const created = await GalleryImage.create(data)
  return created.toObject()
}

export async function updateGalleryImage(id: string, data: GalleryImageInput) {
  await connectDB()
  return GalleryImage.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}

export async function deleteGalleryImage(id: string) {
  await connectDB()
  return GalleryImage.findByIdAndDelete(id).lean()
}

export async function countGalleryImages() {
  await connectDB()
  return GalleryImage.countDocuments()
}
