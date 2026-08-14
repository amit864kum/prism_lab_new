import { z } from 'zod'
import { MEMBER_ROLES } from '@/constants/roles'
import { MEMBER_STATUSES } from '@/constants/memberStatus'

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  role: z.enum(MEMBER_ROLES),
  status: z.enum(MEMBER_STATUSES).default('current'),
  yearJoined: z.number().int().min(2000).max(2100).optional(),
  yearLeft: z.number().int().min(2000).max(2100).optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  bio: z.string().optional(),
  thesisTitle: z.string().max(500, 'Thesis title is too long').optional(),
  currentPosition: z.string().max(300, 'Current position is too long').optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  googleScholarUrl: z.string().url('Invalid Google Scholar URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  personalPortfolioWebsite: z.string().url('Invalid portfolio website URL').optional().or(z.literal('')),
  resumePdf: z.string().optional().or(z.literal('')),
  displayOrder: z.number().int().min(1).optional(),
  publications: z.array(z.string()).default([]),
})

export type MemberInput = z.infer<typeof memberSchema>
