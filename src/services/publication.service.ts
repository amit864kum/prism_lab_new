import type { PublicationInput } from '@/validators/publication'
import type { PublicationType } from '@/constants/publicationTypes'
import { normalizePublicationType } from '@/constants/publicationTypes'
import {
  createPublication,
  deletePublication,
  getNextPublicationDisplayOrder,
  getPublicationById,
  listPublications,
  publicationSlugExists,
  shiftPublicationDisplayOrder,
  updatePublication,
} from '@/repositories/publication.repository'
import {
  addPublicationToMembers,
  removePublicationFromMembers,
} from '@/repositories/member.repository'
import {
  addPublicationToResearchAreas,
  removePublicationFromResearchAreas,
} from '@/repositories/research-area.repository'
import {
  prepareUploadForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

function normalizePublication<T extends Record<string, any>>(publication: T) {
  return { ...publication, type: normalizePublicationType(publication.type) }
}

export async function getPublications(
  filters: { type?: PublicationType; year?: number } = {},
  pagination: { limit?: number; skip?: number } = {}
) {
  const publications = await listPublications(filters, { populate: true, ...pagination })
  return publications.map(normalizePublication)
}

export async function getPublication(id: string) {
  const publication = await getPublicationById(id, true)
  return publication ? normalizePublication(publication as any) : null
}

export async function addPublication(input: PublicationInput) {
  if (await publicationSlugExists(input.slug)) {
    return { conflict: true as const, publication: null }
  }

  const data = { ...input, type: normalizePublicationType(input.type) }
  data.displayOrder = data.displayOrder || (await getNextPublicationDisplayOrder(data.type))
  await shiftPublicationDisplayOrder(data.type, data.displayOrder)

  const upload = await prepareUploadForPersistence(data.pdfUrl, 'publications')
  data.pdfUrl = upload.url
  let created
  try {
    created = await createPublication(data)
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
  await Promise.all([
    addPublicationToMembers(data.authors, created._id),
    addPublicationToResearchAreas(data.researchAreas || [], created._id),
  ])

  const populated = await getPublicationById(created._id.toString(), true)
  return {
    conflict: false as const,
    publication: populated ? normalizePublication(populated as any) : null,
  }
}

export async function editPublication(id: string, input: PublicationInput) {
  const current = await getPublicationById(id)
  if (!current) {
    return { conflict: false as const, notFound: true as const, publication: null }
  }
  if (await publicationSlugExists(input.slug, id)) {
    return { conflict: true as const, notFound: false as const, publication: null }
  }

  const data = { ...input, type: normalizePublicationType(input.type) }
  data.displayOrder = data.displayOrder || (await getNextPublicationDisplayOrder(data.type, id))

  if (current.type !== data.type || current.displayOrder !== data.displayOrder) {
    await shiftPublicationDisplayOrder(data.type, data.displayOrder, id)
  }
  const upload = await prepareUploadForPersistence(data.pdfUrl, 'publications')
  data.pdfUrl = upload.url

  const oldAuthors = current.authors.map((author) => author.toString())
  const removedAuthors = oldAuthors.filter((author) => !data.authors.includes(author))
  const addedAuthors = data.authors.filter((author) => !oldAuthors.includes(author))

  const oldResearchAreas = (current.researchAreas || []).map((area) => area.toString())
  const newResearchAreas = data.researchAreas || []
  const removedResearchAreas = oldResearchAreas.filter((area) => !newResearchAreas.includes(area))
  const addedResearchAreas = newResearchAreas.filter((area) => !oldResearchAreas.includes(area))

  let updated
  try {
    await Promise.all([
      removePublicationFromMembers(removedAuthors, id),
      addPublicationToMembers(addedAuthors, id),
      removePublicationFromResearchAreas(removedResearchAreas, id),
      addPublicationToResearchAreas(addedResearchAreas, id),
    ])
    updated = await updatePublication(id, data)
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
  await replaceStoredFile(current.pdfUrl, data.pdfUrl)
  return {
    conflict: false as const,
    notFound: false as const,
    publication: updated ? normalizePublication(updated as any) : null,
  }
}

export async function removePublication(id: string) {
  const publication = await getPublicationById(id)
  if (!publication) return null

  await Promise.all([
    removePublicationFromMembers(publication.authors.map((author) => author.toString()), id),
    removePublicationFromResearchAreas(
      (publication.researchAreas || []).map((area) => area.toString()),
      id
    ),
  ])
  await deletePublication(id)
  await removeStoredFile(publication.pdfUrl)
  return publication
}
