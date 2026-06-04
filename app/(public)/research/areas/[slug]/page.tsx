import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import ResearchArea from '@/models/ResearchArea'
import Publication from '@/models/Publication'
import Member from '@/models/Member'
import { ArrowLeft, BookOpen, ExternalLink, FileText, Tag, Calendar, User } from 'lucide-react'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB()
  const area = await ResearchArea.findOne({ slug: params.slug }).lean()
  if (!area) return { title: 'Research Area Not Found - Prism Lab' }
  return {
    title: `${area.title} | Research Area | Prism Lab, IIT Patna`,
    description: area.description.replace(/<[^>]*>/g, '').substring(0, 160),
  }
}

export default async function ResearchAreaDetailsPage({ params }: PageProps) {
  const { slug } = params

  await connectDB()

  // Fetch the research area
  const area = await ResearchArea.findOne({ slug }).lean()

  if (!area) {
    notFound()
  }

  // Fetch related publications by matching tags with area slug or title (case insensitive)
  const escapedTitle = area.title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const escapedSlug = area.slug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const searchRegexes = [
    new RegExp(escapedSlug, 'i'),
    new RegExp(escapedTitle, 'i'),
  ]

  // Populate authors so we can render their names
  const relatedPublications = await Publication.find({
    tags: { $in: searchRegexes },
  })
    .sort({ year: -1, createdAt: -1 })
    .populate({
      path: 'authors',
      model: Member,
      select: 'name slug role',
    })
    .lean()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Banner / Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Decorative background grid/gradients */}
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
              Prism Research Laboratory Specialize Domain
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Description Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Domain Overview
              </h2>
              <div 
                className="prose dark:prose-invert max-w-none text-slate-650 dark:text-slate-350 leading-relaxed text-sm sm:text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: area.description }}
              />
            </div>

            {/* Related Publications */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 px-1">
                <FileText className="h-5 w-5 text-blue-500" />
                Related Publications ({relatedPublications.length})
              </h2>

              {relatedPublications.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-8 text-center text-slate-500 italic">
                  No publications associated with this research domain yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {relatedPublications.map((pub: any) => (
                    <div
                      key={pub._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200 space-y-4"
                    >
                      <div className="space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                          {pub.type}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug">
                          {pub.title}
                        </h3>
                      </div>

                      {/* Authors */}
                      <p className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm font-medium">
                        {pub.authors.map((author: any, idx: number) => {
                          const isLast = idx === pub.authors.length - 1
                          const isPI = author.role === 'Principal Investigator' || author.name.includes('Amit')
                          return (
                            <span key={author._id || idx}>
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

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {pub.venue && (
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-slate-400" />
                            {pub.venue}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {pub.year}
                        </span>
                      </div>

                      {/* PDF & URL Links */}
                      {(pub.pdfUrl || pub.externalUrl) && (
                        <div className="flex gap-4 pt-2">
                          {pub.pdfUrl && (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <ExternalLink className="h-4.5 w-4.5" />
                              Publisher Site
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area Details Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Domain Meta Information
              </h3>
              <div className="space-y-4 text-xs font-medium text-slate-650 dark:text-slate-405">
                {area.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950/40 aspect-video relative flex items-center justify-center">
                    <img
                      src={area.imageUrl}
                      alt={area.title}
                      className="w-full h-full object-cover animate-fade-in"
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
                      {new Date(area.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
