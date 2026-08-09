import type { ResearchAreaInput } from '@/validators/research'
import {
  createResearchArea,
  deleteResearchArea,
  getResearchAreaById,
  listResearchAreas,
  researchAreaSlugExists,
  updateResearchArea,
} from '@/repositories/research-area.repository'
import { removeResearchAreaFromPublications } from '@/repositories/publication.repository'
import {
  prepareUploadForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export const getResearchAreas = listResearchAreas
export const getResearchArea = getResearchAreaById

export async function addResearchArea(data: ResearchAreaInput) {
  if (await researchAreaSlugExists(data.slug)) return { conflict: true as const, researchArea: null }
  const upload = await prepareUploadForPersistence(data.imageUrl, 'research')
  try {
    return {
      conflict: false as const,
      researchArea: await createResearchArea({ ...data, imageUrl: upload.url }),
    }
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function editResearchArea(id: string, data: ResearchAreaInput) {
  if (await researchAreaSlugExists(data.slug, id)) {
    return { conflict: true as const, researchArea: null }
  }
  const current = await getResearchAreaById(id)
  if (!current) return { conflict: false as const, researchArea: null }
  const upload = await prepareUploadForPersistence(data.imageUrl, 'research')
  try {
    const researchArea = await updateResearchArea(id, { ...data, imageUrl: upload.url })
    await replaceStoredFile(current.imageUrl, upload.url)
    return { conflict: false as const, researchArea }
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function removeResearchArea(id: string) {
  const current = await getResearchAreaById(id)
  if (!current) return null
  const researchArea = await deleteResearchArea(id)
  if (!researchArea) return null
  await removeResearchAreaFromPublications(id)
  await removeStoredFile(current.imageUrl)
  return researchArea
}
