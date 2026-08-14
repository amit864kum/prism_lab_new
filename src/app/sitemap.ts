import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'
import { getSitemapContent } from '@/services/public-content.service'
import { appLogger } from '@/lib/logger'

// Force dynamic rendering to fetch latest db routes
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  try {
    const [areas, members] = await getSitemapContent()

    const sitemaps: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/`, lastModified: new Date() },
      { url: `${baseUrl}/research/areas`, lastModified: new Date() },
      { url: `${baseUrl}/projects`, lastModified: new Date() },
      { url: `${baseUrl}/research/projects`, lastModified: new Date() },
      { url: `${baseUrl}/research/sponsors`, lastModified: new Date() },
      { url: `${baseUrl}/publications`, lastModified: new Date() },
      { url: `${baseUrl}/people/current-members`, lastModified: new Date() },
      { url: `${baseUrl}/people/alumni`, lastModified: new Date() },
      { url: `${baseUrl}/people/collaborators`, lastModified: new Date() },
    ]

    // Add dynamic research areas
    areas.forEach((area: any) => {
      sitemaps.push({
        url: `${baseUrl}/research/areas/${area.slug}`,
        lastModified: new Date(),
      })
    })

    // Add dynamic members
    members.forEach((m: any) => {
      sitemaps.push({
        url: `${baseUrl}/people/current-members/${m.slug || m._id.toString()}`,
        lastModified: new Date(),
      })
    })

    return sitemaps
  } catch (error) {
    appLogger.error('Sitemap generation failed', { error })
    return [
      { url: `${baseUrl}/`, lastModified: new Date() },
    ]
  }
}
