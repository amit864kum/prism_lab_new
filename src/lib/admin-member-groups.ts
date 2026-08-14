import type { MemberRole } from '@/constants/roles'
import type { MemberStatus } from '@/constants/memberStatus'

export interface AdminMemberGroupSource {
  role: MemberRole
  status: MemberStatus
}

export const ADMIN_MEMBER_GROUPS = [
  { key: 'ongoing-phd', label: 'Ongoing PhD' },
  { key: 'completed-phd', label: 'Completed PhD' },
  { key: 'ongoing-mtech', label: 'Ongoing M.Tech' },
  { key: 'alumni-mtech', label: 'Alumni M.Tech' },
  { key: 'undergraduate', label: 'B.Tech Students' },
  { key: 'research-assistant', label: 'Research Assistants' },
] as const

export type AdminMemberGroupKey = (typeof ADMIN_MEMBER_GROUPS)[number]['key']

export function getAdminMemberGroupKey(
  member: AdminMemberGroupSource,
): AdminMemberGroupKey {
  if (member.role === 'PhD Scholar') {
    return member.status === 'current' ? 'ongoing-phd' : 'completed-phd'
  }

  if (member.role === 'Masters Student') {
    return member.status === 'current' ? 'ongoing-mtech' : 'alumni-mtech'
  }

  if (member.role === 'Undergraduate') return 'undergraduate'
  return 'research-assistant'
}

export function getAdminMemberStatusLabel(member: AdminMemberGroupSource) {
  const group = ADMIN_MEMBER_GROUPS.find(
    (item) => item.key === getAdminMemberGroupKey(member),
  )
  return group?.label || member.status
}

export function getAdminMemberStatusOptions(role: MemberRole) {
  if (role === 'PhD Scholar') {
    return [
      { value: 'current' as const, label: 'Ongoing PhD' },
      { value: 'completed' as const, label: 'Completed PhD' },
    ]
  }

  if (role === 'Masters Student') {
    return [
      { value: 'current' as const, label: 'Ongoing M.Tech' },
      { value: 'alumni' as const, label: 'Alumni M.Tech' },
    ]
  }

  return [
    { value: 'current' as const, label: 'Current Member' },
    { value: 'alumni' as const, label: 'Alumni' },
    { value: 'completed' as const, label: 'Completed' },
  ]
}

export function normalizeStatusForRole(
  role: MemberRole,
  status: MemberStatus,
): MemberStatus {
  if (status === 'current') return status
  if (role === 'PhD Scholar') return 'completed'
  if (role === 'Masters Student') return 'alumni'
  return status
}
