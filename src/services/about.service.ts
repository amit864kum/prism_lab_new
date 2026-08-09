import type { AboutSectionInput } from '@/validators/about'
import { getOrCreateAboutSection, upsertAboutSection } from '@/repositories/about.repository'

export const getAboutContent = getOrCreateAboutSection

export function updateAboutContent(data: AboutSectionInput) {
  return upsertAboutSection(data)
}
