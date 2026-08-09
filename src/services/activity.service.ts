import type { ActivityAction } from '@/types/activity'
import { createActivityLog } from '@/repositories/activity.repository'
import { appLogger } from '@/lib/logger'

export async function recordActivity(
  action: ActivityAction,
  entityType: string,
  entityName: string
) {
  try {
    await createActivityLog({ action, entityType, entityName })
  } catch (error) {
    appLogger.error('Activity log write failed', { action, entityType, error })
  }
}
