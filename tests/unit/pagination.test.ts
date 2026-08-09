import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  paginateResults,
  parsePagination,
} from '../../src/lib/pagination'

describe('API pagination', () => {
  it('uses safe defaults and calculates the database window', () => {
    expect(parsePagination(new URLSearchParams())).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      skip: 0,
      queryLimit: DEFAULT_PAGE_SIZE + 1,
    })
  })

  it('clamps oversized limits and rejects invalid positive integers', () => {
    expect(parsePagination(new URLSearchParams('page=-2&limit=99999'))).toEqual({
      page: 1,
      limit: MAX_PAGE_SIZE,
      skip: 0,
      queryLimit: MAX_PAGE_SIZE + 1,
    })
  })

  it('preserves the requested page and reports whether another page exists', () => {
    const options = parsePagination(new URLSearchParams('page=2&limit=2'))
    expect(paginateResults(['c', 'd', 'e'], options)).toEqual({
      items: ['c', 'd'],
      pagination: { page: 2, limit: 2, hasMore: true },
    })
  })
})
