import PublicationsClient from '@/components/publications/PublicationsClient'
import { normalizePublicationType } from '@/lib/publication-types'
import { getPublicationsPageData } from '@/services/public-content.service'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

export default async function PublicationsPage() {
  const publications = await getPublicationsPageData()

  // Serialize ObjectIds for safe pass to client component
  const serializedPublications = publications.map((pub: any) => ({
    _id: pub._id.toString(),
    title: pub.title,
    slug: pub.slug,
    type: normalizePublicationType(pub.type),

    authors: pub.authors.map((author: any) => ({
      _id: author._id.toString(),
      name: author.name,
      slug: author.slug,
      role: author.role,
    })),

    externalAuthors:
      pub.externalAuthors || [],

    year: pub.year,
    venue: pub.venue || '',
    journalName:
      pub.journalName || '',
    doiLink:
      pub.doiLink || '',
    description:
      pub.description || '',
    datasetLink:
      pub.datasetLink || '',
    date: pub.date || '',
    location:
      pub.location || '',
    talkType:
      pub.talkType || '',
    displayOrder:
      pub.displayOrder || null,
    abstract:
      pub.abstract || '',
    pdfUrl:
      pub.pdfUrl || '',
    externalUrl:
      pub.externalUrl || '',
    tags: pub.tags || [],
  }))

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Title Banner */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Publications
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Explore peer-reviewed articles, conference proceedings, workshop papers, book chapters, and academic theses published by members of Prism Research Lab.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <PublicationsClient initialPublications={serializedPublications} />
      </div>
    </div>
  )
}
