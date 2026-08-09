export const PUBLICATION_TYPES = [
  'journal',
  'conference',
  'book-chapter',
  'dataset',
  'patent',
  'invited-talk',
] as const

export type PublicationType = (typeof PUBLICATION_TYPES)[number]

export const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  journal: 'Journals',
  conference: 'Conferences',
  'book-chapter': 'Book Chapters',
  dataset: 'Datasets',
  patent: 'Patents',
  'invited-talk': 'Invited Talks',
}

export const LEGACY_PUBLICATION_TYPE_MAP: Record<string, PublicationType> = {
  'Journal Article': 'journal',
  journal: 'journal',
  Journal: 'journal',
  'Conference Paper': 'conference',
  'Workshop Paper': 'conference',
  conference: 'conference',
  Conference: 'conference',
  'Book Chapter': 'book-chapter',
  'Book Chapters': 'book-chapter',
  book: 'book-chapter',
  'book-chapter': 'book-chapter',
  dataset: 'dataset',
  Dataset: 'dataset',
  patent: 'patent',
  Patent: 'patent',
  'Invited Talk': 'invited-talk',
  'Invited Talks': 'invited-talk',
  'invited-talk': 'invited-talk',
}

export function normalizePublicationType(type: unknown): PublicationType {
  return typeof type === 'string' ? LEGACY_PUBLICATION_TYPE_MAP[type] || 'conference' : 'conference'
}

export function getPublicationTypeLabel(type: unknown) {
  return PUBLICATION_TYPE_LABELS[normalizePublicationType(type)]
}
