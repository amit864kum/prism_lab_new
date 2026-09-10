import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('visitor counter', () => {
  it('increments the aggregate only after inserting a unique visitor', () => {
    const metricRepository = readFileSync(
      resolve('src/repositories/site-metric.repository.ts'),
      'utf8',
    )
    const visitorRepository = readFileSync(
      resolve('src/repositories/visitor.repository.ts'),
      'utf8',
    )

    expect(metricRepository).toContain("const VISITOR_METRIC_ID = 'total-visitors'")
    expect(metricRepository).toContain('$inc: { value: 1 }')
    expect(visitorRepository).toContain('$setOnInsert')
    expect(visitorRepository).toContain('result.upsertedCount === 1')
    expect(visitorRepository).toContain('error.code === 11000')
  })

  it('reuses a browser marker, stores only its digest, and displays the total', () => {
    const route = readFileSync(resolve('src/app/api/visitors/route.ts'), 'utf8')
    const footer = readFileSync(resolve('src/components/layout/Footer.tsx'), 'utf8')
    const service = readFileSync(resolve('src/services/visitor.service.ts'), 'utf8')

    expect(route).toContain("const VISITOR_COOKIE = 'prism_visitor_counted'")
    expect(route).toContain('httpOnly: true')
    expect(route).toContain("sameSite: 'lax'")
    expect(route).toContain("'Cache-Control': 'no-store'")
    expect(route).toContain("rawVisitorCookie === '1'")
    expect(footer).toContain("const VISITOR_STORAGE_KEY = 'prism_visitor_id'")
    expect(footer).toContain('window.crypto.randomUUID()')
    expect(service).toContain("createHash('sha256')")
    expect(footer).toContain('Total visitors:')
  })
})
