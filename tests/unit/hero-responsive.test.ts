import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const orbitalSystem = readFileSync(
  resolve('src/components/home/OrbitalResearchSystem.tsx'),
  'utf8',
)

describe('responsive hero orbital graphic', () => {
  it('uses a fluid square instead of transform scaling on small screens', () => {
    expect(orbitalSystem).toContain('aspect-square w-full max-w-[440px]')
    expect(orbitalSystem).not.toContain('scale-[0.85]')
  })

  it('keeps all six research nodes in the responsive graphic', () => {
    for (const label of [
      'Mobile Edge Computing',
      'Network Economics',
      'AI for Education',
      'Game Theory',
      'Blockchain',
      '5G and Beyond',
    ]) {
      expect(orbitalSystem).toContain(label)
    }

    expect(orbitalSystem).toContain('data-research-node={node.label}')
  })
})
