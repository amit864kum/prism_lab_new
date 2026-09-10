import { createHash } from 'node:crypto'
import {
  registerUniqueVisitor,
  rememberExistingVisitor,
} from '@/repositories/visitor.repository'

function hashVisitorId(visitorId: string) {
  return createHash('sha256').update(visitorId).digest('hex')
}

export function registerVisitor(visitorId: string) {
  return registerUniqueVisitor(hashVisitorId(visitorId))
}

export function migrateLegacyVisitor(visitorId: string) {
  return rememberExistingVisitor(hashVisitorId(visitorId))
}
