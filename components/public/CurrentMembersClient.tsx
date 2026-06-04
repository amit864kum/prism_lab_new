'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mail, GraduationCap, User, ArrowUpRight } from 'lucide-react'

interface Member {
  _id: string
  name: string
  slug: string
  role: 'PhD Scholar' | 'Masters Student' | 'Undergraduate' | 'Research Assistant'
  status: 'current' | 'alumni'
  yearJoined?: number | null
  imageUrl?: string
  bio?: string
  email?: string
  linkedinUrl?: string
  googleScholarUrl?: string
  publications: string[]
}

interface ClientProps {
  initialMembers: Member[]
}

type TabType = 'All' | 'PhD Scholar' | 'Masters Student' | 'Undergrad & RA'

export default function CurrentMembersClient({ initialMembers }: ClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('All')

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.bio && m.bio.toLowerCase().includes(search.toLowerCase())) ||
      m.role.toLowerCase().includes(search.toLowerCase())

    const matchesTab =
      activeTab === 'All'
        ? true
        : activeTab === 'PhD Scholar'
        ? m.role === 'PhD Scholar'
        : activeTab === 'Masters Student'
        ? m.role === 'Masters Student'
        : m.role === 'Undergraduate' || m.role === 'Research Assistant'

    return matchesSearch && matchesTab
  })

  // Group by role to organize sections within the active tab
  const grouped = filteredMembers.reduce(
    (acc, m) => {
      if (!acc[m.role]) acc[m.role] = []
      acc[m.role].push(m)
      return acc
    },
    {} as Record<string, Member[]>
  )

  const rolesOrder = [
    'PhD Scholar',
    'Masters Student',
    'Undergraduate',
    'Research Assistant',
  ] as const

  return (
    <div className="space-y-10">
      {/* Search & Tabs Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl shadow-sm">
        {/* Role Tabs */}
        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-950 p-1 rounded-xl gap-1">
          {(['All', 'PhD Scholar', 'Masters Student', 'Undergrad & RA'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-grow md:max-w-md">
          <input
            type="text"
            placeholder="Search by name, interests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold shadow-sm transition"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-505" />
        </div>
      </div>

      {/* Directory Grid */}
      {filteredMembers.length === 0 ? (
        <div className="py-24 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl text-center text-slate-500 italic">
          No team members matched your search or selected filter.
        </div>
      ) : (
        <div className="space-y-12">
          {rolesOrder.map((role) => {
            const list = grouped[role]
            if (!list || list.length === 0) return null

            return (
              <div key={role} className="space-y-6">
                <div className="space-y-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {role}s ({list.length})
                  </h2>
                  <div className="h-1 w-12 bg-blue-500 rounded" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {list.map((member) => (
                      <motion.div
                        key={member._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between items-center text-center relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="w-full flex flex-col items-center space-y-4">
                          {/* Member Image */}
                          <div className="h-28 w-28 rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 bg-slate-55 dark:bg-slate-950 flex items-center justify-center relative shadow-inner">
                            {member.imageUrl ? (
                              <img
                                src={member.imageUrl}
                                alt={member.name}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <User className="h-10 w-10 text-slate-350" />
                            )}
                          </div>

                          {/* Member Details */}
                          <div className="space-y-1 w-full">
                            <h3 className="font-extrabold text-slate-950 dark:text-white text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate px-1">
                              {member.name}
                            </h3>
                            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Joined {member.yearJoined || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Social Link Shortcuts & Details trigger */}
                        <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 z-10">
                          {/* Links */}
                          <div className="flex gap-2">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                                title="Send Email"
                              >
                                <Mail className="h-3.5 w-3.5" />
                              </a>
                            )}
                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                                title="LinkedIn Profile"
                              >
                                <svg
                                  className="h-3.5 w-3.5 fill-current text-slate-400"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                              </a>
                            )}
                            {member.googleScholarUrl && (
                              <a
                                href={member.googleScholarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                                title="Google Scholar Profile"
                              >
                                <GraduationCap className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>

                          <Link
                            href={`/people/current-members/${member._id}`}
                            className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Bio
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
