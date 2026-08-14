import { describe, expect, it } from 'vitest'
import {
  getAdminMemberGroupKey,
  getAdminMemberStatusOptions,
  normalizeStatusForRole,
} from '../../src/lib/admin-member-groups'

describe('admin member groups', () => {
  it.each([
    ['PhD Scholar', 'current', 'ongoing-phd'],
    ['PhD Scholar', 'completed', 'completed-phd'],
    ['PhD Scholar', 'alumni', 'completed-phd'],
    ['Masters Student', 'current', 'ongoing-mtech'],
    ['Masters Student', 'alumni', 'alumni-mtech'],
    ['Masters Student', 'completed', 'alumni-mtech'],
  ] as const)('groups %s with %s status as %s', (role, status, group) => {
    expect(getAdminMemberGroupKey({ role, status })).toBe(group)
  })

  it('uses academic category labels in the member form', () => {
    expect(getAdminMemberStatusOptions('PhD Scholar')).toEqual([
      { value: 'current', label: 'Ongoing PhD' },
      { value: 'completed', label: 'Completed PhD' },
    ])
    expect(getAdminMemberStatusOptions('Masters Student')).toEqual([
      { value: 'current', label: 'Ongoing M.Tech' },
      { value: 'alumni', label: 'Alumni M.Tech' },
    ])
  })

  it('normalizes legacy non-current statuses for the selected academic role', () => {
    expect(normalizeStatusForRole('PhD Scholar', 'alumni')).toBe('completed')
    expect(normalizeStatusForRole('Masters Student', 'completed')).toBe('alumni')
  })
})
