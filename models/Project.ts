import mongoose, { Schema, Model } from 'mongoose'

export type ProjectStatus = 'ongoing' | 'completed'

export interface IProject {
  _id: string
  title: string
  slug: string
  description: string
  status: ProjectStatus
  startDate?: Date
  endDate?: Date
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
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
    status: {
      type: String,
      required: true,
      enum: ['ongoing', 'completed'],
      default: 'ongoing',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
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

// Indexes for efficient queries
projectSchema.index({ status: 1, createdAt: -1 })
projectSchema.index({ slug: 1 })

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema)

export default Project
