import mongoose, { Schema, Model, Types } from 'mongoose'
import { MEMBER_ROLES } from '@/constants/roles'
import { MEMBER_STATUSES } from '@/constants/memberStatus'
import type { IMember } from '@/types/member'

export type { IMember } from '@/types/member'

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
      enum: MEMBER_ROLES,
    },
    status: {
      type: String,
      required: true,
      enum: MEMBER_STATUSES,
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
    githubUrl: {
      type: String,
      trim: true,
    },
    personalPortfolioWebsite: {
      type: String,
      trim: true,
    },
    resumePdf: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      min: 1,
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
memberSchema.index({ status: 1, role: 1, displayOrder: 1, yearJoined: -1 })
// Note: slug index is auto-created by unique:true in field definition

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', memberSchema)

export default Member
