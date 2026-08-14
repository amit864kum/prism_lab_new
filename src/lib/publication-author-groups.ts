import type { MemberRole } from '@/constants/roles'
import type { MemberStatus } from '@/constants/memberStatus'

export interface PublicationAuthorGroupSource {
  name: string
  role: MemberRole
  status: MemberStatus
  displayOrder?: number
}

export const PUBLICATION_AUTHOR_GROUPS = [
  { key: 'ongoing-phd', label: 'Ongoing PhD' },
  { key: 'ongoing-mtech', label: 'Ongoing M.Tech' },
  { key: 'alumni', label: 'Alumni Students' },
  { key: 'other', label: 'Other Members' },
] as const

export type PublicationAuthorGroupKey =
  (typeof PUBLICATION_AUTHOR_GROUPS)[number]['key']

export function getPublicationAuthorGroupKey(
  member: PublicationAuthorGroupSource,
): PublicationAuthorGroupKey {
  if (member.role === 'PhD Scholar' && member.status === 'current') {
    return 'ongoing-phd'
  }

  if (member.role === 'Masters Student' && member.status === 'current') {
    return 'ongoing-mtech'
  }

  if (
    member.status !== 'current' &&
    (member.role === 'PhD Scholar' || member.role === 'Masters Student')
  ) {
    return 'alumni'
  }

  return 'other'
}

export function groupPublicationAuthors<T extends PublicationAuthorGroupSource>(
  members: T[],
) {
  return PUBLICATION_AUTHOR_GROUPS.map((group) => ({
    ...group,
    members: members
      .filter((member) => getPublicationAuthorGroupKey(member) === group.key)
      .sort(
        (a, b) =>
          (a.displayOrder || Number.MAX_SAFE_INTEGER) -
            (b.displayOrder || Number.MAX_SAFE_INTEGER) ||
          a.name.localeCompare(b.name),
      ),
  })).filter((group) => group.members.length > 0)
}
