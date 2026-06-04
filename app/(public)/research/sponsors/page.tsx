'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Award, Loader2 } from 'lucide-react'

interface Sponsor {
  _id: string
  name: string
  logoUrl: string
  websiteUrl?: string
  order: number
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch('/api/sponsors')
        const data = await res.json()
        if (res.ok) {
          setSponsors(data.sponsors || [])
        }
      } catch (err) {
        console.error('Error fetching sponsors', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSponsors()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Title Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Sponsors & Partners
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            We are immensely grateful to the organizations, grants, and research partners supporting our computer systems and computing architecture explorations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {loading ? (
          <div className="py-24 flex justify-center items-center text-slate-500 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="font-semibold text-sm">Loading sponsors...</span>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="py-24 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl text-center text-slate-500 italic">
            No sponsors listed yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sponsors.map((sponsor) => {
              const SponsorCard = (
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transition h-64 group relative overflow-hidden"
                >
                  {/* Decorative Subtle Accent Grid */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent dark:from-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="w-full flex-grow flex items-center justify-center p-4">
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="max-h-24 max-w-full object-contain filter dark:brightness-95 transition group-hover:scale-105 duration-350"
                    />
                  </div>

                  <div className="space-y-1.5 z-10 w-full mt-4">
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-sm sm:text-base leading-tight truncate px-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {sponsor.name}
                    </h3>
                    {sponsor.websiteUrl ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                        <Award className="h-3.5 w-3.5 text-blue-500/70" />
                        Supported Grantee
                      </span>
                    )}
                  </div>
                </motion.div>
              )

              if (sponsor.websiteUrl) {
                return (
                  <a
                    key={sponsor._id}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {SponsorCard}
                  </a>
                )
              }

              return <div key={sponsor._id}>{SponsorCard}</div>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
