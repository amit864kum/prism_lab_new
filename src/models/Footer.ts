import mongoose, { Schema, Model } from 'mongoose'
import type { IFooter } from '@/types/content'

export type { IFooter } from '@/types/content'

const footerSchema = new Schema<IFooter>(
  {
    copyrightText: {
      type: String,
      required: true,
      default: '© 2026 Prism Lab, IIT Patna. All rights reserved.',
    },
    developerName: {
      type: String,
      required: true,
      default: 'Designed & Developed by Amit Kumar',
    },
    developerLink: {
      type: String,
      required: true,
      default: 'https://amit-three.vercel.app/',
    },
    prismLogoUrl: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    googleMapsEmbedUrl: {
      type: String,
      trim: true,
    },
    heroPublicationsCount: {
      type: Number,
      min: 0,
      default: null,
    },
    heroResearchAreasCount: {
      type: Number,
      min: 0,
      default: null,
    },
    heroScholarsCount: {
      type: Number,
      min: 0,
      default: null,
    },
    heroProjectsCount: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Footer: Model<IFooter> =
  mongoose.models.Footer || mongoose.model<IFooter>('Footer', footerSchema)

export default Footer
