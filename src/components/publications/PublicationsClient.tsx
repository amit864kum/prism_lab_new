'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Calendar,
  Database,
  ExternalLink,
  FileText,
  MapPin,
  Mic,
  RotateCcw,
  Search,
} from 'lucide-react'
import {
  getPublicationTypeLabel,
  PUBLICATION_TYPES,
  type PublicationType,
} from '@/lib/publication-types'

interface Member {
  _id: string
  name: string
  slug?: string
  role?: string
}

interface Publication {
  _id: string
  title: string
  slug: string
  type: PublicationType
  authors: Member[]
  externalAuthors?: string[]
  year: number
  venue?: string
  journalName?: string
  doiLink?: string
  description?: string
  datasetLink?: string
  date?: string
  location?: string
  talkType?: string
  displayOrder?: number | null
  abstract?: string
  pdfUrl?: string
  externalUrl?: string
  tags: string[]
}

interface ClientProps {
  initialPublications: Publication[]
}

const TABLE_TYPES: PublicationType[] = ['journal', 'conference']
const CARD_TYPES: PublicationType[] = ['book-chapter', 'patent']

function authorHref(author: Member) {
  return `/members/${author.slug || author._id}`
}

function Authors({ publication }: { publication: Publication }) {
  const hasInternalAuthors = publication.authors.length > 0

  return (
    <>
      {publication.authors.map((author, index) => (
        <span key={author._id || `${author.name}-${index}`}>
          <Link
            href={authorHref(author)}
            className="relative z-10 font-semibold text-slate-700 transition hover:text-blue-600 hover:underline dark:text-slate-300 dark:hover:text-blue-400"
          >
            {author.name}
          </Link>
          {index < publication.authors.length - 1 && ', '}
        </span>
      ))}
      {publication.externalAuthors?.length ? (
        <>
          {hasInternalAuthors && ', '}
          {publication.externalAuthors.join(', ')}
        </>
      ) : null}
    </>
  )
}

function PublicationActions({ publication }: { publication: Publication }) {
  const primaryLink = publication.doiLink || publication.externalUrl || publication.datasetLink

  if (!primaryLink && !publication.pdfUrl) {
    return <span className="text-xs font-semibold text-slate-400">Not available</span>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {primaryLink && (
        <a
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60"
        >
          {publication.doiLink ? 'DOI' : publication.datasetLink ? 'Dataset' : 'Open'}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
      {publication.pdfUrl && (
        <a
          href={publication.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-700 dark:bg-slate-700 dark:hover:bg-blue-600"
        >
          PDF
          <FileText className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}

function ResearchTable({ type, items }: { type: 'journal' | 'conference'; items: Publication[] }) {
  if (items.length === 0) return null

  const title = type === 'journal' ? 'Journal Publications' : 'Conference Publications'
  const eyebrow = type === 'journal' ? 'Peer-reviewed research' : 'Conference proceedings'

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
            {eyebrow}
          </p>
          <h2 className="publication-section-heading mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {title}
          </h2>
        </div>
        <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {items.length} publication{items.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-950 text-left dark:border-slate-700">
                <th className="w-16 px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">No.</th>
                <th className="min-w-[390px] px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Publication</th>
                <th className="min-w-[230px] px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {type === 'journal' ? 'Journal' : 'Conference / Venue'}
                </th>
                <th className="w-24 px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Year</th>
                <th className="w-40 px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((publication, index) => (
                <motion.tr
                  key={publication._id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.16) }}
                  className="publication-public-row align-top transition-colors"
                >
                  <td className="px-5 py-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <h3 className="publication-table-title text-sm font-black leading-6 text-slate-950 dark:text-white">
                      {publication.title}
                    </h3>
                    <p className="publication-table-copy mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Authors: </span>
                      <Authors publication={publication} />
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="publication-table-copy text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
                      {publication.journalName || publication.venue || 'Not specified'}
                    </p>
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
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:border-slate-800 dark:bg-slate-950/60 lg:hidden">
          Scroll horizontally to view the complete table
        </div>
      </div>
    </section>
  )
}

function StandardCards({ title, items }: { title: string; items: Publication[] }) {
  if (items.length === 0) return null

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="publication-section-heading text-2xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
        <span className="text-xs font-black text-slate-400">{items.length}</span>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {items.map((publication, index) => (
          <motion.article
            key={publication._id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="publication-hover-card group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                {title}
              </span>
              <span className="text-xs font-black text-slate-400">{publication.year}</span>
            </div>
            <h3 className="publication-card-heading mt-5 text-lg font-black leading-7 text-slate-950 transition group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
              {publication.title}
            </h3>
            <p className="publication-table-copy mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <span className="font-bold">Authors: </span>
              <Authors publication={publication} />
            </p>
            {(publication.venue || publication.journalName) && (
              <p className="publication-table-copy mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {publication.journalName || publication.venue}
              </p>
            )}
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <PublicationActions publication={publication} />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function DatasetCards({ items }: { items: Publication[] }) {
  if (items.length === 0) return null

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <Database className="h-5 w-5 text-blue-500" />
        <h2 className="publication-section-heading text-2xl font-black tracking-tight text-slate-950 dark:text-white">Datasets</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((publication) => (
          <article key={publication._id} className="publication-hover-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="publication-card-heading text-lg font-black leading-7 text-slate-950 dark:text-white">{publication.title}</h3>
            {publication.description && <p className="publication-table-copy mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{publication.description}</p>}
            <div className="mt-5"><PublicationActions publication={publication} /></div>
          </article>
        ))}
      </div>
    </section>
  )
}

function InvitedTalkCards({ items }: { items: Publication[] }) {
  if (items.length === 0) return null

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <Mic className="h-5 w-5 text-blue-500" />
        <h2 className="publication-section-heading text-2xl font-black tracking-tight text-slate-950 dark:text-white">Invited Talks</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((publication) => (
          <article key={publication._id} className="publication-hover-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">{publication.talkType || 'Invited Talk'}</span>
            <h3 className="publication-card-heading mt-4 text-lg font-black leading-7 text-slate-950 dark:text-white">{publication.title}</h3>
            <div className="mt-5 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {publication.date && <p className="publication-table-copy flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" />{publication.date}</p>}
              {publication.location && <p className="publication-table-copy flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" />{publication.location}</p>}
            </div>
            <div className="mt-5"><PublicationActions publication={publication} /></div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function PublicationsClient({ initialPublications }: ClientProps) {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedYear, setSelectedYear] = useState<string>('All')

  const uniqueYears = useMemo(
    () => Array.from(new Set(initialPublications.map((publication) => publication.year).filter(Boolean))).sort((a, b) => b - a),
    [initialPublications]
  )

  const filteredPublications = useMemo(() => {
    const query = search.trim().toLowerCase()
    return initialPublications
      .filter((publication) => {
        const searchable = `${publication.title} ${publication.venue || ''} ${publication.journalName || ''} ${publication.description || ''} ${publication.authors.map((author) => author.name).join(' ')} ${(publication.externalAuthors || []).join(' ')} ${publication.tags.join(' ')}`.toLowerCase()
        return (!query || searchable.includes(query)) && (selectedType === 'All' || publication.type === selectedType) && (selectedYear === 'All' || String(publication.year) === selectedYear)
      })
      .sort((left, right) => (left.displayOrder || 9999) - (right.displayOrder || 9999) || right.year - left.year)
  }, [initialPublications, search, selectedType, selectedYear])

  const groups = useMemo(
    () => PUBLICATION_TYPES.reduce((result, type) => ({ ...result, [type]: filteredPublications.filter((publication) => publication.type === type) }), {} as Record<PublicationType, Publication[]>),
    [filteredPublications]
  )

  const resetFilters = () => {
    setSearch('')
    setSelectedType('All')
    setSelectedYear('All')
  }

  return (
    <div className="space-y-14">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(10rem,0.8fr)_minmax(9rem,0.65fr)_auto] md:items-end">
          <label className="min-w-0">
            <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Search</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input type="search" placeholder="Search title, author, venue..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </span>
          </label>
          <label className="min-w-0">
            <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Category</span>
            <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="All">All Categories</option>
              {PUBLICATION_TYPES.map((type) => <option key={type} value={type}>{getPublicationTypeLabel(type)}</option>)}
            </select>
          </label>
          <label className="min-w-0">
            <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Year</span>
            <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="All">All Years</option>
              {uniqueYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
          <button type="button" onClick={resetFilters} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"><RotateCcw className="h-3.5 w-3.5" />Reset</button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        <p className="publication-result-copy text-sm font-semibold text-slate-500 dark:text-slate-400">Showing <strong className="text-slate-950 dark:text-white">{filteredPublications.length}</strong> of {initialPublications.length} publications</p>
      </div>

      {filteredPublications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center dark:border-slate-700 dark:bg-slate-900"><BookOpen className="mx-auto h-9 w-9 text-slate-400" /><h2 className="publication-section-heading mt-4 text-xl font-black text-slate-900 dark:text-white">No publications found</h2><p className="publication-result-copy mt-2 text-sm text-slate-500">Try changing your search or filters.</p><button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-700">Clear filters</button></div>
      ) : (
        <div className="space-y-16">
          {TABLE_TYPES.map((type) => <ResearchTable key={type} type={type as 'journal' | 'conference'} items={groups[type]} />)}
          {CARD_TYPES.map((type) => <StandardCards key={type} title={getPublicationTypeLabel(type)} items={groups[type]} />)}
          <DatasetCards items={groups.dataset} />
          <InvitedTalkCards items={groups['invited-talk']} />
        </div>
      )}
    </div>
  )
}
