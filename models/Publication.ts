import mongoose, { Schema, Model, Types } from 'mongoose'

export type PublicationType =
  | 'Journal Article'
  | 'Conference Paper'
  | 'Workshop Paper'
  | 'Technical Report'
  | 'Book Chapter'
  | 'Thesis'

export interface IPublication {
  _id: string
  title: string
  slug: string
  type: PublicationType
  authors: Types.ObjectId[]
  year: number
  venue?: string
  abstract?: string
  pdfUrl?: string
  externalUrl?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

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
      enum: [
        'Journal Article',
        'Conference Paper',
        'Workshop Paper',
        'Technical Report',
        'Book Chapter',
        'Thesis',
      ],
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
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
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
publicationSchema.index({ year: -1, createdAt: -1 })
publicationSchema.index({ type: 1, year: -1 })
// Note: slug index is auto-created by unique:true in field definition

// Validation: authors array must not be empty
publicationSchema.path('authors').validate(function (authors: Types.ObjectId[]) {
  return authors && authors.length > 0
}, 'At least one author is required')

const Publication: Model<IPublication> =
  mongoose.models.Publication ||
  mongoose.model<IPublication>('Publication', publicationSchema)

export default Publication
