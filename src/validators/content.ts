import { z } from 'zod'

export const researchAreaSchema = z
  .object({
    title: z.string().min(1, 'Title is required').trim(),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
      .trim(),
    description: z.string().trim().optional().or(z.literal('')),
    overview: z.string().trim().optional().or(z.literal('')),
    imageUrl: z.string().optional().or(z.literal('')),
    order: z.number().int().min(0).default(0),
    displayOrder: z.number().int().min(0).optional(),
    publications: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (!data.description?.trim() && !data.overview?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Description or overview is required',
        path: ['description'],
      })
    }
  })
  .transform((data) => {
    // `overview` is retained for compatibility with older records, but the
    // admin-facing description is the canonical public copy. Keeping both
    // fields synchronized prevents a stale legacy overview from masking an
    // updated description on the research-area detail page.
    const description = data.description?.trim() || data.overview?.trim() || ''

    return {
      ...data,
      description,
      overview: description,
      order: data.order ?? data.displayOrder ?? 0,
      displayOrder: data.displayOrder ?? data.order ?? 0,
    }
  })

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  description: z.string().min(1, 'Description is required').trim(),
  objective: z.string().trim().optional().or(z.literal('')),
  objectivePoints: z
    .array(z.string().trim())
    .default([])
    .transform((points) => points.filter((point) => point.length > 0)),
  projectAmount: z.string().trim().optional().or(z.literal('')),
  sponsoredAgency: z.string().trim().optional().or(z.literal('')),
  detailedSummary: z.string().trim().optional().or(z.literal('')),
  links: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Link title is required'),
        url: z.string().trim().url('Invalid project link URL'),
      })
    )
    .default([]),
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
  externalLink: z.string().url('Invalid external link URL').optional().or(z.literal('')),
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

const optionalTrimmedString = z.string().trim().optional().or(z.literal(''))
const optionalUrl = z.string().trim().url('Invalid point link URL').optional().or(z.literal(''))

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required').trim(),
  year: z.number().int().min(1900).max(2100),
  thesis_title: optionalTrimmedString,
  specialization: optionalTrimmedString,
  supervisor: optionalTrimmedString,
  department: optionalTrimmedString,
  institute: z.string().min(1, 'Institute is required').trim(),
  university: optionalTrimmedString,
  grade: optionalTrimmedString,
})

const profilePointSchema = z.object({
  text: z.string().min(1, 'Point text is required').trim(),
  link: optionalUrl,
})

const teachingSchema = z.object({
  title: z.string().min(1, 'Teaching title is required').trim(),
  points: z.array(profilePointSchema).min(1, 'At least one teaching point is required'),
  duration: optionalTrimmedString,
})

const activitySchema = z.object({
  title: z.string().min(1, 'Activity title is required').trim(),
  points: z.array(profilePointSchema).min(1, 'At least one activity point is required'),
  year: z.number().int().min(1900).max(2100).optional(),
})

const achievementSchema = z.object({
  title: z.string().min(1, 'Achievement title is required').trim(),
  points: z.array(profilePointSchema).min(1, 'At least one achievement point is required'),
  date: optionalTrimmedString,
})

const miscellaneousSchema = z.object({
  title: z.string().min(1, 'Miscellaneous title is required').trim(),
  points: z.array(profilePointSchema).min(1, 'At least one miscellaneous point is required'),
})

const piPublicationSchema = z.object({
  authors: z.string().min(1, 'Authors are required').trim(),
  title: z.string().min(1, 'Publication title is required').trim(),
  doiLink: z.string().url('Invalid DOI link URL').optional().or(z.literal('')),
  journalName: optionalTrimmedString,
  conferenceName: optionalTrimmedString,
  bookTitle: optionalTrimmedString,
  publisher: optionalTrimmedString,
  patentNumber: optionalTrimmedString,
  year: z.number().int().min(1900).max(2100),
  displayOrder: z.number().int().min(1).optional(),
})

export const aboutSectionSchema = z.object({
  content: z.string().min(1, 'Content is required').trim(),
})

export const piProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  title: z.string().min(1, 'Title is required').trim(),
  bio: z.string().min(1, 'Bio is required').trim(),
  imageUrl: z.string().optional().or(z.literal('')),
  emails: z.array(z.string().email('Invalid email')).default([]),
  officeLocation: z.string().optional(),
  phoneNumbers: z.array(z.string()).default([]),
  researchInterests: z.array(z.string()).default([]),
  education: z.array(educationSchema).default([]),
  teaching: z.array(teachingSchema).default([]),
  activities: z.array(activitySchema).default([]),
  achievements: z.array(achievementSchema).default([]),
  miscellaneous: z.array(miscellaneousSchema).default([]),
  journalPublications: z.array(piPublicationSchema).default([]),
  conferencePublications: z.array(piPublicationSchema).default([]),
  bookChapters: z.array(piPublicationSchema).default([]),
  patents: z.array(piPublicationSchema).default([]),
})

export type ResearchAreaInput = z.infer<typeof researchAreaSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type SponsorInput = z.infer<typeof sponsorSchema>
export type NewsItemInput = z.infer<typeof newsItemSchema>
export type GalleryImageInput = z.infer<typeof galleryImageSchema>
export type HeroSlideInput = z.infer<typeof heroSlideSchema>
export type AboutSectionInput = z.infer<typeof aboutSectionSchema>
export type PIProfileInput = z.infer<typeof piProfileSchema>
