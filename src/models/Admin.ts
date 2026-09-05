import mongoose, { Schema, Model } from 'mongoose'
import type { IAdmin } from '@/types/auth'

export type { IAdmin } from '@/types/auth'

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sessionVersion: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const existingAdmin = mongoose.models.Admin as Model<IAdmin> | undefined
if (existingAdmin && !existingAdmin.schema.path('sessionVersion')) {
  existingAdmin.schema.add({
    sessionVersion: { type: Number, required: true, min: 0, default: 0 },
  })
}

const Admin: Model<IAdmin> = existingAdmin || mongoose.model<IAdmin>('Admin', adminSchema)

export default Admin
