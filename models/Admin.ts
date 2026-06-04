import mongoose, { Schema, Model } from 'mongoose'

export interface IAdmin {
  _id: string
  email: string
  passwordHash: string
  name: string
  createdAt: Date
  updatedAt: Date
}

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
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation in development
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema)

export default Admin
