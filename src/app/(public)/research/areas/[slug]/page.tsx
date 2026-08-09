import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, BookOpen, Calendar, ExternalLink, FileText, Tag } from 'lucide-react'
import {
  getPublicResearchArea,
  getResearchAreaPageData,
} from '@/services/public-content.service'
import SafeImage from '@/components/ui/SafeImage'
import { normalizePublicationType } from '@/lib/publication-types'
import { sanitizeHTML } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const area = await getPublicResearchArea(slug)
  if (!area) return { title: 'Research Area Not Found - Prism Lab' }

  const description = ((area as any).overview || area.description || '').replace(/<[^>]*>/g, '')
  return {
    title: `${area.title} | Research Area | Prism Lab, IIT Patna`,
    description: description.substring(0, 160),
  }
}

function authorHref(author: any) {
  return `/people/current-members/${author?.slug || author?._id?.toString()}`
}

function PublicationTable({
  title,
  items,
  venueHeader,
}: {
  title: string
  items: any[]
  venueHeader: string
}) {
  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          {title}
        </h2>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {items.length} publication{items.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-[860px] w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-slate-850 dark:text-slate-400">
            <tr>
              <th className="w-20 px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Authors</th>
              <th className="px-4 py-3">Paper Title</th>
              <th className="px-4 py-3">{venueHeader}</th>
              <th className="w-24 px-4 py-3">Year</th>
              <th className="w-36 px-4 py-3">PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((pub, index) => (
              <tr key={pub._id.toString()} className="align-top transition hover:bg-slate-50/70 dark:hover:bg-slate-950/50">
                <td className="px-4 py-4 font-extrabold text-slate-600 dark:text-slate-400">{index + 1}</td>
                <td className="px-4 py-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  {(pub.authors || []).map(
                    (
                      author: any,
                      authorIndex: number
                    ) => (
                      <span
                        key={
                          author?._id?.toString() ||
                          authorIndex
                        }
                      >
                        {author?.slug ||
                          author?._id ? (
                          <Link
                            href={authorHref(author)}
                            className="font-semibold text-slate-700 hover:text-blue-600 hover:underline dark:text-slate-300 dark:hover:text-blue-400"
                          >
                            {author?.name ||
                              'Unknown Author'}
                          </Link>
                        ) : (
                          <span>
                            {author?.name ||
                              'Unknown Author'}
                          </span>
                        )}

                        {(authorIndex <
                          pub.authors.length -
                          1 ||
                          (pub.externalAuthors
                            ?.length ?? 0) >
                          0) &&
                          ', '}
                      </span>
                    )
                  )}

                  {(
                    pub.externalAuthors || []
                  ).map(
                    (
                      author: string,
                      index: number
                    ) => (
                      <span
                        key={`external-${index}`}
                      >
                        {author}
                        {index <
                          pub.externalAuthors
                            .length -
                          1
                          ? ', '
                          : ''}
                      </span>
                    )
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className="font-extrabold leading-snug text-slate-950 dark:text-white">{pub.title}</p>
                  {pub.doiLink && (
                    <a
                      href={pub.doiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 break-all text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                    >
                      {pub.doiLink}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  )}
                  {pub.externalUrl && (
                    <a
                      href={pub.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block break-all text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                    >
                      External Link
                    </a>
                  )}
                </td>
                <td className="px-4 py-4 text-xs font-semibold italic text-slate-600 dark:text-slate-400">
                  {pub.journalName || pub.venue || '-'}
                </td>
                <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-300">{pub.year}</td>
                <td className="px-4 py-4">
                  {pub.pdfUrl ? (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                    >
                      <FileText className="h-4 w-4" />
                      Download PDF
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default async function ResearchAreaDetailsPage({ params }: PageProps) {
  const { slug } = await params

  const { area, publications: relatedPublications } = await getResearchAreaPageData(slug)

  if (!area) {
    notFound()
  }

  const journals = relatedPublications.filter((publication) => normalizePublicationType(publication.type) === 'journal')
  const conferences = relatedPublications.filter((publication) => normalizePublicationType(publication.type) === 'conference')
  const overview = (area as any).overview || area.description || ''

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/research/areas"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Research Areas
          </Link>
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              {area.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Prism Research Laboratory Specialized Domain
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <main className="lg:col-span-8 space-y-10">
            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Domain Overview
              </h2>
              <div
                className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(overview) }}
              />
            </section>

            {(journals.length > 0 || conferences.length > 0) && (
              <div className="space-y-10">
                <PublicationTable title="Journals" items={journals} venueHeader="Journal Name" />
                <PublicationTable title="Conferences" items={conferences} venueHeader="Conference Name" />
              </div>
            )}
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Domain Meta Information
              </h3>
              <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                {area.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950/40 aspect-video relative flex items-center justify-center">
                    <SafeImage
                      src={area.imageUrl}
                      alt={area.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <Tag className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Slug Identifier</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{area.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-1.5">
                  <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Created Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {area.createdAt ? new Date(area.createdAt).toLocaleDateString() : 'Not available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
