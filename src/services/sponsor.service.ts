import type { SponsorInput } from '@/validators/sponsor'
import {
  createSponsor,
  deleteSponsor,
  getSponsorById,
  listSponsors,
  updateSponsor,
} from '@/repositories/sponsor.repository'
import {
  prepareUploadForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export const getSponsors = listSponsors
export const getSponsor = getSponsorById

export async function addSponsor(data: SponsorInput) {
  const upload = await prepareUploadForPersistence(data.logoUrl, 'sponsors')
  try {
    return await createSponsor({ ...data, logoUrl: upload.url || data.logoUrl })
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function editSponsor(id: string, data: SponsorInput) {
  const current = await getSponsorById(id)
  if (!current) return null
  const upload = await prepareUploadForPersistence(data.logoUrl, 'sponsors')
  try {
    const logoUrl = upload.url || data.logoUrl
    const updated = await updateSponsor(id, { ...data, logoUrl })
    await replaceStoredFile(current.logoUrl, logoUrl)
    return updated
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function removeSponsor(id: string) {
  const current = await getSponsorById(id)
  if (!current) return null
  const deleted = await deleteSponsor(id)
  if (deleted) await removeStoredFile(current.logoUrl)
  return deleted
}
