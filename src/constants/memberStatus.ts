export const MEMBER_STATUSES = ['current', 'alumni', 'completed'] as const

export type MemberStatus = (typeof MEMBER_STATUSES)[number]

export function normalizeMemberStatus(status: unknown): MemberStatus {
  if (status === 'completed') return 'completed'
  if (status === 'alumni') return 'alumni'
  return 'current'
}
