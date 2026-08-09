import Publication from '@/models/Publication'
import { connectDB } from '@/lib/mongodb'
import type { PublicationType } from '@/constants/publicationTypes'
import type { PublicationInput } from '@/validators/publication'

export interface PublicationFilters {
  type?: PublicationType
  year?: number
  authorId?: string
  researchAreaId?: string
}

function buildPublicationFilter(filters: PublicationFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {}
  if (filters.type) query.type = filters.type
  if (filters.year) query.year = filters.year
  if (filters.authorId) query.authors = filters.authorId
  if (filters.researchAreaId) query.researchAreas = filters.researchAreaId
  return query
}

export async function listPublications(
  filters: PublicationFilters = {},
  options: {
    populate?: boolean
    authorSelect?: string
    select?: string
    sort?: Record<string, 1 | -1>
    limit?: number
    skip?: number
  } = {}
) {
  await connectDB()
  let query = Publication.find(buildPublicationFilter(filters) as any)
  if (options.select) query = query.select(options.select)
  if (options.populate) {
    query = query
      .populate({ path: 'authors', select: options.authorSelect })
      .populate('researchAreas')
  }
  query = query.sort(options.sort || { type: 1, displayOrder: 1, year: -1, createdAt: -1 })
  if (options.skip !== undefined) query = query.skip(options.skip)
  if (options.limit !== undefined) query = query.limit(options.limit)
  return query.lean()
}

export async function getPublicationById(id: string, populate = false) {
  await connectDB()
  let query = Publication.findById(id)
  if (populate) query = query.populate('authors').populate('researchAreas')
  return query.lean()
}

export async function publicationSlugExists(slug: string, excludedId?: string) {
  await connectDB()
  const filter = excludedId ? { slug, _id: { $ne: excludedId } } : { slug }
  return Boolean(await Publication.exists(filter))
}

export async function getNextPublicationDisplayOrder(type: PublicationType, excludedId?: string) {
  await connectDB()
  const filter = excludedId ? { type, _id: { $ne: excludedId } } : { type }
  const last = await Publication.findOne(filter).sort({ displayOrder: -1, year: -1 }).lean()
  return (last?.displayOrder || 0) + 1
}

export async function shiftPublicationDisplayOrder(
  type: PublicationType,
  displayOrder: number,
  excludedId?: string
) {
  await connectDB()
  const filter = excludedId
    ? { type, displayOrder: { $gte: displayOrder }, _id: { $ne: excludedId } }
    : { type, displayOrder: { $gte: displayOrder } }
  await Publication.updateMany(filter, { $inc: { displayOrder: 1 } })
}

export async function createPublication(data: PublicationInput) {
  await connectDB()
  const created = await Publication.create(data)
  return created.toObject()
}

export async function updatePublication(id: string, data: PublicationInput) {
  await connectDB()
  return Publication.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).populate('authors').populate('researchAreas').lean()
}

export async function deletePublication(id: string) {
  await connectDB()
  return Publication.findByIdAndDelete(id).lean()
}

export async function removeMemberFromPublications(memberId: string) {
  await connectDB()
  await Publication.updateMany({ authors: memberId }, { $pull: { authors: memberId } })
}

export async function removeResearchAreaFromPublications(researchAreaId: string) {
  await connectDB()
  await Publication.updateMany(
    { researchAreas: researchAreaId },
    { $pull: { researchAreas: researchAreaId } }
  )
}

export async function countPublications(type?: PublicationType) {
  await connectDB()
  return Publication.countDocuments(type ? { type } : {})
}
