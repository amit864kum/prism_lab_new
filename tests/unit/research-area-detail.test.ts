import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DEFAULT_THEME } from '../../src/config/theme'
import { researchAreaSchema } from '../../src/validators/research'

const researchAreaPage = readFileSync(
  resolve('src/app/(public)/research/areas/[slug]/page.tsx'),
  'utf8',
)
const rootLayout = readFileSync(resolve('src/app/layout.tsx'), 'utf8')

describe('research-area detail experience', () => {
  it('does not expose internal domain metadata to public visitors', () => {
    expect(researchAreaPage).not.toContain('Domain Meta Information')
    expect(researchAreaPage).not.toContain('Slug Identifier')
    expect(researchAreaPage).not.toContain('Created Date')
  })

  it('keeps the useful overview and publication content', () => {
    expect(researchAreaPage).toContain('Research Overview')
    expect(researchAreaPage).toContain('Related Publications')
    expect(researchAreaPage).toContain('Journal Publications')
    expect(researchAreaPage).toContain('Conference Publications')
    expect(researchAreaPage).toContain('whitespace-pre-line')
  })

  it('uses the admin description as the canonical public overview', () => {
    expect(researchAreaPage).toContain(
      "area.description || (area as any).overview || ''",
    )

    const parsed = researchAreaSchema.parse({
      title: 'Internet of Things',
      slug: 'internet-of-things',
      description: 'Updated from the admin panel',
      overview: 'Stale legacy overview',
      order: 1,
    })

    expect(parsed.description).toBe('Updated from the admin panel')
    expect(parsed.overview).toBe('Updated from the admin panel')
  })
})

describe('global theme default', () => {
  it('starts in light mode without following the operating-system theme', () => {
    expect(DEFAULT_THEME).toBe('light')
    expect(rootLayout).toContain('enableSystem={false}')
  })
})
