import ResearchArea from '@/models/ResearchArea'
import { connectDB } from '@/lib/mongodb'
import type { ResearchAreaInput } from '@/validators/research'

export async function listResearchAreas(limit?: number, skip?: number) {
  await connectDB()
  let query = ResearchArea.find().sort({ order: 1 })
  if (skip !== undefined) query = query.skip(skip)
  if (limit !== undefined) query = query.limit(limit)
  return query.lean()
}

export async function listResearchAreaSlugs() {
  await connectDB()
  return ResearchArea.find().select('slug').lean()
}

export async function getResearchAreaById(id: string) {
  await connectDB()
  return ResearchArea.findById(id).lean()
}

export async function getResearchAreaBySlug(slug: string, populatePublications = false) {
  await connectDB()
  let query = ResearchArea.findOne({ slug })
  if (populatePublications) {
    query = query.populate({
      path: 'publications',
      populate: { path: 'authors', select: 'name slug role' },
    })
  }
  return query.lean()
}

export async function researchAreaSlugExists(slug: string, excludedId?: string) {
  await connectDB()
  const filter = excludedId ? { slug, _id: { $ne: excludedId } } : { slug }
  return Boolean(await ResearchArea.exists(filter))
}

export async function createResearchArea(data: ResearchAreaInput) {
  await connectDB()
  const created = await ResearchArea.create(data)
  return created.toObject()
}

export async function updateResearchArea(id: string, data: ResearchAreaInput) {
  await connectDB()
  return ResearchArea.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}

export async function deleteResearchArea(id: string) {
  await connectDB()
  return ResearchArea.findByIdAndDelete(id).lean()
}

export async function addPublicationToResearchAreas(areaIds: readonly string[], publicationId: unknown) {
  await connectDB()
  if (!areaIds.length) return
  await ResearchArea.updateMany(
    { _id: { $in: areaIds } },
    { $addToSet: { publications: publicationId } }
  )
}

export async function removePublicationFromResearchAreas(areaIds: readonly string[], publicationId: unknown) {
  await connectDB()
  if (!areaIds.length) return
  await ResearchArea.updateMany(
    { _id: { $in: areaIds } },
    { $pull: { publications: publicationId } }
  )
}

export async function countResearchAreas() {
  await connectDB()
  return ResearchArea.countDocuments()
}
