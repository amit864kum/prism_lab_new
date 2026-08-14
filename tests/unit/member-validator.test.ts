import { describe, expect, it } from 'vitest'
import { memberSchema } from '../../src/validators/member'

const validMember = {
  name: 'Test Member',
  slug: 'test-member',
  role: 'PhD Scholar' as const,
  status: 'current' as const,
}

describe('member validator', () => {
  it('normalizes common profile-link inputs before validation', () => {
    const member = memberSchema.parse({
      ...validMember,
      linkedinUrl: ' linkedin.com/in/test-member ',
      googleScholarUrl: 'scholar.google.com/citations?user=test',
      githubUrl: 'github.com/test-member',
      personalPortfolioWebsite: 'test-member.example.com',
    })

    expect(member.linkedinUrl).toBe('https://linkedin.com/in/test-member')
    expect(member.googleScholarUrl).toBe(
      'https://scholar.google.com/citations?user=test',
    )
    expect(member.githubUrl).toBe('https://github.com/test-member')
    expect(member.personalPortfolioWebsite).toBe(
      'https://test-member.example.com',
    )
  })

  it('continues to reject malformed profile links with a field-level error', () => {
    const result = memberSchema.safeParse({
      ...validMember,
      linkedinUrl: 'not a valid link',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ['linkedinUrl'],
        message: 'Invalid LinkedIn URL',
      })
    }
  })
})
