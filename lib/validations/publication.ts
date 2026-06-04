import { z } from 'zod'

export const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  type: z.enum([
    'Journal Article',
    'Conference Paper',
    'Workshop Paper',
    'Technical Report',
    'Book Chapter',
    'Thesis',
  ]),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  year: z.number().int().min(2000).max(2100),
  venue: z.string().optional(),
  abstract: z.string().optional(),
  pdfUrl: z.string().optional().or(z.literal('')),
  externalUrl: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
})

export type PublicationInput = z.infer<typeof publicationSchema>
