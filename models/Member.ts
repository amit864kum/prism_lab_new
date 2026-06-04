import mongoose, { Schema, Model, Types } from 'mongoose'

export type MemberRole = 'PhD Scholar' | 'Masters Student' | 'Undergraduate' | 'Research Assistant'
export type MemberStatus = 'current' | 'alumni'

export interface IMember {
  _id: string
  name: string
  slug: string
  role: MemberRole
  status: MemberStatus
  yearJoined?: number
  yearLeft?: number
  imageUrl?: string
  bio?: string
  email?: string
  linkedinUrl?: string
  googleScholarUrl?: string
  publications: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const memberSchema = new Schema<IMember>(
  {
    name: {
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
    role: {
      type: String,
      required: true,
      enum: ['PhD Scholar', 'Masters Student', 'Undergraduate', 'Research Assistant'],
    },
    status: {
      type: String,
      required: true,
      enum: ['current', 'alumni'],
      default: 'current',
    },
    yearJoined: {
      type: Number,
      min: 2000,
      max: 2100,
    },
    yearLeft: {
      type: Number,
      min: 2000,
      max: 2100,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    googleScholarUrl: {
      type: String,
      trim: true,
    },
    publications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
memberSchema.index({ status: 1, role: 1, yearJoined: -1 })
// Note: slug index is auto-created by unique:true in field definition

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', memberSchema)

export default Member
