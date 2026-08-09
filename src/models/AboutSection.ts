import mongoose, { Schema, Model } from 'mongoose'
import type { IAboutSection } from '@/types/content'

export type { IAboutSection } from '@/types/content'

const aboutSectionSchema = new Schema<IAboutSection>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const AboutSection: Model<IAboutSection> =
  mongoose.models.AboutSection ||
  mongoose.model<IAboutSection>('AboutSection', aboutSectionSchema)

export default AboutSection
