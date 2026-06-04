import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import ResearchArea from '@/models/ResearchArea'
import Member from '@/models/Member'

// Force dynamic rendering to fetch latest db routes
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://prismlab.iitp.ac.in'

  try {
    await connectDB()

    // Fetch dynamic routes
    const [areas, members] = await Promise.all([
      ResearchArea.find({}, 'slug').lean(),
      Member.find({ status: 'current' }, '_id').lean(),
    ])

    const sitemaps: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/`, lastModified: new Date() },
      { url: `${baseUrl}/research/areas`, lastModified: new Date() },
      { url: `${baseUrl}/research/projects`, lastModified: new Date() },
      { url: `${baseUrl}/research/sponsors`, lastModified: new Date() },
      { url: `${baseUrl}/publications`, lastModified: new Date() },
      { url: `${baseUrl}/people/principal-investigator`, lastModified: new Date() },
      { url: `${baseUrl}/people/current-members`, lastModified: new Date() },
      { url: `${baseUrl}/people/alumni`, lastModified: new Date() },
      { url: `${baseUrl}/people/collaborators`, lastModified: new Date() },
      { url: `${baseUrl}/gallery`, lastModified: new Date() },
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
        url: `${baseUrl}/people/current-members/${m._id.toString()}`,
        lastModified: new Date(),
      })
    })

    return sitemaps
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return [
      { url: `${baseUrl}/`, lastModified: new Date() },
    ]
  }
}
