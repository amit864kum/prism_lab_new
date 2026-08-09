import type { HeroSlideInput } from '@/validators/hero'
import {
  createHeroSlide,
  deleteHeroSlide,
  getHeroSlideById,
  listHeroSlides,
  updateHeroSlide,
} from '@/repositories/hero.repository'
import {
  prepareUploadForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export function getHeroSlides(includeInactive = false) {
  return listHeroSlides(includeInactive, includeInactive ? undefined : 3)
}

export const getHeroSlide = getHeroSlideById

export async function addHeroSlide(data: HeroSlideInput) {
  const upload = await prepareUploadForPersistence(data.imageUrl, 'hero')
  try {
    return await createHeroSlide({ ...data, imageUrl: upload.url || data.imageUrl })
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function editHeroSlide(id: string, data: HeroSlideInput) {
  const current = await getHeroSlideById(id)
  if (!current) return null
  const upload = await prepareUploadForPersistence(data.imageUrl, 'hero')
  try {
    const imageUrl = upload.url || data.imageUrl
    const updated = await updateHeroSlide(id, { ...data, imageUrl })
    await replaceStoredFile(current.imageUrl, imageUrl)
    return updated
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function removeHeroSlide(id: string) {
  const current = await getHeroSlideById(id)
  if (!current) return null
  const deleted = await deleteHeroSlide(id)
  if (deleted) await removeStoredFile(current.imageUrl)
  return deleted
}
