'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  BookOpen,
  Calendar,
  FileText,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  Code
} from 'lucide-react'

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
  type: string
  authors: Member[]
  year: number
  venue?: string
  abstract?: string
  pdfUrl?: string
  externalUrl?: string
  tags: string[]
}

interface ClientProps {
  initialPublications: Publication[]
}

const PUB_TYPES = [
  'All',
  'Journal Article',
  'Conference Paper',
  'Workshop Paper',
  'Technical Report',
  'Book Chapter',
  'Thesis',
] as const

export default function PublicationsClient({ initialPublications }: ClientProps) {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null)
  const [copiedPubId, setCopiedPubId] = useState<string | null>(null)
  const [bibtexPubId, setBibtexPubId] = useState<string | null>(null)

  // Extract unique years from publications dataset
  const uniqueYears = useMemo(() => {
    const years = initialPublications.map((p) => p.year)
    return Array.from(new Set(years)).sort((a, b) => b - a)
  }, [initialPublications])

  // Filter list of publications
  const filteredPublications = useMemo(() => {
    return initialPublications.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        (pub.venue && pub.venue.toLowerCase().includes(search.toLowerCase())) ||
        pub.authors.some((author) => author.name.toLowerCase().includes(search.toLowerCase())) ||
        pub.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))

      const matchesType = selectedType === 'All' ? true : pub.type === selectedType
      const matchesYear = selectedYear === 'All' ? true : pub.year.toString() === selectedYear

      return matchesSearch && matchesType && matchesYear
    })
  }, [initialPublications, search, selectedType, selectedYear])

  // Group filtered publications by year descending
  const groupedPublications = useMemo(() => {
    const groups: Record<number, Publication[]> = {}
    filteredPublications.forEach((pub) => {
      if (!groups[pub.year]) {
        groups[pub.year] = []
      }
      groups[pub.year].push(pub)
    })
    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a)
      .map((year) => ({
        year,
        items: groups[year],
      }))
  }, [filteredPublications])

  const generateBibTeX = (pub: Publication) => {
    const authorNames = pub.authors.map((a) => a.name).join(' and ')
    const firstAuthor = pub.authors[0]?.name.split(' ').pop()?.toLowerCase() || 'author'
    const cleanSlug = pub.slug.replace(/[^a-z0-9]/g, '').substring(0, 8)
    const key = `${firstAuthor}${pub.year}${cleanSlug}`
    const cleanTitle = pub.title.replace(/[{}"]/g, '')
    
    if (pub.type === 'Journal Article') {
      return `@article{${key},
  author = {${authorNames}},
  title = {${cleanTitle}},
  journal = {${pub.venue || 'Unknown Journal'}},
  year = {${pub.year}}
}`
    } else {
      return `@inproceedings{${key},
  author = {${authorNames}},
  title = {${cleanTitle}},
  booktitle = {${pub.venue || 'Unknown Venue'}},
  year = {${pub.year}}
}`
    }
  }

  const handleCopyBibTeX = (pub: Publication) => {
    const bibtex = generateBibTeX(pub)
    navigator.clipboard.writeText(bibtex)
    setCopiedPubId(pub._id)
    setTimeout(() => setCopiedPubId(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Filtering Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">
            Search Text
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, author, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold shadow-sm transition"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Filter Type */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">
            Publication Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold shadow-sm transition appearance-none cursor-pointer"
          >
            {PUB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Year */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-0.5">
            Publication Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold shadow-sm transition appearance-none cursor-pointer"
          >
            <option value="All">All Years</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Publications List */}
      {filteredPublications.length === 0 ? (
        <div className="py-24 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl text-center text-slate-500 italic shadow-sm">
          No publications matched your search criteria.
        </div>
      ) : (
        <div className="space-y-12">
          {groupedPublications.map((group) => (
            <div key={group.year} className="space-y-6">
              {/* Year Label */}
              <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-850 pb-3.5">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {group.year}
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400">
                  {group.items.length} {group.items.length === 1 ? 'pub' : 'pubs'}
                </span>
              </div>

              {/* Items in Year Group */}
              <div className="space-y-6">
                {group.items.map((pub) => (
                  <div
                    key={pub._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 space-y-4 relative group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                        {pub.type}
                      </span>
                      {pub.tags && pub.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {pub.tags.slice(0, 3).map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="text-[9px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-0.5"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-950 dark:text-white text-base sm:text-lg leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {pub.title}
                      </h3>
                      
                      {/* Authors */}
                      <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 font-medium">
                        {pub.authors.map((author, aIdx) => {
                          const isLast = aIdx === pub.authors.length - 1
                          const isPI = author.role === 'Principal Investigator' || author.name.toLowerCase().includes('amit')
                          return (
                            <span key={author._id || aIdx}>
                              {author.slug ? (
                                <Link
                                  href={`/people/current-members/${author._id}`}
                                  className={`hover:underline transition ${
                                    isPI ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {author.name}
                                </Link>
                              ) : (
                                <span className={isPI ? 'font-bold text-slate-900 dark:text-white' : ''}>
                                  {author.name}
                                </span>
                              )}
                              {!isLast && ', '}
                            </span>
                          )
                        })}
                      </p>
                    </div>

                    {pub.venue && (
                      <p className="text-xs italic text-slate-500 dark:text-slate-405 font-medium">
                        {pub.venue}
                      </p>
                    )}

                    {/* Expandable Abstract Section */}
                    {pub.abstract && (
                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            setExpandedAbstractId(
                              expandedAbstractId === pub._id ? null : pub._id
                            )
                          }
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-450 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          {expandedAbstractId === pub._id ? (
                            <>
                              Hide Abstract
                              <ChevronUp className="h-3.5 w-3.5" />
                            </>
                          ) : (
                            <>
                              Show Abstract
                              <ChevronDown className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                        <AnimatePresence initial={false}>
                          {expandedAbstractId === pub._id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/50 dark:border-slate-805 rounded-xl leading-relaxed whitespace-pre-wrap">
                                {pub.abstract}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-850">
                      {/* Action Links */}
                      <div className="flex gap-4">
                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FileText className="h-4.5 w-4.5" />
                            PDF
                          </a>
                        )}
                        {pub.externalUrl && (
                          <a
                            href={pub.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="h-4.5 w-4.5" />
                            Publisher Site
                          </a>
                        )}
                      </div>

                      {/* BibTeX toggle or copy */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setBibtexPubId(bibtexPubId === pub._id ? null : pub._id)
                          }
                          className="inline-flex items-center gap-1 px-3 py-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-[10px] rounded-lg transition"
                        >
                          <Code className="h-3.5 w-3.5" />
                          View Citation
                        </button>
                        <button
                          onClick={() => handleCopyBibTeX(pub)}
                          className="inline-flex items-center gap-1 px-3 py-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-[10px] rounded-lg transition"
                        >
                          {copiedPubId === pub._id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy BibTeX
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* BibTeX Panel */}
                    <AnimatePresence>
                      {bibtexPubId === pub._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-950 dark:bg-black text-slate-300 p-4 border border-slate-800 rounded-xl mt-2 font-mono text-[10px] sm:text-xs relative whitespace-pre"
                        >
                          <button
                            onClick={() => handleCopyBibTeX(pub)}
                            className="absolute right-3 top-3 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                            title="Copy to clipboard"
                          >
                            {copiedPubId === pub._id ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          {generateBibTeX(pub)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
