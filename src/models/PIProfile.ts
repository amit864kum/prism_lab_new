import mongoose, { Schema, Model } from 'mongoose'
import type { IPIProfile, IPIPublication, IProfilePoint } from '@/types/pi-profile'

export type { IPIProfile, IPIPublication, IProfilePoint } from '@/types/pi-profile'

const profilePointSchema = new Schema<IProfilePoint>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
)

const piPublicationSchema = new Schema<IPIPublication>(
  {
    authors: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    doiLink: {
      type: String,
      trim: true,
    },
    journalName: {
      type: String,
      trim: true,
    },
    conferenceName: {
      type: String,
      trim: true,
    },
    bookTitle: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    patentNumber: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100,
    },
    displayOrder: {
      type: Number,
      min: 1,
    },
  },
  { _id: false }
)

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
    emails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
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
    phoneNumbers: [
      {
        type: String,
        trim: true,
      },
    ],
    researchInterests: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [
      {
        _id: false,
        degree: {
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
        thesis_title: {
          type: String,
          trim: true,
        },
        specialization: {
          type: String,
          trim: true,
        },
        supervisor: {
          type: String,
          trim: true,
        },
        department: {
          type: String,
          trim: true,
        },
        institute: {
          type: String,
          required: true,
          trim: true,
        },
        university: {
          type: String,
          trim: true,
        },
        grade: {
          type: String,
          trim: true,
        },
      },
    ],
    teaching: [
      {
        _id: false,
        title: {
          type: String,
          required: true,
          trim: true,
        },
        points: {
          type: [profilePointSchema],
          default: [],
        },
        duration: {
          type: String,
          trim: true,
        },
      },
    ],
    activities: [
      {
        _id: false,
        title: {
          type: String,
          required: true,
          trim: true,
        },
        points: {
          type: [profilePointSchema],
          default: [],
        },
        year: {
          type: Number,
          min: 1900,
          max: 2100,
        },
      },
    ],
    achievements: [
      {
        _id: false,
        title: {
          type: String,
          required: true,
          trim: true,
        },
        points: {
          type: [profilePointSchema],
          default: [],
        },
        date: {
          type: String,
          trim: true,
        },
      },
    ],
    miscellaneous: [
      {
        _id: false,
        title: {
          type: String,
          required: true,
          trim: true,
        },
        points: {
          type: [profilePointSchema],
          default: [],
        },
      },
    ],
    journalPublications: {
      type: [piPublicationSchema],
      default: [],
    },
    conferencePublications: {
      type: [piPublicationSchema],
      default: [],
    },
    bookChapters: {
      type: [piPublicationSchema],
      default: [],
    },
    patents: {
      type: [piPublicationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const PIProfile: Model<IPIProfile> =
  mongoose.models.PIProfile || mongoose.model<IPIProfile>('PIProfile', piProfileSchema)

export default PIProfile
