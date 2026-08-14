import { describe, expect, it } from 'vitest'
import {
  getPublicationAuthorGroupKey,
  groupPublicationAuthors,
} from '../../src/lib/publication-author-groups'

describe('publication author groups', () => {
  it.each([
    ['PhD Scholar', 'current', 'ongoing-phd'],
    ['Masters Student', 'current', 'ongoing-mtech'],
    ['PhD Scholar', 'completed', 'alumni'],
    ['PhD Scholar', 'alumni', 'alumni'],
    ['Masters Student', 'completed', 'alumni'],
    ['Masters Student', 'alumni', 'alumni'],
    ['Undergraduate', 'current', 'other'],
  ] as const)('places %s with %s status in %s', (role, status, group) => {
    expect(getPublicationAuthorGroupKey({ name: 'Member', role, status })).toBe(group)
  })

  it('returns groups in the requested author-selector order', () => {
    const groups = groupPublicationAuthors([
      { name: 'Alumni', role: 'Masters Student', status: 'alumni' },
      { name: 'M.Tech', role: 'Masters Student', status: 'current' },
      { name: 'PhD', role: 'PhD Scholar', status: 'current' },
    ])

    expect(groups.map((group) => group.label)).toEqual([
      'Ongoing PhD',
      'Ongoing M.Tech',
      'Alumni Students',
    ])
  })
})
