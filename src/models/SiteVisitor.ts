import mongoose, { Model, Schema } from 'mongoose'

export interface ISiteVisitor {
  _id: string
  firstSeenAt: Date
}

const siteVisitorSchema = new Schema<ISiteVisitor>(
  {
    _id: {
      type: String,
      required: true,
    },
    firstSeenAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
)

const SiteVisitor: Model<ISiteVisitor> =
  mongoose.models.SiteVisitor ||
  mongoose.model<ISiteVisitor>('SiteVisitor', siteVisitorSchema)

export default SiteVisitor
