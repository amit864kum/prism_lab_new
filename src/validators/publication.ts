import { z } from 'zod'
import { PUBLICATION_TYPES } from '@/constants/publicationTypes'

export const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  type: z.enum(PUBLICATION_TYPES),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  externalAuthors:
  z.array(z.string())
   .optional()
   .default([]),
  researchAreas: z.array(z.string()).default([]),
  year: z.number().int().min(2000).max(2100),
  venue: z.string().optional(),
  journalName: z.string().optional().or(z.literal('')),
  doiLink: z.string().url('Invalid DOI link').optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  datasetLink: z.string().url('Invalid dataset link').optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  talkType: z.string().optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
  displayOrder: z.number().int().min(1).optional(),
  abstract: z.string().optional(),
  pdfUrl: z.string().optional().or(z.literal('')),
  externalUrl: z.string().url('Invalid external link').optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  profileOnly: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  if (data.type === 'journal' && !data.journalName?.trim() && !data.venue?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Journal name is required',
      path: ['journalName'],
    })
  }

  if (data.type === 'conference' && !data.venue?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Conference name is required',
      path: ['venue'],
    })
  }
})

export type PublicationInput = z.infer<typeof publicationSchema>
