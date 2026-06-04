import { z } from 'zod'

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  role: z.enum(['PhD Scholar', 'Masters Student', 'Undergraduate', 'Research Assistant']),
  status: z.enum(['current', 'alumni']).default('current'),
  yearJoined: z.number().int().min(2000).max(2100).optional(),
  yearLeft: z.number().int().min(2000).max(2100).optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  bio: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  googleScholarUrl: z.string().url('Invalid Google Scholar URL').optional().or(z.literal('')),
  publications: z.array(z.string()).default([]),
})

export type MemberInput = z.infer<typeof memberSchema>
