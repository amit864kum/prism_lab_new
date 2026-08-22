import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const homepage = readFileSync(resolve('src/app/(public)/page.tsx'), 'utf8')
const researchAreasPage = readFileSync(
  resolve('src/app/(public)/research/areas/page.tsx'),
  'utf8',
)
const globalStyles = readFileSync(resolve('src/app/globals.css'), 'utf8')

describe('research-domain card heading alignment', () => {
  it('marks headings consistently on the homepage and research listing', () => {
    expect(homepage).toContain('research-domain-card-title')
    expect(researchAreasPage).toContain('research-domain-card-title')
    expect(homepage).toContain('research-domain-card-header')
    expect(researchAreasPage).toContain('research-domain-card-header')
  })

  it('stacks the header on phones and places the title beside the icon on desktop', () => {
    expect(homepage).toContain(
      'flex flex-col items-start gap-4 md:flex-row md:items-center',
    )
    expect(researchAreasPage).toContain(
      'flex flex-col items-start gap-4 md:flex-row md:items-center',
    )
    expect(globalStyles).toMatch(
      /\.research-domain-card-title[\s\S]*?text-align: left !important;/,
    )
  })
})
