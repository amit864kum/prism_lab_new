import mongoose, { Schema, Model } from 'mongoose'

export interface IHeroSlide {
  _id: string
  imageUrl: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const heroSlideSchema = new Schema<IHeroSlide>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    ctaText: {
      type: String,
      trim: true,
    },
    ctaUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for ordering active slides
heroSlideSchema.index({ isActive: 1, order: 1 })

const HeroSlide: Model<IHeroSlide> =
  mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', heroSlideSchema)

export default HeroSlide
