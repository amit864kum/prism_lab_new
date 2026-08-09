import type { Types } from 'mongoose'
import type { MemberRole } from '@/constants/roles'
import type { MemberStatus } from '@/constants/memberStatus'

export interface IMember {
  _id: string
  name: string
  slug: string
  role: MemberRole
  status: MemberStatus
  yearJoined?: number
  yearLeft?: number
  imageUrl?: string
  bio?: string
  email?: string
  linkedinUrl?: string
  googleScholarUrl?: string
  githubUrl?: string
  personalPortfolioWebsite?: string
  resumePdf?: string
  displayOrder?: number
  publications: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface MemberGroup {
  phdScholars: IMember[]
  otherScholarsByYear: Array<{
    year: number
    ongoing: IMember[]
    completed: IMember[]
  }>
  unspecifiedYear: {
    ongoing: IMember[]
    completed: IMember[]
  }
}
