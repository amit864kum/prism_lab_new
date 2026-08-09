import type { Document } from 'mongoose'

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'

export interface IActivityLog extends Document {
  action: ActivityAction
  entityType: string
  entityName: string
  timestamp: Date
}
