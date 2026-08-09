import mongoose, { Schema, Model } from 'mongoose'
import type { IGalleryImage } from '@/types/gallery'

export type { IGalleryImage } from '@/types/gallery'

const galleryImageSchema = new Schema<IGalleryImage>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'All',
    },
    uploadDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Index for category filtering and date sorting
galleryImageSchema.index({ category: 1, uploadDate: -1 })

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>('GalleryImage', galleryImageSchema)

export default GalleryImage
