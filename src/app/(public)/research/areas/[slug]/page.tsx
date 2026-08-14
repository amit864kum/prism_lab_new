import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  Layers3,
} from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import { normalizePublicationType } from '@/lib/publication-types'
import { sanitizeHTML } from '@/lib/sanitize'
import {
  getPublicResearchArea,
  getResearchAreaPageData,
} from '@/services/public-content.service'

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

  const description = (area.description || (area as any).overview || '').replace(
    /<[^>]*>/g,
    '',
  )

  return {
    title: `${area.title} | Research Area | Prism Lab, IIT Patna`,
    description: description.substring(0, 160),
  }
}

function authorHref(author: any) {
  return `/people/current-members/${author?.slug || author?._id?.toString()}`
}

function PublicationAuthors({ publication }: { publication: any }) {
  const internalAuthors = publication.authors || []
  const externalAuthors = publication.externalAuthors || []

  return (
    <>
      {internalAuthors.map((author: any, index: number) => (
        <span key={author?._id?.toString() || `${author?.name}-${index}`}>
          {author?.slug || author?._id ? (
            <Link
              href={authorHref(author)}
              className="relative z-10 font-bold text-slate-700 transition hover:text-blue-700 hover:underline dark:text-slate-300 dark:hover:text-blue-300"
            >
              {author?.name || 'Unknown Author'}
            </Link>
          ) : (
            <span>{author?.name || 'Unknown Author'}</span>
          )}
          {(index < internalAuthors.length - 1 || externalAuthors.length > 0) &&
            ', '}
        </span>
      ))}
      {externalAuthors.map((author: string, index: number) => (
        <span key={`${author}-${index}`}>
          {author}
          {index < externalAuthors.length - 1 ? ', ' : ''}
        </span>
      ))}
      {internalAuthors.length === 0 && externalAuthors.length === 0
        ? 'Authors not specified'
        : null}
    </>
  )
}

function PublicationActions({ publication }: { publication: any }) {
  if (!publication.pdfUrl && !publication.doiLink && !publication.externalUrl) {
    return <span className="text-xs font-semibold text-slate-400">Not available</span>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {publication.doiLink && (
        <a
          href={publication.doiLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
        >
          DOI
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
      {publication.externalUrl && (
        <a
          href={publication.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          Open
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
      {publication.pdfUrl && (
        <a
          href={publication.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#08265c] px-3 py-2 text-xs font-black text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          PDF
          <FileText className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}

function PublicationSection({
  title,
  eyebrow,
  items,
  venueHeader,
}: {
  title: string
  eyebrow: string
  items: any[]
  venueHeader: string
}) {
  if (items.length === 0) return null

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="research-area-ui-copy text-[10px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {title}
          </h2>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {items.length} publication{items.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="grid gap-4 md:hidden">
        {items.map((publication, index) => (
          <article
            key={publication._id.toString()}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                {publication.year}
              </span>
            </div>

            <h3 className="mt-4 text-base font-black leading-6 text-slate-950 dark:text-white">
              {publication.title}
            </h3>
            <p className="research-area-publication-copy mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <span className="font-black text-slate-700 dark:text-slate-200">
                Authors:{' '}
              </span>
              <PublicationAuthors publication={publication} />
            </p>
            <p className="research-area-ui-copy mt-3 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              {publication.journalName || publication.venue || 'Venue not specified'}
            </p>
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <PublicationActions publication={publication} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-slate-800 dark:bg-slate-900 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-[#06152f] dark:border-slate-700">
                <th className="w-20 px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  No.
                </th>
                <th className="min-w-[390px] px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Publication
                </th>
                <th className="min-w-[220px] px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {venueHeader}
                </th>
                <th className="w-24 px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Year
                </th>
                <th className="w-40 px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((publication, index) => (
                <tr
                  key={publication._id.toString()}
                  className="align-top transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/15"
                >
                  <td className="px-5 py-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <h3 className="text-sm font-black leading-6 text-slate-950 dark:text-white">
                      {publication.title}
                    </h3>
                    <p className="research-area-publication-copy mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      <span className="font-black text-slate-700 dark:text-slate-300">
                        Authors:{' '}
                      </span>
                      <PublicationAuthors publication={publication} />
                    </p>
                  </td>
                  <td className="px-5 py-5 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
                    {publication.journalName || publication.venue || 'Not specified'}
                  </td>
                  <td className="px-5 py-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      {publication.year}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <PublicationActions publication={publication} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default async function ResearchAreaDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const { area, publications: relatedPublications } =
    await getResearchAreaPageData(slug)

  if (!area) notFound()

  const journals = relatedPublications.filter(
    (publication) => normalizePublicationType(publication.type) === 'journal',
  )
  const conferences = relatedPublications.filter(
    (publication) => normalizePublicationType(publication.type) === 'conference',
  )
  const overview = area.description || (area as any).overview || ''
  const publicationCount = journals.length + conferences.length

  return (
    <div className="research-area-detail-page min-h-screen bg-slate-50/70 pb-20 dark:bg-slate-950">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#020a18] via-[#08265c] to-blue-700 text-white">
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="absolute -right-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-cyan-300/20 blur-[120px]" />
        <div className="absolute -bottom-56 left-1/4 h-[28rem] w-[28rem] rounded-full bg-blue-300/15 blur-[130px]" />

        <div
          className={`relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${
            area.imageUrl ? 'lg:grid-cols-[1.12fr_0.88fr]' : ''
          }`}
        >
          <div className={area.imageUrl ? '' : 'max-w-5xl'}>
            <Link
              href="/research/areas"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-blue-50 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              All Research Areas
            </Link>

            <p className="research-area-hero-copy mt-8 text-[11px] font-black uppercase tracking-[0.24em] text-cyan-300">
              PRISM Lab Research Domain
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {area.title}
            </h1>
            <p className="research-area-hero-copy mt-6 max-w-2xl text-base font-medium leading-8 text-blue-100 sm:text-lg">
              Research, development, and scholarly output from this specialized
              PRISM Lab domain.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur">
                <BookOpen className="h-4 w-4 text-cyan-300" />
                {publicationCount} related publication
                {publicationCount === 1 ? '' : 's'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur">
                <Layers3 className="h-4 w-4 text-cyan-300" />
                Research overview
              </span>
            </div>
          </div>

          {area.imageUrl && (
            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan-300/35 to-blue-500/10 blur-xl" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/40 p-2 shadow-2xl backdrop-blur">
                <SafeImage
                  src={area.imageUrl}
                  alt={area.title}
                  className="h-full w-full rounded-[1.55rem] object-cover"
                />
                <div className="absolute inset-x-2 bottom-2 rounded-b-[1.55rem] bg-gradient-to-t from-slate-950/80 to-transparent px-5 pb-5 pt-16">
                  <p className="research-area-hero-copy text-sm font-bold text-white">
                    {area.title}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-16 px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.07)] dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50/40 px-6 py-5 dark:border-slate-800 dark:from-blue-950/30 dark:to-cyan-950/10 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#08265c] text-white shadow-sm dark:bg-blue-600">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="research-area-ui-copy text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                  About this domain
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  Research Overview
                </h2>
              </div>
            </div>
          </div>
          <div
            className="research-area-overview prose max-w-none whitespace-pre-line px-6 py-7 text-sm leading-8 text-slate-600 dark:prose-invert dark:text-slate-300 sm:px-8 sm:py-9 sm:text-base"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(overview) }}
          />
        </section>

        {publicationCount > 0 ? (
          <section className="space-y-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="research-area-centered-copy text-[11px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                Research output
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Related Publications
              </h2>
              <p className="research-area-centered-copy mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Peer-reviewed journals and conference papers connected with this
                research domain.
              </p>
            </div>

            <PublicationSection
              title="Journal Publications"
              eyebrow="Peer-reviewed research"
              items={journals}
              venueHeader="Journal"
            />
            <PublicationSection
              title="Conference Publications"
              eyebrow="Conference proceedings"
              items={conferences}
              venueHeader="Conference / Venue"
            />
          </section>
        ) : (
          <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
              Publications will appear here
            </h2>
            <p className="research-area-centered-copy mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Related journals and conference papers have not been published to
              this domain yet.
            </p>
          </section>
        )}

        <div className="flex justify-center">
          <Link
            href="/research/areas"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#08265c] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore all research areas
          </Link>
        </div>
      </main>
    </div>
  )
}
