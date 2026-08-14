import { describe, expect, it } from 'vitest'
import Member from '../../src/models/Member'

describe('Member alumni fields', () => {
  it('keeps thesis title and current position on the persisted model shape', () => {
    const member = new Member({
      name: 'Alumni Test',
      slug: 'alumni-test',
      role: 'Masters Student',
      status: 'completed',
      thesisTitle: 'Edge Intelligence for Learning Systems',
      currentPosition: 'Research Engineer',
    }).toObject()

    expect(member.thesisTitle).toBe('Edge Intelligence for Learning Systems')
    expect(member.currentPosition).toBe('Research Engineer')
    expect(Member.schema.path('thesisTitle')).toBeDefined()
    expect(Member.schema.path('currentPosition')).toBeDefined()
  })
})
