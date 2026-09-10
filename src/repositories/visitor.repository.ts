import { connectDB } from '@/lib/mongodb'
import SiteVisitor from '@/models/SiteVisitor'
import {
  getTotalVisitorCount,
  incrementTotalVisitorCount,
} from '@/repositories/site-metric.repository'

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  )
}

export async function registerUniqueVisitor(visitorHash: string) {
  await connectDB()

  try {
    const result = await SiteVisitor.updateOne(
      { _id: visitorHash },
      { $setOnInsert: { firstSeenAt: new Date() } },
      { upsert: true },
    )

    if (result.upsertedCount === 1) {
      return incrementTotalVisitorCount()
    }
  } catch (error) {
    // Concurrent first requests for the same browser can race on the unique _id.
    // The winning request increments the aggregate; the loser only reads it.
    if (!isDuplicateKeyError(error)) throw error
  }

  return getTotalVisitorCount()
}

export async function rememberExistingVisitor(visitorHash: string) {
  await connectDB()
  await SiteVisitor.updateOne(
    { _id: visitorHash },
    { $setOnInsert: { firstSeenAt: new Date() } },
    { upsert: true },
  )

  return getTotalVisitorCount()
}
