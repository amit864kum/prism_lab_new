import { z } from 'zod'

export const researchAreaSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  description: z.string().min(1, 'Description is required').trim(),
  imageUrl: z.string().optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
})

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  description: z.string().min(1, 'Description is required').trim(),
  status: z.enum(['ongoing', 'completed']).default('ongoing'),
  startDate: z.string().datetime().optional().or(z.literal('')),
  endDate: z.string().datetime().optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
})

export const sponsorSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  logoUrl: z.string().min(1, 'Logo URL is required'),
  websiteUrl: z.string().url('Invalid website URL').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
})

export const newsItemSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  date: z.string().datetime(),
  imageUrl: z.string().optional().or(z.literal('')),
})

export const galleryImageSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
  caption: z.string().optional(),
  category: z.string().default('All'),
  uploadDate: z.string().datetime(),
})

export const heroSlideSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
  title: z.string().min(1, 'Title is required').trim(),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().url('Invalid CTA URL').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const aboutSectionSchema = z.object({
  content: z.string().min(1, 'Content is required').trim(),
})

export const piProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  title: z.string().min(1, 'Title is required').trim(),
  bio: z.string().min(1, 'Bio is required').trim(),
  imageUrl: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  officeLocation: z.string().optional(),
  phoneNumber: z.string().optional(),
  researchInterests: z.array(z.string()).default([]),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, 'Degree is required'),
        institution: z.string().min(1, 'Institution is required'),
        year: z.number().int().min(1900).max(2100),
      })
    )
    .default([]),
})

export type ResearchAreaInput = z.infer<typeof researchAreaSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type SponsorInput = z.infer<typeof sponsorSchema>
export type NewsItemInput = z.infer<typeof newsItemSchema>
export type GalleryImageInput = z.infer<typeof galleryImageSchema>
export type HeroSlideInput = z.infer<typeof heroSlideSchema>
export type AboutSectionInput = z.infer<typeof aboutSectionSchema>
export type PIProfileInput = z.infer<typeof piProfileSchema>
