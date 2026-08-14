import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import SponsorsMarquee from '../../src/components/home/SponsorsMarquee'

const sponsors = Array.from({ length: 4 }, (_, index) => ({
  name: `Sponsor ${index + 1}`,
  logoUrl: `/sponsor-${index + 1}.png`,
}))

describe('SponsorsMarquee', () => {
  it('keeps one to three sponsors static and centered', () => {
    const markup = renderToStaticMarkup(<SponsorsMarquee sponsors={sponsors.slice(0, 3)} />)

    expect(markup).not.toContain('animate-marquee')
    expect(markup.match(/<article/g)).toHaveLength(3)
  })

  it('creates two continuous tracks when there are more than three sponsors', () => {
    const markup = renderToStaticMarkup(<SponsorsMarquee sponsors={sponsors} />)

    expect(markup.match(/animate-marquee/g)).toHaveLength(2)
    expect(markup.match(/<article/g)).toHaveLength(8)
    expect(markup).toContain('aria-hidden="true"')
  })
})
