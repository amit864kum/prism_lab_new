import mongoose, { Schema, Model } from 'mongoose'
import type { ISponsor } from '@/types/content'

export type { ISponsor } from '@/types/content'

const sponsorSchema = new Schema<ISponsor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
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
sponsorSchema.index({ order: 1 })

const Sponsor: Model<ISponsor> =
  mongoose.models.Sponsor || mongoose.model<ISponsor>('Sponsor', sponsorSchema)

export default Sponsor
