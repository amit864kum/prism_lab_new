import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, BookOpen, Calendar, ExternalLink, FileText, Globe, GraduationCap, Mail, User, Github, } from 'lucide-react'
import { getPublicMember, getPublicMemberProfile } from '@/services/public-content.service'
import SafeImage from '@/components/ui/SafeImage'
import { getPublicationTypeLabel } from '@/lib/publication-types'
import { MEMBER_ROLE_LABELS, type MemberRole } from '@/lib/member-options'
import DOMPurify from 'isomorphic-dompurify'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const member = await getPublicMember(slug)
  if (!member) return { title: 'Member Not Found - Prism Lab' }
  return {
    title: `${member.name} | ${member.role} | Prism Lab, IIT Patna`,
    description: member.bio
      ? member.bio.replace(/<[^>]*>/g, ' ').substring(0, 160)
      : `Profile of lab member ${member.name} at Prism Lab, IIT Patna`,
  }
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { slug } = await params
  const { member, publications } = await getPublicMemberProfile(slug, {
    select: 'title slug type authors externalAuthors year venue journalName doiLink pdfUrl externalUrl displayOrder createdAt',
  })
  if (!member) notFound()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link href="/members" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Lab Members
          </Link>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">{member.name}</h1>
            <p className="text-sm sm:text-base text-slate-300 font-semibold tracking-wide">
              {MEMBER_ROLE_LABELS[member.role as MemberRole] || member.role}
              {member.yearJoined ? ` • Joined ${member.yearJoined}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/2" />
              <div className="relative h-56 w-56 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center mb-6">
                {member.imageUrl ? (
                  <SafeImage
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    fallback={<User className="h-20 w-20 text-slate-400" />}
                  />
                ) : (
                  <User className="h-20 w-20 text-slate-400" />
                )}
              </div>

              <h2 className="relative font-extrabold text-slate-955 dark:text-white text-xl tracking-tight leading-snug">{member.name}</h2>
              <p className="relative text-xs font-semibold text-blue-600 dark:text-blue-450 tracking-wider uppercase mt-1">
                {MEMBER_ROLE_LABELS[member.role as MemberRole] || member.role}
              </p>

              <div className="relative w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition min-w-0">
                    <Mail className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                    <span className="break-all min-w-0">{member.email}</span>
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition">
                    <ExternalLink className="h-4.5 w-4.5 text-slate-400" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {member.googleScholarUrl && (
                  <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition">
                    <GraduationCap className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                    <span>Google Scholar Profile</span>
                  </a>
                )}
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition"
                  >
                    <Github className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {member.personalPortfolioWebsite && (
                  <a href={member.personalPortfolioWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:text-blue-600 font-bold text-xs rounded-xl transition">
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
                {member.resumePdf && (
                  <a href={member.resumePdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
                    <FileText className="h-4 w-4" />
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-8">
            <section className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Biography
              </h3>
              {member.bio ? (
                <div
                  className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-450 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(member.bio) }}
                />
              ) : (
                <p className="text-slate-455 dark:text-slate-500 italic text-sm">Biography not updated yet.</p>
              )}
            </section>

            <section className="space-y-6">
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
                    <article key={pub._id.toString()} className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-4">
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
                        <h4 className="font-extrabold text-slate-950 dark:text-white text-base leading-snug">{pub.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {pub.authors.map(
                            (author: any, index: number) => (
                              <span key={author._id.toString()}>
                                {author.slug ? (
                                  <Link
                                    href={`/people/current-members/${author.slug}`}
                                    className="hover:text-blue-600 hover:underline"
                                  >
                                    {author.name}
                                  </Link>
                                ) : (
                                  author.name
                                )}

                                {(index <
                                  pub.authors.length - 1 ||
                                  pub.externalAuthors?.length > 0) &&
                                  ', '}
                              </span>
                            )
                          )}

                          {(pub.externalAuthors || []).map(
                            (
                              author: string,
                              index: number
                            ) => (
                              <span key={index}>
                                {author}
                                {index <
                                  pub.externalAuthors.length - 1
                                  ? ', '
                                  : ''}
                              </span>
                            )
                          )}
                        </p>
                      </div>
                      {(pub.journalName || pub.venue) && (
                        <p className="text-xs italic text-slate-500 dark:text-slate-450">{pub.journalName || pub.venue}</p>
                      )}
                      {(pub.doiLink || pub.pdfUrl || pub.externalUrl) && (
                        <div className="flex flex-wrap gap-4 pt-1">
                          {pub.doiLink && <a href={pub.doiLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">DOI <ExternalLink className="h-4 w-4" /></a>}
                          {pub.pdfUrl && <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">PDF <FileText className="h-4 w-4" /></a>}
                          {pub.externalUrl && <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">External Link <ExternalLink className="h-4 w-4" /></a>}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
