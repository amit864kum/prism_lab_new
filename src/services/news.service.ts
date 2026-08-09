import type { NewsItemInput } from '@/validators/news'
import {
  createNewsItem,
  deleteNewsItem,
  getNewsItemById,
  listNewsItems,
  updateNewsItem,
} from '@/repositories/news.repository'
import {
  prepareUploadForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export const getNewsItems = listNewsItems
export const getNewsItem = getNewsItemById

export async function addNewsItem(data: NewsItemInput) {
  const upload = await prepareUploadForPersistence(data.imageUrl, 'news')
  try {
    return await createNewsItem({ ...data, imageUrl: upload.url })
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function editNewsItem(id: string, data: NewsItemInput) {
  const current = await getNewsItemById(id)
  if (!current) return null
  const upload = await prepareUploadForPersistence(data.imageUrl, 'news')
  try {
    const updated = await updateNewsItem(id, { ...data, imageUrl: upload.url })
    await replaceStoredFile(current.imageUrl, upload.url)
    return updated
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function removeNewsItem(id: string) {
  const current = await getNewsItemById(id)
  if (!current) return null
  const deleted = await deleteNewsItem(id)
  if (deleted) await removeStoredFile(current.imageUrl)
  return deleted
}
