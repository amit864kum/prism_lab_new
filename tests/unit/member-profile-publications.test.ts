import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getMemberBySlugOrId: vi.fn(),
  listPublications: vi.fn(),
}))

vi.mock('../../src/repositories/member.repository', () => ({
  countCurrentPhdMembers: vi.fn(),
  getMemberBySlugOrId: mocks.getMemberBySlugOrId,
  listCurrentMemberSitemapEntries: vi.fn(),
  listMembers: vi.fn(),
}))

vi.mock('../../src/repositories/publication.repository', () => ({
  countPublications: vi.fn(),
  listPublications: mocks.listPublications,
}))

import { getPublicMemberProfile } from '../../src/services/public-content.service'

describe('member profile publication loading', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads global and profile-only publications authored by the selected member', async () => {
    mocks.getMemberBySlugOrId.mockResolvedValue({
      _id: { toString: () => 'member-123' },
      name: 'Selected Author',
    })
    mocks.listPublications.mockResolvedValue([
      { _id: 'global-publication', profileOnly: false },
      { _id: 'member-publication', profileOnly: true },
    ])

    const result = await getPublicMemberProfile('selected-author', {
      select: 'title authors profileOnly',
      sort: { year: -1 },
    })

    expect(mocks.listPublications).toHaveBeenCalledWith(
      { authorId: 'member-123' },
      {
        populate: true,
        authorSelect: 'name slug role',
        select: 'title authors profileOnly',
        sort: { year: -1 },
      }
    )
    expect(result.publications).toHaveLength(2)
  })

  it('does not query publications when the member does not exist', async () => {
    mocks.getMemberBySlugOrId.mockResolvedValue(null)

    await expect(getPublicMemberProfile('missing-member')).resolves.toEqual({
      member: null,
      publications: [],
    })
    expect(mocks.listPublications).not.toHaveBeenCalled()
  })
})
