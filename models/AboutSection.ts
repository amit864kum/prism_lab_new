import mongoose, { Schema, Model } from 'mongoose'

export interface IAboutSection {
  _id: string
  content: string
  updatedAt: Date
  createdAt: Date
}

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
