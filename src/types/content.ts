import type { Document } from 'mongoose'

export interface IAboutSection {
  _id: string
  content: string
  updatedAt: Date
  createdAt: Date
}

export interface IFooter extends Document {
  copyrightText: string
  developerName: string
  developerLink: string
  prismLogoUrl?: string
  address?: string
  contactNumber?: string
  email?: string
  googleMapsEmbedUrl?: string
  heroPublicationsCount?: number | null
  heroResearchAreasCount?: number | null
  heroScholarsCount?: number | null
  heroProjectsCount?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface ISponsor {
  _id: string
  name: string
  logoUrl: string
  websiteUrl?: string
  order: number
  createdAt: Date
  updatedAt: Date
}
