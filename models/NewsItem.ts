import mongoose, { Schema, Model } from 'mongoose'

export interface INewsItem {
  _id: string
  title: string
  content: string
  date: Date
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

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
