import type { Types } from 'mongoose'
import type { PublicationType } from '@/constants/publicationTypes'

export interface IPublication {
  _id: string
  title: string
  slug: string
  type: PublicationType
  authors: Types.ObjectId[]
  externalAuthors: string[]
  researchAreas?: Types.ObjectId[]
  year: number
  venue?: string
  journalName?: string
  doiLink?: string
  description?: string
  datasetLink?: string
  location?: string
  talkType?: string
  date?: string
  displayOrder?: number
  abstract?: string
  pdfUrl?: string
  externalUrl?: string
  tags: string[]
  profileOnly: boolean
  createdAt: Date
  updatedAt: Date
}
