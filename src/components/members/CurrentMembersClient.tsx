'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, ExternalLink, Search, User, Users } from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import type { MemberRole } from '@/lib/member-options'
import type { MemberListViewModel } from './member-list.view-model'

type Member = MemberListViewModel

interface ClientProps {
  initialMembers: Member[]
}

const DISPLAY_ROLES: Array<{ role: MemberRole; title: string }> = [
  { role: 'PhD Scholar', title: 'PhD Students' },
  { role: 'Masters Student', title: 'M.Tech Students' },
  { role: 'Undergraduate', title: 'B.Tech Students' },
  { role: 'Research Assistant', title: 'Research Assistants' },
]

function MemberImage({ member, className }: { member: Member; className: string }) {
  if (!member.imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-950 ${className}`}>
        <User className="h-16 w-16 text-slate-400" />
      </div>
    )
  }

  return (
    <SafeImage
      src={member.imageUrl}
      alt={member.name}
      className={`${className} object-cover object-top transition duration-500 group-hover:scale-[1.035]`}
      fallback={
        <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-950 ${className}`}>
          <User className="h-16 w-16 text-slate-400" />
        </div>
      }
    />
  )
}

function CurrentMemberCard({ member, index }: { member: Member; index: number }) {
  const profileHref = `/members/${member.slug || member._id}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white p-3 shadow-[0_15px_40px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_26px_65px_rgba(37,99,235,0.15)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
    >
      <Link
        href={profileHref}
        aria-label={`Open ${member.name}'s profile`}
        className="absolute inset-0 z-10 rounded-[1.75rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
      >
        <span className="sr-only">Open {member.name}&apos;s profile</span>
      </Link>

      <div className="h-72 overflow-hidden rounded-[1.3rem] border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 sm:h-80">
        <MemberImage member={member} className="h-full w-full" />
      </div>

      <div className="px-3 pb-3 pt-5 text-center">
        <h3 className="member-card-name text-xl font-black tracking-tight text-slate-950 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
          {member.name}
        </h3>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-blue-700 dark:text-blue-300">
          View Profile
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.article>
  )
}

function AlumniCard({ member, index }: { member: Member; index: number }) {
  const profileHref = `/members/${member.slug || member._id}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
      className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_25px_60px_rgba(79,70,229,0.13)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="grid min-h-full sm:grid-cols-[11rem_1fr]">
        <div className="h-64 overflow-hidden bg-slate-100 dark:bg-slate-950 sm:h-full sm:min-h-64">
          <MemberImage member={member} className="h-full w-full" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-7">
          <h3 className="member-alumni-name text-xl font-black tracking-tight text-slate-950 dark:text-white">
            {member.name}
          </h3>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Thesis Title
              </dt>
              <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
                {member.thesisTitle || 'Not provided'}
              </dd>
            </div>
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Current Position
              </dt>
              <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">
                {member.currentPosition || 'Not provided'}
              </dd>
            </div>
          </dl>
          <Link
            href={profileHref}
            className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:hover:text-slate-950 dark:focus-visible:ring-offset-slate-900"
          >
            View Profile
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="w-full text-center">
      <h2 className="member-page-section-title w-full text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
    </div>
  )
}

function RoleHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h3>
      <span className="mt-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
        {count} member{count === 1 ? '' : 's'}
      </span>
    </div>
  )
}

export default function CurrentMembersClient({ initialMembers }: ClientProps) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()

  const visibleMembers = useMemo(
    () =>
      initialMembers.filter(
        (member) =>
          member.role !== 'Intern' &&
          (!query ||
            `${member.name} ${member.role} ${member.thesisTitle} ${member.currentPosition}`
              .toLowerCase()
              .includes(query))
      ),
    [initialMembers, query]
  )

  const currentMembers = visibleMembers.filter((member) => member.status === 'current')
  const alumniMembers = visibleMembers.filter(
    (member) => member.status === 'alumni' || member.status === 'completed'
  )

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.09)] dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:p-9">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.07),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_42%)]" />
        <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="text-lg font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300 sm:text-xl">
            Guide / Supervisor
          </h2>
          <div className="mt-6 h-56 w-56 overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.18)] ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:ring-slate-700 sm:h-64 sm:w-64">
            <SafeImage
              src="/uploads/pi/1780654541451-x1uxeg.jpg"
              alt="Dr. Satendra Kumar"
              className="h-full w-full object-cover object-top transition duration-500 hover:scale-105"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-slate-800">
                  <User className="h-20 w-20 text-slate-500" />
                </div>
              }
            />
          </div>
          <h3 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">Dr. Satendra Kumar</h3>
          <a
            href="https://www.iitp.ac.in/~satendra/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400 dark:hover:text-slate-950 dark:focus-visible:ring-offset-slate-900"
          >
            Visit faculty profile
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
            Assistant Professor, Department of Computer Science and Engineering, IIT Patna.
          </p>
        </div>
      </section>

      <section className="space-y-12">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Users className="ml-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <label className="relative flex-1">
            <span className="sr-only">Search members</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search current members or alumni..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <SectionTitle title="Current Member" />

        <div className="space-y-16">
          {DISPLAY_ROLES.map(({ role, title }) => {
            const members = currentMembers.filter((member) => member.role === role)
            if (members.length === 0) return null
            return (
              <div key={role} className="space-y-7">
                <RoleHeading title={title} count={members.length} />
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {members.map((member, index) => (
                    <CurrentMemberCard key={member._id} member={member} index={index} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {alumniMembers.length > 0 && (
        <section className="space-y-12 rounded-[2.25rem] border border-slate-200 bg-gradient-to-b from-white to-indigo-50/40 px-5 py-12 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-indigo-950/20 sm:px-8">
          <SectionTitle title="Alumni" />
          <div className="space-y-16">
            {DISPLAY_ROLES.map(({ role, title }) => {
              const members = alumniMembers.filter((member) => member.role === role)
              if (members.length === 0) return null
              return (
                <div key={role} className="space-y-7">
                  <RoleHeading title={title} count={members.length} />
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {members.map((member, index) => (
                      <AlumniCard key={member._id} member={member} index={index} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {currentMembers.length === 0 && alumniMembers.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
          <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            No members match your search.
          </p>
        </div>
      )}
    </div>
  )
}
