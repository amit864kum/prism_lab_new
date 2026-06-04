'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Briefcase, ChevronLeft, ChevronRight, Loader2, ArrowUpRight } from 'lucide-react'

interface Project {
  _id: string
  title: string
  slug: string
  description: string
  status: 'ongoing' | 'completed'
  startDate?: string
  endDate?: string
  imageUrl?: string
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        if (res.ok) {
          setProjects(data.projects || [])
        }
      } catch (err) {
        console.error('Error fetching projects', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filter projects by status tab and search query
  const filteredProjects = projects.filter((project) => {
    const matchesTab =
      activeTab === 'all' ? true : project.status === activeTab
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeTab])

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Page Title Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Research Projects
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Explore our laboratory&apos;s funded and collaborative research efforts, spanning across active developments and completed milestones.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Controls Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            {(['all', 'ongoing', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-grow sm:max-w-md">
            <input
              type="text"
              placeholder="Search projects by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold shadow-sm transition"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="py-24 flex justify-center items-center text-slate-500 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="font-semibold text-sm">Fetching projects database...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl text-center text-slate-500 italic">
            No projects matched your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedProjects.map((project) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between p-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                          project.status === 'ongoing'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      {project.startDate && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-450 dark:text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {formatDate(project.startDate)}
                            {project.status === 'ongoing'
                              ? ' - Present'
                              : project.endDate
                              ? ` - ${formatDate(project.endDate)}`
                              : ' - Completed'}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  {project.imageUrl && (
                    <div className="mt-6 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 aspect-video relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <span className="text-xs font-semibold text-slate-650 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
