import mongoose, { Schema, Model } from 'mongoose'

export interface IResearchArea {
  _id: string
  title: string
  slug: string
  description: string
  imageUrl?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

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
    imageUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index for ordering
researchAreaSchema.index({ order: 1 })
// Note: slug index is auto-created by unique:true in field definition

const ResearchArea: Model<IResearchArea> =
  mongoose.models.ResearchArea ||
  mongoose.model<IResearchArea>('ResearchArea', researchAreaSchema)

export default ResearchArea
