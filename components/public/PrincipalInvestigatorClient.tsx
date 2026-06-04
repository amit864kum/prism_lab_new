'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  User,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Calendar,
  Sparkles
} from 'lucide-react'

interface EducationItem {
  degree: string
  institution: string
  year: number
}

interface PIProfile {
  _id: string
  name: string
  title: string
  bio: string
  imageUrl?: string
  email?: string
  officeLocation?: string
  phoneNumber?: string
  researchInterests: string[]
  education: EducationItem[]
}

interface Publication {
  _id: string
  title: string
  slug: string
  type: string
  authors: { _id: string; name: string; slug?: string }[]
  year: number
  venue?: string
  abstract?: string
  pdfUrl?: string
  externalUrl?: string
  tags: string[]
}

interface ClientProps {
  profile: PIProfile | null
  publications: Publication[]
}

export default function PrincipalInvestigatorClient({ profile, publications }: ClientProps) {
  const [activeTab, setActiveTab] = useState<'bio' | 'education' | 'publications' | 'contact'>('bio')
  const [copiedPubId, setCopiedPubId] = useState<string | null>(null)

  if (!profile) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
        <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile is Under Construction</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          The Principal Investigator profile has not been initialized yet. Admin credentials are required to configure the details.
        </p>
      </div>
    )
  }

  const generateBibTeX = (pub: Publication) => {
    const authorNames = pub.authors.map((a) => a.name).join(' and ')
    const firstAuthor = pub.authors[0]?.name.split(' ').pop()?.toLowerCase() || 'author'
    const cleanSlug = pub.slug.replace(/[^a-z0-9]/g, '').substring(0, 8)
    const key = `${firstAuthor}${pub.year}${cleanSlug}`
    const cleanTitle = pub.title.replace(/[{}"]/g, '')
    
    if (pub.type === 'Journal Article') {
      return `@article{${key},
  author = {${authorNames}},
  title = {${cleanTitle}},
  journal = {${pub.venue || 'Unknown Journal'}},
  year = {${pub.year}}
}`
    } else {
      return `@inproceedings{${key},
  author = {${authorNames}},
  title = {${cleanTitle}},
  booktitle = {${pub.venue || 'Unknown Venue'}},
  year = {${pub.year}}
}`
    }
  }

  const handleCopyBibTeX = (pub: Publication) => {
    const bibtex = generateBibTeX(pub)
    navigator.clipboard.writeText(bibtex)
    setCopiedPubId(pub._id)
    setTimeout(() => setCopiedPubId(null), 2000)
  }

  const tabs = [
    { id: 'bio', label: 'Biography', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'contact', label: 'Contact Info', icon: Mail },
  ] as const

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Sidebar Profile Summary Card */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/2 opacity-100 transition duration-300" />
          
          <div className="h-56 w-56 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative mb-6">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-103"
              />
            ) : (
              <User className="h-20 w-20 text-slate-350" />
            )}
          </div>

          <h2 className="font-extrabold text-slate-950 dark:text-white text-xl tracking-tight">
            {profile.name}
          </h2>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-450 tracking-wider uppercase mt-1">
            {profile.title}
          </p>

          {/* Quick contact list */}
          <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs text-slate-650 dark:text-slate-400 font-medium">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 justify-center transition"
              >
                <Mail className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                <span>{profile.email}</span>
              </a>
            )}
            {profile.phoneNumber && (
              <div className="flex items-center gap-3 justify-center">
                <Phone className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                <span>{profile.phoneNumber}</span>
              </div>
            )}
            {profile.officeLocation && (
              <div className="flex items-center gap-3 justify-center">
                <MapPin className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                <span>{profile.officeLocation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Research Interests Sidebar Panel */}
        {profile.researchInterests && profile.researchInterests.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-500" />
              Research Focus
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.researchInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60 tracking-tight"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content Tabs Panel */}
      <div className="lg:col-span-8 space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border gap-2 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pi-active-pill"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-950/40 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-4.5 w-4.5 z-10" />
                <span className="z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tabs Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'bio' && (
              <motion.div
                key="bio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Biography & Background
                </h3>
                <div
                  className="prose dark:prose-invert max-w-none text-slate-650 dark:text-slate-350 leading-relaxed text-sm sm:text-base space-y-4"
                  dangerouslySetInnerHTML={{ __html: profile.bio }}
                />
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  Education Timeline
                </h3>

                {profile.education.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-10">No education timeline entries recorded.</p>
                ) : (
                  <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-8 py-2">
                    {profile.education
                      .sort((a, b) => b.year - a.year)
                      .map((edu, idx) => (
                        <div key={idx} className="relative group">
                          {/* Timeline node icon indicator */}
                          <div className="absolute -left-[31px] top-1 h-5 w-5 rounded-full border-2 border-blue-500 bg-white dark:bg-slate-900 flex items-center justify-center transition group-hover:bg-blue-500" />
                          <div className="space-y-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                              Class of {edu.year}
                            </span>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                              {edu.degree}
                            </h4>
                            <p className="text-xs sm:text-sm font-semibold text-slate-550 dark:text-slate-400">
                              {edu.institution}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'publications' && (
              <motion.div
                key="publications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Publications Archive
                </h3>

                {publications.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-10">No publications added yet.</p>
                ) : (
                  <div className="space-y-6">
                    {publications.map((pub) => (
                      <div
                        key={pub._id}
                        className="p-5 border border-slate-200/60 dark:border-slate-800/60 rounded-xl hover:bg-slate-50/30 dark:hover:bg-slate-900/20 transition space-y-3.5 relative group"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-55 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                            {pub.type}
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
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 font-medium">
                            {pub.authors.map((author, aIdx) => {
                              const isLast = aIdx === pub.authors.length - 1
                              const isPI = author.name.includes(profile.name)
                              return (
                                <span key={author._id || aIdx}>
                                  {isPI ? (
                                    <span className="font-bold text-slate-900 dark:text-white">
                                      {author.name}
                                    </span>
                                  ) : (
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {author.name}
                                    </span>
                                  )}
                                  {!isLast && ', '}
                                </span>
                              )
                            })}
                          </p>
                        </div>

                        {pub.venue && (
                          <p className="text-xs italic text-slate-500 dark:text-slate-405 font-medium">
                            {pub.venue}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          {/* Action links */}
                          <div className="flex gap-4">
                            {pub.pdfUrl && (
                              <a
                                href={pub.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-750 dark:text-blue-400 dark:hover:text-blue-300"
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
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-750 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Publisher Site
                              </a>
                            )}
                          </div>

                          {/* BibTeX Copy Button */}
                          <button
                            onClick={() => handleCopyBibTeX(pub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-[10px] rounded-lg transition"
                            title="Copy BibTeX Citation"
                          >
                            {copiedPubId === pub._id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-green-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                BibTeX
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Office Details & Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50/50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-950 dark:text-white text-sm">
                        Direct Inquiries
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                        For research collaboration proposals, PhD application sponsorships, or academic consulting requests:
                      </p>
                    </div>
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition w-fit"
                      >
                        <Mail className="h-4.5 w-4.5" />
                        Send an Email
                      </a>
                    )}
                  </div>

                  <div className="bg-slate-50/50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-4">
                    <h4 className="font-extrabold text-slate-950 dark:text-white text-sm">
                      Campus Coordinates
                    </h4>
                    <div className="space-y-3.5 text-xs font-semibold text-slate-700 dark:text-slate-350">
                      {profile.officeLocation && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4.5 w-4.5 text-slate-400" />
                          <span>Office: {profile.officeLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4.5 w-4.5 text-slate-400" />
                        <span>
                          Department of Computer Science & Engineering<br />
                          Indian Institute of Technology Patna<br />
                          Bihta, Patna, Bihar, India - 801106
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
