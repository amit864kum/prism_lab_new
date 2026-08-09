import type { PIProfileInput } from '@/validators/pi-profile'
import {
  createPIProfile,
  getPIProfile,
  piProfileExists,
  upsertPIProfile,
} from '@/repositories/pi-profile.repository'
import {
  prepareUploadForPersistence,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export const getPrincipalInvestigatorProfile = getPIProfile

export async function updatePrincipalInvestigatorProfile(data: PIProfileInput) {
  const current = await getPIProfile()
  const upload = await prepareUploadForPersistence(data.imageUrl, 'principal-investigator')
  try {
    const profile = await upsertPIProfile({ ...data, imageUrl: upload.url })
    await replaceStoredFile(current?.imageUrl, upload.url)
    return profile
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function addPrincipalInvestigatorProfile(data: PIProfileInput) {
  if (await piProfileExists()) return { conflict: true as const, profile: null }
  const upload = await prepareUploadForPersistence(data.imageUrl, 'principal-investigator')
  try {
    return {
      conflict: false as const,
      profile: await createPIProfile({ ...data, imageUrl: upload.url }),
    }
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}
