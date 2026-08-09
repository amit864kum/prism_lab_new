import Member from '@/models/Member'
import { connectDB } from '@/lib/mongodb'
import type { MemberRole } from '@/constants/roles'
import type { MemberStatus } from '@/constants/memberStatus'
import type { MemberInput } from '@/validators/member'

export interface MemberFilters {
  role?: MemberRole
  status?: MemberStatus
  statuses?: MemberStatus[]
  roles?: MemberRole[]
  roleContains?: string
  search?: string
}

function buildMemberFilter(filters: MemberFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {}
  if (filters.role) query.role = filters.role
  if (filters.roles) query.role = { $in: filters.roles }
  if (filters.roleContains) query.role = { $regex: new RegExp(filters.roleContains, 'i') }
  if (filters.status) query.status = filters.status
  if (filters.statuses) query.status = { $in: filters.statuses }
  if (filters.search) query.name = { $regex: filters.search, $options: 'i' }
  return query
}

export async function listMembers(
  filters: MemberFilters = {},
  options: {
    populatePublications?: boolean
    limit?: number
    skip?: number
    sort?: Record<string, 1 | -1>
  } = {}
) {
  await connectDB()
  let query = Member.find(buildMemberFilter(filters) as any).sort(
    options.sort || { role: 1, displayOrder: 1, yearJoined: -1 }
  )
  if (options.populatePublications) query = query.populate('publications')
  if (options.skip !== undefined) query = query.skip(options.skip)
  if (options.limit !== undefined) query = query.limit(options.limit)
  return query.lean()
}

export async function listCurrentMemberSitemapEntries() {
  await connectDB()
  return Member.find({ status: 'current' }).select('_id').lean()
}

export async function listMemberAutocomplete(search: string, role?: MemberRole, status?: MemberStatus) {
  await connectDB()
  const filter = buildMemberFilter({ search, role, status })
  return Member.find(filter as any)
    .select('_id name role')
    .sort({ name: 1 })
    .limit(10)
    .lean()
}

export async function getMemberById(id: string, populatePublications = false) {
  await connectDB()
  let query = Member.findById(id)
  if (populatePublications) query = query.populate('publications')
  return query.lean()
}

export async function getMemberBySlug(slug: string) {
  await connectDB()
  return Member.findOne({ slug }).lean()
}

export async function getMemberByExactName(name: string) {
  await connectDB()
  const member = await Member.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } })
  return member && typeof member.toObject === 'function' ? member.toObject() : member
}

export async function getMemberBySlugOrId(value: string) {
  const bySlug = await getMemberBySlug(value)
  if (bySlug || !/^[0-9a-fA-F]{24}$/.test(value)) return bySlug
  return getMemberById(value)
}

export async function memberSlugExists(slug: string, excludedId?: string) {
  await connectDB()
  const filter = excludedId ? { slug, _id: { $ne: excludedId } } : { slug }
  return Boolean(await Member.exists(filter))
}

export async function getNextMemberDisplayOrder(role: MemberRole, excludedId?: string) {
  await connectDB()
  const filter = excludedId ? { role, _id: { $ne: excludedId } } : { role }
  const last = await Member.findOne(filter).sort({ displayOrder: -1, yearJoined: -1 }).lean()
  return (last?.displayOrder || 0) + 1
}

export async function shiftMemberDisplayOrder(role: MemberRole, displayOrder: number, excludedId?: string) {
  await connectDB()
  const filter = excludedId
    ? { role, displayOrder: { $gte: displayOrder }, _id: { $ne: excludedId } }
    : { role, displayOrder: { $gte: displayOrder } }
  await Member.updateMany(filter, { $inc: { displayOrder: 1 } })
}

export async function createMember(data: MemberInput) {
  await connectDB()
  const created = await Member.create(data)
  return created.toObject()
}

export async function updateMember(id: string, data: MemberInput) {
  await connectDB()
  return Member.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).populate('publications').lean()
}

export async function deleteMember(id: string) {
  await connectDB()
  return Member.findByIdAndDelete(id).lean()
}

export async function addPublicationToMembers(memberIds: readonly string[], publicationId: unknown) {
  await connectDB()
  if (!memberIds.length) return
  await Member.updateMany({ _id: { $in: memberIds } }, { $addToSet: { publications: publicationId } })
}

export async function removePublicationFromMembers(memberIds: readonly string[], publicationId: unknown) {
  await connectDB()
  if (!memberIds.length) return
  await Member.updateMany({ _id: { $in: memberIds } }, { $pull: { publications: publicationId } })
}

export async function countMembers(filters: MemberFilters = {}) {
  await connectDB()
  return Member.countDocuments(buildMemberFilter(filters) as any)
}

export async function countCurrentPhdMembers() {
  await connectDB()
  return Member.countDocuments({ status: 'current', role: { $regex: /phd/i } })
}
