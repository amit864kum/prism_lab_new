'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Database, ExternalLink, FileText, MapPin, Mic, Search } from 'lucide-react'
import { getPublicationTypeLabel, PUBLICATION_TYPES, type PublicationType } from '@/lib/publication-types'

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

const tableTypes: PublicationType[] = ['journal', 'conference', 'book-chapter', 'patent']
const cardTypes: PublicationType[] = ['dataset', 'invited-talk']

function authorHref(author: Member) {
  return `/people/current-members/${author.slug || author._id}`
}

function Authors({ authors }: { authors: Member[] }) {
  return (
    <>
      {authors.map((author, index) => (
        <span key={author._id || `${author.name}-${index}`}>
          <Link
            href={authorHref(author)}
            className="font-semibold text-slate-700 hover:text-blue-600 hover:underline dark:text-slate-300 dark:hover:text-blue-400"
          >
            {author.name}
          </Link>
          {index < authors.length - 1 && ', '}
        </span>
      ))}
    </>
  )
}

function LinkLine({ href, label }: { href?: string; label?: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 inline-flex items-center gap-1 break-all text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
    >
      {label || href}
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  )
}

function PublicationsTable({ title, items }: { title: string; items: Publication[] }) {
  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {items.length} item{items.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-[860px] w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-slate-850 dark:text-slate-400">
            <tr>
              <th className="w-20 px-4 py-3">S.No.</th>
              <th className="px-4 py-3">Authors</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">{title === 'Journals' ? 'Journal' : 'Venue'}</th>
              <th className="w-24 px-4 py-3">Year</th>
              <th className="w-36 px-4 py-3">PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((pub, index) => (
              <tr key={pub._id} className="align-top transition hover:bg-slate-50/70 dark:hover:bg-slate-950/50">
                <td className="px-4 py-4 font-extrabold text-slate-600 dark:text-slate-400">{index + 1}</td>
                <td className="px-4 py-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  <Authors authors={pub.authors} />

                  {pub.externalAuthors?.length ? (
                    <>
                      {pub.authors.length > 0 && ', '}
                      {pub.externalAuthors.join(', ')}
                    </>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <p className="font-extrabold leading-snug text-slate-950 dark:text-white">{pub.title}</p>
                  <LinkLine href={pub.doiLink} />
                  <LinkLine href={pub.externalUrl} label="External Link" />
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

function DatasetCards({ items }: { items: Publication[] }) {
  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <Database className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Datasets</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((pub, index) => (
          <motion.article
            key={pub._id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-extrabold leading-snug text-slate-950 dark:text-white">{pub.title}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">{pub.year}</span>
            </div>
            {pub.description && (
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">{pub.description}</p>
            )}
            <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Authors:
              </span>

              <Authors authors={pub.authors} />

              {pub.externalAuthors?.length ? (
                <>
                  {pub.authors.length > 0 && ', '}
                  {pub.externalAuthors.join(', ')}
                </>
              ) : null}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-extrabold">
              <LinkLine href={pub.datasetLink} label="Dataset Link" />
              <LinkLine href={pub.doiLink} label="DOI" />
              {pub.pdfUrl && (
                <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                  Download PDF
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function InvitedTalkCards({ items }: { items: Publication[] }) {
  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <Mic className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Invited Talks</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((pub, index) => (
          <motion.article
            key={pub._id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              {pub.talkType || 'Invited Talk'}
            </span>
            <h3 className="mt-3 text-base font-extrabold leading-snug text-slate-950 dark:text-white">{pub.title}</h3>
            <div className="mt-4 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {pub.date && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {pub.date}
                </p>
              )}
              {pub.location && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {pub.location}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default function PublicationsClient({ initialPublications }: ClientProps) {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedYear, setSelectedYear] = useState<string>('All')

  const uniqueYears = useMemo(() => {
    const years = initialPublications.map((publication) => publication.year).filter(Boolean)
    return Array.from(new Set(years)).sort((a, b) => b - a)
  }, [initialPublications])

  const filteredPublications = useMemo(() => {
    const query = search.trim().toLowerCase()
    return initialPublications
      .filter((pub) => {
        const matchesSearch =
          !query ||
          `${pub.title}
  ${pub.venue || ''}
  ${pub.journalName || ''}
  ${pub.description || ''}
  ${pub.authors
              .map((author) => author.name)
              .join(' ')}

  ${(pub.externalAuthors || []).join(' ')}

  ${pub.tags.join(' ')}`
            .toLowerCase()
            .includes(query)

        const matchesType = selectedType === 'All' || pub.type === selectedType
        const matchesYear = selectedYear === 'All' || String(pub.year) === selectedYear
        return matchesSearch && matchesType && matchesYear
      })
      .sort((a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999) || b.year - a.year)
  }, [initialPublications, search, selectedType, selectedYear])

  const groups = useMemo(() => {
    return PUBLICATION_TYPES.reduce((acc, type) => {
      acc[type] = filteredPublications.filter((publication) => publication.type === type)
      return acc
    }, {} as Record<PublicationType, Publication[]>)
  }, [filteredPublications])

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <label className="mb-1.5 block px-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Search
          </label>
          <Search className="absolute left-3 top-8 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, author, venue..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
          />
        </div>
        <label className="block">
          <span className="mb-1.5 block px-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Category
          </span>
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
          >
            <option value="All">All Categories</option>
            {PUBLICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {getPublicationTypeLabel(type)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block px-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Year
          </span>
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
          >
            <option value="All">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredPublications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/55 bg-white py-24 text-center text-slate-500 shadow-sm dark:border-slate-800/55 dark:bg-slate-900">
          No publications matched your filters.
        </div>
      ) : (
        <div className="space-y-14">
          {tableTypes.map((type) => (
            <PublicationsTable key={type} title={getPublicationTypeLabel(type)} items={groups[type]} />
          ))}
          <DatasetCards items={groups.dataset} />
          <InvitedTalkCards items={groups['invited-talk']} />
        </div>
      )}
    </div>
  )
}
