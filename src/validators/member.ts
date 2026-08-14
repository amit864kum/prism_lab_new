import { z } from 'zod'
import { MEMBER_ROLES } from '@/constants/roles'
import { MEMBER_STATUSES } from '@/constants/memberStatus'

function normalizeOptionalWebUrl(value: unknown) {
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  return `https://${trimmed.replace(/^\/\//, '')}`
}

const optionalWebUrl = (message: string) =>
  z.preprocess(
    normalizeOptionalWebUrl,
    z.string().url(message).optional().or(z.literal('')),
  )

export const memberSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  role: z.enum(MEMBER_ROLES),
  status: z.enum(MEMBER_STATUSES).default('current'),
  yearJoined: z.number().int().min(2000).max(2100).optional(),
  yearLeft: z.number().int().min(2000).max(2100).optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  bio: z.string().optional(),
  thesisTitle: z.string().trim().max(500, 'Thesis title is too long').optional(),
  currentPosition: z.string().trim().max(300, 'Current position is too long').optional(),
  email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  linkedinUrl: optionalWebUrl('Invalid LinkedIn URL'),
  googleScholarUrl: optionalWebUrl('Invalid Google Scholar URL'),
  githubUrl: optionalWebUrl('Invalid GitHub URL'),
  personalPortfolioWebsite: optionalWebUrl('Invalid portfolio website URL'),
  resumePdf: z.string().optional().or(z.literal('')),
  displayOrder: z.number().int().min(1).optional(),
  publications: z.array(z.string()).default([]),
})

export type MemberInput = z.infer<typeof memberSchema>
