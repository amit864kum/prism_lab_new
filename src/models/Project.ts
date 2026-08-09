import mongoose, { Schema, Model } from 'mongoose'
import type { IProject } from '@/types/project'

export type { IProject, ProjectStatus } from '@/types/project'

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
    objective: {
      type: String,
      trim: true,
    },
    objectivePoints: [
      {
        type: String,
        trim: true,
      },
    ],
    projectAmount: {
      type: String,
      trim: true,
    },
    sponsoredAgency: {
      type: String,
      trim: true,
    },
    detailedSummary: {
      type: String,
      trim: true,
    },
    links: [
      {
        _id: false,
        title: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
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

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema)

export default Project
