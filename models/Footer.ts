import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IFooter extends Document {
  copyrightText: string
  developerName: string
  developerLink: string
  createdAt: Date
  updatedAt: Date
}

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
  },
  {
    timestamps: true,
  }
)

const Footer: Model<IFooter> =
  mongoose.models.Footer || mongoose.model<IFooter>('Footer', footerSchema)

export default Footer
