import { z } from 'zod'
import { PUBLICATION_TYPES } from '@/constants/publicationTypes'
import { optionalAssetUrl, optionalHttpsUrl } from './url'

export const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  type: z.enum(PUBLICATION_TYPES),
  authors: z.array(z.string().max(128)).min(1, 'At least one author is required').max(100),
  externalAuthors:
  z.array(z.string().max(500))
   .max(100)
   .optional()
   .default([]),
  researchAreas: z.array(z.string().max(128)).max(100).default([]),
  year: z.number().int().min(2000).max(2100),
  venue: z.string().optional(),
  journalName: z.string().optional().or(z.literal('')),
  doiLink: optionalHttpsUrl('Invalid DOI link'),
  description: z.string().optional().or(z.literal('')),
  datasetLink: optionalHttpsUrl('Invalid dataset link'),
  location: z.string().optional().or(z.literal('')),
  talkType: z.string().optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
  displayOrder: z.number().int().min(1).optional(),
  abstract: z.string().optional(),
  pdfUrl: optionalAssetUrl('Invalid publication PDF URL'),
  externalUrl: optionalHttpsUrl('Invalid external link'),
  tags: z.array(z.string().trim().max(100)).max(50).default([]),
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
