import mongoose, { Schema, Model } from 'mongoose'
import type { INewsItem } from '@/types/news'

export type { INewsItem } from '@/types/news'

const newsItemSchema = new Schema<INewsItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    externalLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for date-based queries
newsItemSchema.index({ date: -1 })

const NewsItem: Model<INewsItem> =
  mongoose.models.NewsItem || mongoose.model<INewsItem>('NewsItem', newsItemSchema)

export default NewsItem
