import PublicationsClient from '@/components/publications/PublicationsClient'
import { normalizePublicationType } from '@/lib/publication-types'
import { getPublicationsPageData } from '@/services/public-content.service'
import { BookOpen, Layers3 } from 'lucide-react'

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
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">
              <BookOpen className="h-3.5 w-3.5" />
              Research output
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Publications</h1>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
              Explore peer-reviewed articles, conference proceedings, book chapters, datasets, patents, and invited talks from PRISM Lab.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <Layers3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-black">{serializedPublications.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Published works</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <PublicationsClient initialPublications={serializedPublications} />
      </div>
    </div>
  )
}
