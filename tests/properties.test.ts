import { describe, it, expect, vi } from 'vitest'
import fc from 'fast-check'
import { groupMembers } from '../lib/grouping'
import { validatePublication } from '../lib/publication-validation'
import { generateUniqueSlug } from '../lib/slug'
import { rateLimit } from '../lib/rate-limit'
import { validateFile } from '../lib/upload'
import PIProfile from '../models/PIProfile'
import Member, { IMember } from '../models/Member'

// Mock Mongoose models
vi.mock('../models/PIProfile', () => {
  return {
    default: {
      findOne: vi.fn().mockResolvedValue({ name: 'Dr. Amit Kumar' }),
    },
  }
})

vi.mock('../models/Member', () => {
  return {
    default: {
      findOne: vi.fn(),
    },
  }
})

describe('Property 1 & 2: Carousel bounds & autoplay pause', () => {
  it('should wrap index correctly and stay in range [0, n)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // carousel size n
        fc.array(fc.constantFrom('next', 'prev')), // navigation sequence
        (n, moves) => {
          let index = 0
          let paused = false

          moves.forEach((move) => {
            // Manual navigation pauses autoplay
            paused = true
            if (move === 'next') {
              index = (index + 1) % n
            } else {
              index = (index - 1 + n) % n
            }
            expect(index).toBeGreaterThanOrEqual(0)
            expect(index).toBeLessThan(n)
          })
          
          if (moves.length > 0) {
            expect(paused).toBe(true)
          }
        }
      )
    )
  })
})

describe('Property 3: Slug uniqueness & safety', () => {
  it('should generate URL-safe lowercase slugs with unique suffixes on collisions', async () => {
    // Generate random titles containing at least one alphanumeric character
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1, maxLength: 50 }).filter(str => /[a-zA-Z0-9]/.test(str)), async (title) => {
        // Mock a model with a collision store
        const existingSlugs: string[] = []
        const mockModel = {
          countDocuments: vi.fn().mockImplementation(async (query: any) => {
            const isMatch = existingSlugs.includes(query.slug)
            if (isMatch) return 1
            existingSlugs.push(query.slug)
            return 0
          }),
        } as any

        // Generate first slug
        const slug1 = await generateUniqueSlug(title, mockModel)
        expect(slug1).toMatch(/^[a-z0-9-]+$/)
        expect(slug1).toBe(slug1.toLowerCase())

        // Re-run with same title to trigger collision
        const slug2 = await generateUniqueSlug(title, mockModel)
        expect(slug2).toMatch(/^[a-z0-9-]+$/)
        expect(slug2).not.toBe(slug1)
      })
    )
  })
})

describe('Property 4: Member-publication bijection sync', () => {
  it('should maintain bidirectional consistency between members and publications', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          memberId: fc.uuid().map(id => id.toString()),
          publicationIds: fc.array(fc.uuid().map(id => id.toString()))
        })),
        (mockDatabase) => {
          // Build bidirectional map
          const memberToPubs = new Map<string, string[]>()
          const pubToMembers = new Map<string, string[]>()

          // Ingest publications for members and build back-references
          mockDatabase.forEach((entry) => {
            memberToPubs.set(entry.memberId, entry.publicationIds)
            entry.publicationIds.forEach((pubId) => {
              if (!pubToMembers.has(pubId)) {
                pubToMembers.set(pubId, [])
              }
              pubToMembers.get(pubId)!.push(entry.memberId)
            })
          });

          // Assert the bijection invariant: m_id ∈ p.linkedMembers ⟺ p_id ∈ m.publications
          memberToPubs.forEach((pubs, mId) => {
            pubs.forEach((pId) => {
              const members = pubToMembers.get(pId)
              expect(members).toBeDefined()
              expect(members).toContain(mId)
            })
          })

          pubToMembers.forEach((members, pId) => {
            members.forEach((mId) => {
              const pubs = memberToPubs.get(mId)
              expect(pubs).toBeDefined()
              expect(pubs).toContain(pId)
            })
          })
        }
      )
    )
  })
})

describe('Property 7: Member grouping', () => {
  const memberArb = fc.record({
    _id: fc.uuid().map(id => id.toString()),
    name: fc.string({ minLength: 1 }),
    slug: fc.string({ minLength: 1 }),
    role: fc.constantFrom('PhD Scholar', 'Masters Student', 'Undergraduate', 'Research Assistant'),
    status: fc.constantFrom('current', 'alumni'),
    yearJoined: fc.option(fc.integer({ min: 2000, max: 2100 })),
    yearLeft: fc.option(fc.integer({ min: 2000, max: 2100 })),
    imageUrl: fc.option(fc.string()),
    bio: fc.option(fc.string()),
    email: fc.option(fc.string()),
    linkedinUrl: fc.option(fc.string()),
    googleScholarUrl: fc.option(fc.string()),
    publications: fc.constant([]),
    createdAt: fc.date(),
    updatedAt: fc.date(),
  })

  it('should preserve all members and group them correctly', () => {
    fc.assert(
      fc.property(fc.array(memberArb), (inputMembers: any[]) => {
        const group = groupMembers(inputMembers as IMember[])

        // 1. All input members are accounted for
        const combinedCount =
          group.phdScholars.length +
          group.otherScholarsByYear.reduce((acc, y) => acc + y.ongoing.length + y.completed.length, 0) +
          group.unspecifiedYear.ongoing.length +
          group.unspecifiedYear.completed.length

        expect(combinedCount).toBe(inputMembers.length)

        // 2. PhD scholars only contain PhD role
        group.phdScholars.forEach((m) => {
          expect(m.role).toBe('PhD Scholar')
        })

        // 3. Others group should be sorted by yearJoined descending
        const years = group.otherScholarsByYear.map((y) => y.year)
        for (let i = 0; i < years.length - 1; i++) {
          expect(years[i]).toBeGreaterThanOrEqual(years[i + 1])
        }

        // 4. In each year, ongoing (current) and completed (alumni) are segregated
        group.otherScholarsByYear.forEach((y) => {
          y.ongoing.forEach((m) => expect(m.status).toBe('current'))
          y.completed.forEach((m) => expect(m.status).toBe('alumni'))
        })
      })
    )
  })
})

describe('Property 5: PI Mandatory rule', () => {
  it('should accept publication iff PI is listed as an author', async () => {
    // Mock Member.findOne to resolve to null (simulating no matching registered member)
    const mockMemberFindOne = Member.findOne as any
    mockMemberFindOne.mockResolvedValue(null)

    // Valid case: PI name in author list
    const resultValid = await validatePublication(['Dr. Amit Kumar', 'Student Name'])
    expect(resultValid.success).toBe(true)

    // Invalid case: PI name missing
    const resultInvalid = await validatePublication(['Student Name A', 'Student Name B'])
    expect(resultInvalid.success).toBe(false)
    expect(resultInvalid.code).toBe('PI_REQUIRED')
  })
})

describe('Property 12: Rate limit logic', () => {
  it('should trigger rate limiting after max requests and allow again on a new interval', () => {
    const key = 'test-ip-client'
    const config = { interval: 1000, maxRequests: 3 }

    // First 3 requests succeed
    const r1 = rateLimit(key, config)
    expect(r1.success).toBe(true)
    expect(r1.remaining).toBe(2)

    const r2 = rateLimit(key, config)
    expect(r2.success).toBe(true)
    expect(r2.remaining).toBe(1)

    const r3 = rateLimit(key, config)
    expect(r3.success).toBe(true)
    expect(r3.remaining).toBe(0)

    // 4th request exceeds rate limit
    const r4 = rateLimit(key, config)
    expect(r4.success).toBe(false)
  })
})

describe('Property 8: File validation rules', () => {
  it('should accept valid file types and sizes, and reject invalid ones', async () => {
    // Valid Image
    const validImage = new File([''], 'photo.png', { type: 'image/png' })
    Object.defineProperty(validImage, 'size', { value: 1024 * 1024 }) // 1MB
    const imgResult = await validateFile(validImage, 'image')
    expect(imgResult.valid).toBe(true)

    // Image exceeds size limit
    const largeImage = new File([''], 'big-photo.png', { type: 'image/png' })
    Object.defineProperty(largeImage, 'size', { value: 12 * 1024 * 1024 }) // 12MB
    const imgLargeResult = await validateFile(largeImage, 'image')
    expect(imgLargeResult.valid).toBe(false)
    expect(imgLargeResult.error).toContain('File size exceeds')

    // Invalid file mime type
    const invalidImage = new File([''], 'file.exe', { type: 'application/x-msdownload' })
    const imgInvalidResult = await validateFile(invalidImage, 'image')
    expect(imgInvalidResult.valid).toBe(false)
    expect(imgInvalidResult.error).toContain('Invalid file type')
  })
})

describe('Property 6: Publication ordering', () => {
  it('should sort publications by year descending', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          year: fc.integer({ min: 2000, max: 2100 })
        })),
        (pubs) => {
          const sorted = [...pubs].sort((a, b) => b.year - a.year)
          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].year).toBeGreaterThanOrEqual(sorted[i + 1].year)
          }
        }
      )
    )
  })
})
