'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Compass, Loader2 } from 'lucide-react'

interface ResearchArea {
  _id: string
  title: string
  slug: string
  description: string
  imageUrl?: string
  order: number
}

export default function ResearchAreasPage() {
  const [areas, setAreas] = useState<ResearchArea[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch('/api/research-areas')
        const data = await res.json()
        if (res.ok) {
          setAreas(data.researchAreas || [])
        }
      } catch (err) {
        console.error('Error fetching research areas', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAreas()
  }, [])

  const filteredAreas = areas.filter(
    (area) =>
      area.title.toLowerCase().includes(search.toLowerCase()) ||
      area.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Research Areas
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore the academic and applied domains investigated by our research group.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search research topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm shadow-sm transition"
        />
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-450 dark:text-slate-500" />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 flex justify-center items-center text-slate-500 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span>Loading research areas...</span>
        </div>
      ) : filteredAreas.length === 0 ? (
        <div className="py-20 text-center text-slate-500 italic">
          No research areas match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAreas.map((area) => (
            <motion.div
              key={area._id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between p-6 group"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Compass className="h-6 w-6" />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {area.title}
                </h2>
                <p className="text-slate-550 dark:text-slate-400 text-sm line-clamp-4 leading-relaxed">
                  {area.description}
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href={`/research/areas/${area.slug}`}
                  className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Explore Domain Details &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
