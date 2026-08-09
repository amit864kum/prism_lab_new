import type { MemberInput } from '@/validators/member'
import type { MemberFilters } from '@/repositories/member.repository'
import {
  createMember,
  deleteMember,
  getMemberById,
  getNextMemberDisplayOrder,
  listMemberAutocomplete,
  listMembers,
  memberSlugExists,
  shiftMemberDisplayOrder,
  updateMember,
} from '@/repositories/member.repository'
import { removeMemberFromPublications } from '@/repositories/publication.repository'
import {
  prepareUploadsForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUploads,
} from '@/services/storage.service'

export function getMembers(
  filters: MemberFilters = {},
  pagination: { limit?: number; skip?: number } = {}
) {
  return listMembers(filters, { populatePublications: true, ...pagination })
}

export function getMember(id: string) {
  return getMemberById(id, true)
}

export const getMemberAutocomplete = listMemberAutocomplete

export async function addMember(input: MemberInput) {
  if (await memberSlugExists(input.slug)) return { conflict: true as const, member: null }

  const data = { ...input }
  data.displayOrder = data.displayOrder || (await getNextMemberDisplayOrder(data.role))
  await shiftMemberDisplayOrder(data.role, data.displayOrder)

  const uploads = await prepareUploadsForPersistence([
    { url: data.imageUrl, category: 'members' },
    { url: data.resumePdf, category: 'resumes' },
  ])
  data.imageUrl = uploads[0].url
  data.resumePdf = uploads[1].url

  try {
    return { conflict: false as const, member: await createMember(data) }
  } catch (error) {
    await rollbackPreparedUploads(uploads)
    throw error
  }
}

export async function editMember(id: string, input: MemberInput) {
  if (await memberSlugExists(input.slug, id)) {
    return { conflict: true as const, notFound: false as const, member: null }
  }

  const current = await getMemberById(id)
  if (!current) return { conflict: false as const, notFound: true as const, member: null }

  const data = { ...input }
  data.displayOrder = data.displayOrder || (await getNextMemberDisplayOrder(data.role, id))

  if (current.role !== data.role || current.displayOrder !== data.displayOrder) {
    await shiftMemberDisplayOrder(data.role, data.displayOrder, id)
  }

  const uploads = await prepareUploadsForPersistence([
    { url: data.imageUrl, category: 'members' },
    { url: data.resumePdf, category: 'resumes' },
  ])
  data.imageUrl = uploads[0].url
  data.resumePdf = uploads[1].url

  try {
    const member = await updateMember(id, data)
    await Promise.all([
      replaceStoredFile(current.imageUrl, data.imageUrl),
      replaceStoredFile(current.resumePdf, data.resumePdf),
    ])
    return { conflict: false as const, notFound: false as const, member }
  } catch (error) {
    await rollbackPreparedUploads(uploads)
    throw error
  }
}

export async function removeMember(id: string) {
  const member = await getMemberById(id)
  if (!member) return null

  if (member.publications?.length) await removeMemberFromPublications(id)
  await deleteMember(id)
  await Promise.all([removeStoredFile(member.imageUrl), removeStoredFile(member.resumePdf)])
  return member
}
