import { describe, expect, it } from 'vitest'
import {
  isSelectableAdminPublicationMember,
  isVisibleAdminMember,
} from '../../src/lib/admin-member-visibility'

describe('admin member visibility', () => {
  it('removes Intern members from admin member sections', () => {
    expect(isVisibleAdminMember({ role: 'Intern' })).toBe(false)
    expect(isVisibleAdminMember({ role: 'PhD Scholar' })).toBe(true)
  })

  it.each(['Amit Kumar', ' amit   kumar ', 'Yuvraj Singh', 'YUVRAJ SINGH'])(
    'excludes %s from admin publication member selectors',
    (name) => {
      expect(isSelectableAdminPublicationMember({ name, role: 'PhD Scholar' })).toBe(false)
    }
  )

  it('keeps other non-Intern members selectable', () => {
    expect(
      isSelectableAdminPublicationMember({ name: 'Shubham Kumar', role: 'PhD Scholar' })
    ).toBe(true)
  })
})
