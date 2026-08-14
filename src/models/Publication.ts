import mongoose, { Schema, Model, Types } from 'mongoose'
import { PUBLICATION_TYPES } from '@/constants/publicationTypes'
import type { IPublication } from '@/types/publication'

export type { IPublication } from '@/types/publication'

const publicationSchema = new Schema<IPublication>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: PUBLICATION_TYPES,
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
      },
    ],
    externalAuthors: [
      {
        type: String,
        trim: true,
      },
    ],
    researchAreas: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ResearchArea',
      },
    ],
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    venue: {
      type: String,
      trim: true,
    },
    journalName: {
      type: String,
      trim: true,
    },
    doiLink: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    datasetLink: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    talkType: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      min: 1,
    },
    abstract: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
    externalUrl: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    profileOnly: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
publicationSchema.index({ year: -1, createdAt: -1 })
publicationSchema.index({ type: 1, displayOrder: 1, year: -1 })
publicationSchema.index({ researchAreas: 1 })
publicationSchema.index({ profileOnly: 1, type: 1, displayOrder: 1 })
// Note: slug index is auto-created by unique:true in field definition

// Validation: authors array must not be empty
publicationSchema.path('authors').validate(function (authors: Types.ObjectId[]) {
  return authors && authors.length > 0
}, 'At least one author is required')

const existingPublicationModel = mongoose.models.Publication as Model<IPublication> | undefined

// Next.js development reloads can retain a previously compiled Mongoose model.
// Add the scope field to that retained schema so profile-only records are not
// silently saved as global publications until the dev server is restarted.
if (existingPublicationModel && !existingPublicationModel.schema.path('profileOnly')) {
  existingPublicationModel.schema.add({
    profileOnly: {
      type: Boolean,
      default: false,
      index: true,
    },
  })
}

const Publication: Model<IPublication> =
  existingPublicationModel || mongoose.model<IPublication>('Publication', publicationSchema)

export default Publication
