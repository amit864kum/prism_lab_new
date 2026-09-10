import { connectDB } from '@/lib/mongodb'
import SiteMetric from '@/models/SiteMetric'

const VISITOR_METRIC_ID = 'total-visitors'

export async function getTotalVisitorCount() {
  await connectDB()
  const metric = await SiteMetric.findById(VISITOR_METRIC_ID)
    .select('value')
    .lean()

  return metric?.value ?? 0
}

export async function incrementTotalVisitorCount() {
  await connectDB()
  const metric = await SiteMetric.findOneAndUpdate(
    { _id: VISITOR_METRIC_ID },
    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  )
    .select('value')
    .lean()

  return metric?.value ?? 0
}
