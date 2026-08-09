import { getOrCreateFooter, upsertFooter } from '@/repositories/footer.repository'
import {
  prepareUploadForPersistence,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export const getFooterSettings = getOrCreateFooter

export async function updateFooterSettings(data: Record<string, unknown>) {
  const current = await getOrCreateFooter()
  const requestedLogo = typeof data.prismLogoUrl === 'string' ? data.prismLogoUrl : undefined
  const upload = await prepareUploadForPersistence(requestedLogo, 'logos')

  try {
    const nextData = upload.url ? { ...data, prismLogoUrl: upload.url } : data
    const footer = await upsertFooter(nextData)
    await replaceStoredFile(current.prismLogoUrl, nextData.prismLogoUrl as string | undefined)
    return footer
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}
