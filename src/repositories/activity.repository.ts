import ActivityLog from '@/models/ActivityLog'
import { connectDB } from '@/lib/mongodb'
import type { ActivityAction } from '@/types/activity'

export async function createActivityLog(input: {
  action: ActivityAction
  entityType: string
  entityName: string
}) {
  await connectDB()
  const created = await ActivityLog.create({ ...input, timestamp: new Date() })
  return created.toObject()
}
