import type { Types } from 'mongoose'

export interface IResearchArea {
  _id: string
  title: string
  slug: string
  description: string
  overview?: string
  imageUrl?: string
  order: number
  displayOrder?: number
  publications?: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}
