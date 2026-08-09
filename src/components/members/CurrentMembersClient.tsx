'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, GraduationCap, User, ArrowUpRight, Globe } from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import { MEMBER_ROLES, MEMBER_ROLE_LABELS, type MemberRole } from '@/lib/member-options'
import type { MemberListViewModel } from './member-list.view-model'

type Member = MemberListViewModel

interface ClientProps {
  initialMembers: MemberListViewModel[]
}

type TabType = 'All' | MemberRole

/* ─── Role ordering & display ─── */

const ROLE_ORDER: MemberRole[] = [
  'PhD Scholar',
  'Masters Student',
  'Undergraduate',
  'Research Assistant',
  'Intern',
]

const ROLE_SECTION_LABELS: Record<MemberRole, string> = {
  'PhD Scholar': 'PhD Scholars',
  'Masters Student': 'M.Tech Students',
  Undergraduate: 'B.Tech Students',
  'Research Assistant': 'Research Assistants',
  Intern: 'Interns',
}

const ROLE_NEEDS_YEAR: MemberRole[] = [
  'Masters Student',
  'Undergraduate',
  'Intern',
]

/* ─── Section sub-component (avoids hooks inside loops) ─── */

interface RoleSectionProps {
  role: MemberRole
  ongoingMembers: Member[]
  completedMembers: Member[]
  renderCards: (members: Member[]) => React.ReactNode
}

function RoleSection({ role, ongoingMembers, completedMembers, renderCards }: RoleSectionProps) {
  const [view, setView] = useState<'ongoing' | 'completed'>('ongoing')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const hasOngoing = ongoingMembers.length > 0
  const hasCompleted = completedMembers.length > 0
  const needsYear = ROLE_NEEDS_YEAR.includes(role)

  const activeMembers = view === 'ongoing' ? ongoingMembers : completedMembers

  // Available years for year-filtered roles, sorted descending
  const availableYears = useMemo(() => {
    if (!needsYear) return []
    const yearSet = new Set<number>()
    for (const m of activeMembers) {
      if (m.yearJoined != null) yearSet.add(m.yearJoined)
    }
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [needsYear, activeMembers])

  // Auto-select latest year when view toggles or when available years change
  useEffect(() => {
    if (!needsYear) return
    if (availableYears.length === 0) {
      setSelectedYear(null)
      return
    }
    if (selectedYear === null || !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0])
    }
  }, [needsYear, availableYears, selectedYear])

  // Members to display (filtered by year for year-roles, or all for flat roles)
  const displayMembers = useMemo(() => {
    if (!needsYear || selectedYear === null) return activeMembers
    return activeMembers.filter((m) => m.yearJoined === selectedYear)
  }, [needsYear, selectedYear, activeMembers])

  // Nothing to show
  if (!hasOngoing && !hasCompleted) return null

  return (
    <div className="space-y-5">
      {/* ── Section Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {ROLE_SECTION_LABELS[role]}
          </h2>
          <div className="mt-2 h-1 w-12 rounded-full bg-blue-600" />
        </div>

        {/* Ongoing / Completed Toggle */}
        <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setView('ongoing')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              view === 'ongoing'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Ongoing
          </button>

          {hasCompleted && (
            <button
              onClick={() => setView('completed')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                view === 'completed'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Completed
            </button>
          )}
        </div>
      </div>

      {/* ── Year Buttons (M.Tech / B.Tech / Intern only) ── */}
      {needsYear && availableYears.length > 0 && (
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 -mb-1">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold tabular-nums transition-all duration-200 whitespace-nowrap border ${
                selectedYear === year
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* ── Cards or Empty State ── */}
      {activeMembers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-12 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 italic">
            No {view === 'ongoing' ? 'ongoing' : 'completed'} {MEMBER_ROLE_LABELS[role].toLowerCase()} members found.
          </p>
        </div>
      ) : needsYear && displayMembers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-12 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 italic">
            No {view === 'ongoing' ? 'ongoing' : 'completed'} {MEMBER_ROLE_LABELS[role].toLowerCase()} members found for {selectedYear}.
          </p>
        </div>
      ) : (
        renderCards(displayMembers)
      )}
    </div>
  )
}

/* ─── Main Component ─── */

export default function CurrentMembersClient({ initialMembers }: ClientProps) {
  const [members] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('All')

  /* ── Filtering ── */

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.bio && m.bio.toLowerCase().includes(search.toLowerCase())) ||
        m.role.toLowerCase().includes(search.toLowerCase())

      const matchesTab = activeTab === 'All' ? true : m.role === activeTab

      return matchesSearch && matchesTab
    })
  }, [members, search, activeTab])

  const currentMembers = useMemo(
    () => filteredMembers.filter((member) => member.status === 'current'),
    [filteredMembers]
  )

  const completedMembers = useMemo(
    () => filteredMembers.filter((member) => member.status === 'completed' || member.status === 'alumni'),
    [filteredMembers]
  )

  /* ── Helpers ── */

  const plainText = (value?: string) =>
    value ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''

  /* ── Card renderer ── */

  const renderCards = (membersList: Member[]) => {

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {membersList.map((member) => {
            const researchArea = plainText(member.bio).slice(0, 96)

            return (
              <motion.div
                key={member._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between items-center text-center relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-full flex flex-col items-center space-y-4">
                  <div className="h-28 w-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative shadow-inner">
                    {member.imageUrl ? (
                      <SafeImage
                        src={member.imageUrl}
                        alt={member.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        fallback={
                          <User className="h-10 w-10 text-slate-400" />
                        }
                      />
                    ) : (
                      <User className="h-10 w-10 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1 w-full">
                    <h3 className="font-extrabold text-slate-955 dark:text-white text-base leading-tight truncate px-1">
                      {member.name}
                    </h3>

                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      {MEMBER_ROLE_LABELS[member.role]}
                    </p>

                    {researchArea && (
                      <p className="text-[11px] font-medium leading-relaxed text-slate-500 line-clamp-2">
                        {researchArea}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 text-slate-400 hover:text-blue-600 transition-colors" />
                      </a>
                    )}
                  </div>

                 <Link
  href={`/people/current-members/${member.slug || member._id}`}
  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:underline"
>
                    View Bio
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  /* ── Role sections renderer ── */

  const renderRoleGroups = () => {
    const rolesToRender = activeTab === 'All' ? ROLE_ORDER : ROLE_ORDER.filter((r) => r === activeTab)

    return (
      <div className="space-y-14">
        {rolesToRender.map((role) => {
          const ongoing = currentMembers.filter((m) => m.role === role)
          const completed = completedMembers.filter((m) => m.role === role)

          if (ongoing.length === 0 && completed.length === 0) return null

          return (
            <RoleSection
              key={role}
              role={role}
              ongoingMembers={ongoing}
              completedMembers={completed}
              renderCards={renderCards}
            />
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header Controls */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-5">
          {/* Search + Role Tabs */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Role Tabs */}
            <div className="flex flex-wrap gap-2">
              {(['All', ...MEMBER_ROLES] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab === 'All'
                    ? 'All'
                    : MEMBER_ROLE_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredMembers.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/55 dark:border-slate-800/55 bg-white dark:bg-slate-900 py-24 text-center text-slate-500 italic">
            No team members matched your search or selected filter.
          </div>
        ) : (
          <section className="space-y-8">
            {renderRoleGroups()}
          </section>
        )}
      </div>
    </>
  )
}
