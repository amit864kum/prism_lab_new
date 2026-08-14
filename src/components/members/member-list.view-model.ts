import type { MemberRole, MemberStatus } from '@/lib/member-options'

interface MemberListSource {
  _id: string | { toString(): string }
  name: string
  slug: string
  role: MemberRole
  status: MemberStatus
  yearJoined?: number | null
  imageUrl?: string
  bio?: string
  thesisTitle?: string
  currentPosition?: string
  email?: string
  linkedinUrl?: string
  googleScholarUrl?: string
  personalPortfolioWebsite?: string
  resumePdf?: string
  displayOrder?: number | null
  publications?: Array<string | { toString(): string }>
}

export interface MemberListViewModel {
  _id: string
  name: string
  slug: string
  role: MemberRole
  status: MemberStatus
  yearJoined: number | null
  imageUrl: string
  bio: string
  thesisTitle: string
  currentPosition: string
  email: string
  linkedinUrl: string
  googleScholarUrl: string
  personalPortfolioWebsite: string
  resumePdf: string
  displayOrder: number | null
  publications: string[]
}

export function toMemberListViewModel(member: MemberListSource): MemberListViewModel {
  return {
    _id: member._id.toString(),
    name: member.name,
    slug: member.slug,
    role: member.role,
    status: member.status,
    yearJoined: member.yearJoined || null,
    imageUrl: member.imageUrl || '',
    bio: member.bio || '',
    thesisTitle: member.thesisTitle || '',
    currentPosition: member.currentPosition || '',
    email: member.email || '',
    linkedinUrl: member.linkedinUrl || '',
    googleScholarUrl: member.googleScholarUrl || '',
    personalPortfolioWebsite: member.personalPortfolioWebsite || '',
    resumePdf: member.resumePdf || '',
    displayOrder: member.displayOrder || null,
    publications: member.publications?.map((publication) => publication.toString()) || [],
  }
}
