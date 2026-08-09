import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublicMember, getPublicMemberProfile } from '@/services/public-content.service'
import { getPublicationTypeLabel } from '@/lib/publication-types'
import { ArrowLeft, Mail, GraduationCap, Calendar, BookOpen, User, FileText, ExternalLink, Globe } from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import DOMPurify from 'isomorphic-dompurify'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const member = await getPublicMember(id)
  if (!member) return { title: 'Member Not Found - Prism Lab' }
  return {
    title: `${member.name} | ${member.role} | Prism Lab, IIT Patna`,
    description: member.bio ? member.bio.substring(0, 160) : `Profile of lab member ${member.name} at Prism Lab, IIT Patna`,
  }
}

export default async function MemberDetailsPage({ params }: PageProps) {
  const { id } = await params

  const { member, publications } = await getPublicMemberProfile(id, {
    sort: { year: -1, createdAt: -1 },
  })

if (!member) {
  notFound()
}

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/people/current-members"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Research Team
          </Link>
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
              {member.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-semibold tracking-wide">
              {member.role} &bull; Joined {member.yearJoined}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/2 opacity-100 transition duration-300" />
              
              <div className="h-56 w-56 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative mb-6">
                {member.imageUrl ? (
                  <SafeImage
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-103"
                    fallback={<User className="h-20 w-20 text-slate-400" />}
                  />
                ) : (
                  <User className="h-20 w-20 text-slate-400" />
                )}
              </div>

              <h2 className="font-extrabold text-slate-955 dark:text-white text-xl tracking-tight leading-snug">
                {member.name}
              </h2>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-450 tracking-wider uppercase mt-1">
                {member.role}
              </p>

              {/* Contact list */}
              <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition min-w-0"
                  >
                    <Mail className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                    <span className="break-all min-w-0">{member.email}</span>
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition"
                  >
                    <svg
                      className="h-4.5 w-4.5 fill-current text-slate-450 dark:text-slate-400 flex-shrink-0"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {member.googleScholarUrl && (
                  <a
                    href={member.googleScholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition"
                  >
                    <GraduationCap className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                    <span>Google Scholar Profile</span>
                  </a>
                )}
                {member.personalPortfolioWebsite && (
                  <a
                    href={member.personalPortfolioWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition"
                  >
                    <Globe className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                    <span>Visit Website</span>
                  </a>
                )}
                {member.resumePdf && (
                  <a
                    href={member.resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition mt-2"
                  >
                    <FileText className="h-4 w-4" />
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Profile Biography & Publications */}
          <div className="lg:col-span-8 space-y-8">
            {/* Biography */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Biography
              </h3>
              {member.bio ? (
                <div
                  className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-450 leading-relaxed text-sm sm:text-base space-y-4"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(member.bio) }}
                />
              ) : (
                <p className="text-slate-455 dark:text-slate-500 italic text-sm">
                  Biography not updated yet.
                </p>
              )}
            </div>

            {/* Linked Publications */}
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold text-slate-955 dark:text-white flex items-center gap-2 px-1">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Publications & Works ({publications.length})
              </h3>

              {publications.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-8 text-center text-slate-500 italic shadow-sm">
                  No publication records listed under this member&apos;s profile.
                </div>
              ) : (
                <div className="space-y-4">
                  {publications.map((pub: any) => (
                    <div
                      key={pub._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                          {getPublicationTypeLabel(pub.type)}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {pub.year}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-950 dark:text-white text-base leading-snug">
                          {pub.title}
                        </h4>
                        
                        {/* Authors List */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {pub.authors.map((author: any, aIdx: number) => {
                            const isCurrent = author._id.toString() === member._id.toString()
                            const hasNext = aIdx < pub.authors.length - 1 || (pub.externalAuthors && pub.externalAuthors.length > 0)
                            return (
                              <span key={author._id || aIdx}>
                                {isCurrent ? (
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {author.name}
                                  </span>
                                ) : author.slug ? (
                                  <Link
                                    href={`/people/current-members/${author.slug}`}
                                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-slate-700 dark:text-slate-300"
                                  >
                                    {author.name}
                                  </Link>
                                ) : (
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {author.name}
                                  </span>
                                )}
                                {hasNext && ', '}
                              </span>
                            )
                          })}

                          {pub.externalAuthors?.map((extAuthor: string, extIdx: number) => {
                            const hasNext = extIdx < pub.externalAuthors.length - 1
                            return (
                              <span key={`ext-${extIdx}`}>
                                <span className="text-slate-700 dark:text-slate-300">
                                  {extAuthor}
                                </span>
                                {hasNext && ', '}
                              </span>
                            )
                          })}
                        </p>
                      </div>

                      {pub.venue && (
                        <p className="text-xs italic text-slate-500 dark:text-slate-450">
                          {pub.venue}
                        </p>
                      )}

                      {(pub.pdfUrl || pub.externalUrl) && (
                        <div className="flex gap-4 pt-1">
                          {pub.pdfUrl && (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-705 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <FileText className="h-4 w-4" />
                              PDF
                            </a>
                          )}
                          {pub.externalUrl && (
                            <a
                              href={pub.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-705 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <ExternalLink className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  )
}
