import mongoose, { Model, Schema } from 'mongoose'

export interface ISiteMetric {
  _id: string
  value: number
  createdAt: Date
  updatedAt: Date
}

const siteMetricSchema = new Schema<ISiteMetric>(
  {
    _id: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const SiteMetric: Model<ISiteMetric> =
  mongoose.models.SiteMetric ||
  mongoose.model<ISiteMetric>('SiteMetric', siteMetricSchema)

export default SiteMetric
