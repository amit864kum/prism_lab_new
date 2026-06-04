import mongoose, { Schema, Model } from 'mongoose'

export interface IPIProfile {
  _id: string
  name: string
  title: string
  bio: string
  imageUrl?: string
  email?: string
  officeLocation?: string
  phoneNumber?: string
  researchInterests: string[]
  education: Array<{
    degree: string
    institution: string
    year: number
  }>
  createdAt: Date
  updatedAt: Date
}

const piProfileSchema = new Schema<IPIProfile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    officeLocation: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    researchInterests: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [
      {
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: Number,
          required: true,
          min: 1900,
          max: 2100,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const PIProfile: Model<IPIProfile> =
  mongoose.models.PIProfile || mongoose.model<IPIProfile>('PIProfile', piProfileSchema)

export default PIProfile
