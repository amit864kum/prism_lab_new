import mongoose, { Schema, Model } from 'mongoose'
import type { IResearchArea } from '@/types/research'

export type { IResearchArea } from '@/types/research'

const researchAreaSchema = new Schema<IResearchArea>(
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    displayOrder: {
      type: Number,
    },
    publications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Index for ordering
researchAreaSchema.index({ order: 1 })
researchAreaSchema.index({ displayOrder: 1 })
// Note: slug index is auto-created by unique:true in field definition

const ResearchArea: Model<IResearchArea> =
  mongoose.models.ResearchArea ||
  mongoose.model<IResearchArea>('ResearchArea', researchAreaSchema)

export default ResearchArea
