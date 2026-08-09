import type { GalleryImageInput } from '@/validators/gallery'
import {
  createGalleryImage,
  deleteGalleryImage,
  getGalleryImageById,
  listGalleryImages,
  updateGalleryImage,
} from '@/repositories/gallery.repository'
import {
  prepareUploadForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export function getGalleryImages(category?: string | null, limit?: number, skip?: number) {
  return listGalleryImages(category, limit, skip)
}

export const getGalleryImage = getGalleryImageById

export async function addGalleryImage(data: GalleryImageInput) {
  const upload = await prepareUploadForPersistence(data.imageUrl, 'gallery')
  try {
    return await createGalleryImage({ ...data, imageUrl: upload.url || data.imageUrl })
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function editGalleryImage(id: string, data: GalleryImageInput) {
  const current = await getGalleryImageById(id)
  if (!current) return null
  const upload = await prepareUploadForPersistence(data.imageUrl, 'gallery')
  try {
    const imageUrl = upload.url || data.imageUrl
    const updated = await updateGalleryImage(id, { ...data, imageUrl })
    await replaceStoredFile(current.imageUrl, imageUrl)
    return updated
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function removeGalleryImage(id: string) {
  const current = await getGalleryImageById(id)
  if (!current) return null
  const deleted = await deleteGalleryImage(id)
  if (deleted) await removeStoredFile(current.imageUrl)
  return deleted
}
