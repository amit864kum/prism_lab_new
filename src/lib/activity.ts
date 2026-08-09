import { recordActivity } from '@/services/activity.service'

/**
 * Logs an administrative action to the ActivityLog collection.
 * 
 * @param action The type of action performed ('CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT')
 * @param entityType The collection or entity type modified (e.g. 'Member', 'Publication', 'Project')
 * @param entityName The human-readable name identifying the target entity (e.g. member's name, paper title)
 */
export async function logActivity(
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
  entityType: string,
  entityName: string
) {
  await recordActivity(action, entityType, entityName)
}
