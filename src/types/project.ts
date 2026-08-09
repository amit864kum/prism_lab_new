export type ProjectStatus = 'ongoing' | 'completed'

export interface IProject {
  _id: string
  title: string
  slug: string
  description: string
  objective?: string
  objectivePoints?: string[]
  projectAmount?: string
  sponsoredAgency?: string
  detailedSummary?: string
  links?: { title: string; url: string }[]
  status: ProjectStatus
  startDate?: Date
  endDate?: Date
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}
