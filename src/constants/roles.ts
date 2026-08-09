export const MEMBER_ROLES = [
  'PhD Scholar',
  'Masters Student',
  'Undergraduate',
  'Research Assistant',
  'Intern',
] as const

export type MemberRole = (typeof MEMBER_ROLES)[number]

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  'PhD Scholar': 'PhD Scholar',
  'Masters Student': 'M.Tech',
  Undergraduate: 'B.Tech',
  'Research Assistant': 'Research Assistant',
  Intern: 'Intern',
}
