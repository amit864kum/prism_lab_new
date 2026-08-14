import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import GalleryPreview, {
  GALLERY_AUTOPLAY_INTERVAL_MS,
} from '../../src/components/home/GalleryPreview'

describe('GalleryPreview', () => {
  it('advances the gallery every two seconds', () => {
    expect(GALLERY_AUTOPLAY_INTERVAL_MS).toBe(2000)
  })

  it('renders reference-style categories and complete image cards', () => {
    const markup = renderToStaticMarkup(
      <GalleryPreview
        images={[
          {
            imageUrl: '/research.jpg',
            caption: 'Research milestone',
            category: 'Research & Activities',
          },
          {
            imageUrl: '/discussion.jpg',
            caption: 'Group discussion',
            category: 'Group Discussion',
          },
        ]}
      />,
    )

    expect(markup).toContain('Research &amp; Activity')
    expect(markup).toContain('Group Discussion')
    expect(markup).toContain('Research milestone')
    expect(markup).toContain('aria-label="Gallery carousel"')
    expect(markup).toContain('cursor-zoom-in')
  })
})
