interface AdminMemberOption {
  name: string
  role: string
}

const EXCLUDED_PUBLICATION_MEMBER_NAMES = new Set(['amit kumar', 'yuvraj singh'])

const normalizeMemberName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase()

export function isVisibleAdminMember(member: Pick<AdminMemberOption, 'role'>) {
  return member.role.trim().toLowerCase() !== 'intern'
}

export function isSelectableAdminPublicationMember(member: AdminMemberOption) {
  return (
    isVisibleAdminMember(member) &&
    !EXCLUDED_PUBLICATION_MEMBER_NAMES.has(normalizeMemberName(member.name))
  )
}
