import mongoose, { Schema, Model } from 'mongoose'
import type { IActivityLog } from '@/types/activity'

export type { IActivityLog } from '@/types/activity'

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
    },
    entityType: {
      type: String,
      required: true,
    },
    entityName: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

// Index on timestamp for quick lookup of recent activity
activityLogSchema.index({ timestamp: -1 })

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema)

export default ActivityLog
