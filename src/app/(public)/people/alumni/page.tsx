import { getPublicMembers } from '@/services/public-content.service'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail, GraduationCap, User, Calendar, ExternalLink, Globe, FileText } from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import { MEMBER_ROLE_LABELS, MEMBER_ROLES, type MemberRole } from '@/lib/member-options'

export const metadata: Metadata = {
  title: 'Lab Alumni | Prism Lab, IIT Patna',
  description: 'Celebrating the paths and achievements of graduated scholars from Prism Lab.',
}

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

interface AlumniGroup {
  year: number | string
  members: any[]
}

export default async function AlumniPage() {
  const allAlumni = await getPublicMembers(
    { statuses: ['alumni', 'completed'] },
    { sort: { yearLeft: -1, role: 1, displayOrder: 1, name: 1 } }
  )
  const alumni = allAlumni.filter((member) => member.role !== 'Intern')
  const alumniRoles = MEMBER_ROLES.filter((role) => role !== 'Intern')

  // Group alumni by yearLeft (default to 'Unspecified' if missing)
  const groupedAlumni: Record<string | number, any[]> = {}
  alumni.forEach((m: any) => {
    const year = m.yearLeft || 'Archive'
    if (!groupedAlumni[year]) {
      groupedAlumni[year] = []
    }
    groupedAlumni[year].push(m)
  })

  // Sort groups descending
  const sortedYears = Object.keys(groupedAlumni)
    .map((k) => (isNaN(Number(k)) ? k : Number(k)))
    .sort((a, b) => {
      if (typeof a === 'string') return 1
      if (typeof b === 'string') return -1
      return b - a
    })

  const groups: AlumniGroup[] = sortedYears.map((year) => ({
    year,
    members: groupedAlumni[year],
  }))

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Title Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Lab Alumni
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Celebrating the journeys and destinations of our graduated scholars and students.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {alumni.length === 0 ? (
          <div className="py-24 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl text-center text-slate-500 italic">
            No alumni records posted yet.
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.year} className="space-y-6">
              {/* Year Heading */}
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {typeof group.year === 'number' ? `Class of ${group.year}` : group.year}
                </h2>
              </div>

              {alumniRoles.map((role) => {
                const roleMembers = group.members.filter((member) => member.role === role)
                if (roleMembers.length === 0) return null

                return (
                  <div key={`${group.year}-${role}`} className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {MEMBER_ROLE_LABELS[role as MemberRole]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {roleMembers.map((member) => (
                        <div
                          key={member._id.toString()}
                          className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl p-5 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transition duration-300 group relative overflow-hidden"
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="w-full flex flex-col items-center space-y-4">
                            <div className="h-24 w-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-950 flex items-center justify-center relative">
                              {member.imageUrl ? (
                                <SafeImage
                                  src={member.imageUrl}
                                  alt={member.name}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                  fallback={<User className="h-10 w-10 text-slate-400" />}
                                />
                              ) : (
                                <User className="h-10 w-10 text-slate-400" />
                              )}
                            </div>

                            <div className="space-y-1 w-full">
                              <h3 className="font-extrabold text-slate-950 dark:text-white text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate px-1">
                                {member.name}
                              </h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {MEMBER_ROLE_LABELS[member.role as MemberRole] || member.role}
                              </p>
                              {member.yearJoined && (
                                <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 tracking-tight mt-0.5">
                                  {member.yearJoined} - {member.yearLeft || 'Completed'}
                                </p>
                              )}
                            </div>

                            <dl className="w-full space-y-3 border-t border-slate-100 pt-4 text-left dark:border-slate-800">
                              <div>
                                <dt className="text-[9px] font-black uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                                  Thesis Title
                                </dt>
                                <dd className="mt-1 text-xs font-semibold leading-5 text-slate-700 dark:text-slate-300">
                                  {member.thesisTitle || 'Not provided'}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-[9px] font-black uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                                  Current Position
                                </dt>
                                <dd className="mt-1 text-xs font-semibold leading-5 text-slate-700 dark:text-slate-300">
                                  {member.currentPosition || 'Not provided'}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 z-10">
                            <div className="flex gap-2">
                              {member.email && (
                                <a href={`mailto:${member.email}`} className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition" title="Send Email">
                                  <Mail className="h-3.5 w-3.5" />
                                </a>
                              )}
                              {member.linkedinUrl && (
                                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition" title="LinkedIn Profile">
                                  <svg className="h-3.5 w-3.5 fill-current text-slate-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                  </svg>
                                </a>
                              )}
                              {member.googleScholarUrl && (
                                <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition" title="Google Scholar Profile">
                                  <GraduationCap className="h-3.5 w-3.5" />
                                </a>
                              )}
                              {member.personalPortfolioWebsite && (
                                <a href={member.personalPortfolioWebsite} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition" title="Portfolio">
                                  <Globe className="h-3.5 w-3.5" />
                                </a>
                              )}
                              {member.resumePdf && (
                                <a href={member.resumePdf} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition" title="Resume PDF">
                                  <FileText className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>

                            <Link href={`/members/${member.slug || member._id.toString()}`} className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline">
                              View Profile
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
