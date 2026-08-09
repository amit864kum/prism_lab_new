'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Tag,
  User,
} from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import { sanitizeHTML } from '@/lib/sanitize'

interface EducationItem {
  degree: string
  year: number
  thesis_title?: string
  specialization?: string
  supervisor?: string
  department?: string
  institute: string
  university?: string
  grade?: string
  displayOrder?: number
}

interface ProfilePoint {
  text: string
  link?: string
}

interface ProfileSectionEntry {
  title: string
  points: ProfilePoint[]
  duration?: string
  year?: number
  date?: string
}

interface PIPublication {
  authors: string
  title: string
  doiLink?: string
  journalName?: string
  conferenceName?: string
  bookTitle?: string
  publisher?: string
  patentNumber?: string
  year: number
  displayOrder?: number
}

interface PIProfile {
  _id: string
  name: string
  title: string
  bio: string
  imageUrl?: string
  emails?: string[]
  officeLocation?: string
  phoneNumbers?: string[]
  researchInterests: string[]
  education: EducationItem[]
  teaching: ProfileSectionEntry[]
  activities: ProfileSectionEntry[]
  achievements: ProfileSectionEntry[]
  miscellaneous: ProfileSectionEntry[]
  journalPublications?: PIPublication[]
  conferencePublications?: PIPublication[]
  bookChapters?: PIPublication[]
  patents?: PIPublication[]
}

interface ClientProps {
  profile: PIProfile | null
}

function validPoints(points: ProfilePoint[] = []) {
  return points.filter((point) => point.text?.trim())
}

function validEntries(entries: ProfileSectionEntry[] = []) {
  return entries.filter((entry) => entry.title?.trim() && validPoints(entry.points).length > 0)
}

function sortByDisplayOrder<T extends { displayOrder?: number; year?: number }>(items: T[] = []) {
  return [...items].sort((a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999) || (b.year || 0) - (a.year || 0))
}

function SectionEntries({ entries }: { entries: ProfileSectionEntry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <article key={`${entry.title}-${index}`} className="rounded-xl border border-slate-200/60 p-5 dark:border-slate-800/60">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h4 className="text-base font-extrabold leading-snug text-slate-950 dark:text-white">{entry.title}</h4>
            {(entry.duration || entry.year || entry.date) && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                {entry.duration || entry.year || entry.date}
              </span>
            )}
          </div>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {validPoints(entry.points).map((point, pointIndex) => (
              <li key={`${entry.title}-${pointIndex}`} className="pl-1">
                <span>{point.text}</span>
                {point.link && (
                  <a
                    href={point.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                  >
                    {point.link}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  )
}

function PITable({
  title,
  items,
  venueHeader,
  venueValue,
}: {
  title: string
  items: PIPublication[]
  venueHeader: string
  venueValue: (item: PIPublication) => string
}) {
  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <h4 className="border-b border-slate-100 pb-2 text-base font-extrabold text-slate-900 dark:border-slate-800 dark:text-white">
        {title}
      </h4>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-slate-850 dark:text-slate-400">
            <tr>
              <th className="w-20 px-4 py-3">S. No.</th>
              <th className="px-4 py-3">Name of all Authors</th>
              <th className="px-4 py-3">Paper Title</th>
              <th className="px-4 py-3">{venueHeader}</th>
              <th className="w-24 px-4 py-3">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortByDisplayOrder(items).map((item, index) => (
              <tr key={`${item.title}-${index}`} className="align-top hover:bg-slate-50/70 dark:hover:bg-slate-950/50">
                <td className="px-4 py-4 font-extrabold text-slate-600 dark:text-slate-400">{index + 1}</td>
                <td className="px-4 py-4 font-semibold leading-relaxed text-slate-600 dark:text-slate-400">{item.authors}</td>
                <td className="px-4 py-4">
                  <p className="font-extrabold leading-snug text-slate-950 dark:text-white">{item.title}</p>
                  {item.doiLink && (
                    <a
                      href={item.doiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 break-all text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {item.doiLink}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  )}
                </td>
                <td className="px-4 py-4 text-xs font-semibold italic text-slate-600 dark:text-slate-400">
                  {venueValue(item) || '-'}
                </td>
                <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-300">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function PrincipalInvestigatorClient({ profile }: ClientProps) {
  const [activeTab, setActiveTab] = useState('bio')

  if (!profile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <User className="mx-auto mb-4 h-12 w-12 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile is Under Construction</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
          The Principal Investigator profile has not been initialized yet.
        </p>
      </div>
    )
  }

  const teachingEntries = validEntries(profile.teaching)
  const activityEntries = validEntries(profile.activities)
  const achievementEntries = validEntries(profile.achievements)
  const miscellaneousEntries = validEntries(profile.miscellaneous)
  const journalPublications = sortByDisplayOrder(profile.journalPublications || [])
  const conferencePublications = sortByDisplayOrder(profile.conferencePublications || [])
  const bookChapters = sortByDisplayOrder(profile.bookChapters || [])
  const patents = sortByDisplayOrder(profile.patents || [])

  const tabs = [
    { id: 'bio', label: 'Biography', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    ...(journalPublications.length || conferencePublications.length || bookChapters.length || patents.length
      ? [{ id: 'publications', label: 'Publications', icon: BookOpen }]
      : []),
    ...(teachingEntries.length ? [{ id: 'teaching', label: 'Teaching', icon: FileText }] : []),
    ...(activityEntries.length ? [{ id: 'activities', label: 'Activities', icon: Tag }] : []),
    ...(achievementEntries.length ? [{ id: 'achievements', label: 'Achievements', icon: Award }] : []),
    ...(miscellaneousEntries.length ? [{ id: 'miscellaneous', label: 'Misc.', icon: Sparkles }] : []),
    { id: 'contact', label: 'Contact', icon: Mail },
  ]

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
      <aside className="space-y-6 lg:col-span-4">
        <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 text-center shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <div className="relative mb-6 flex h-56 w-56 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-950">
            {profile.imageUrl ? (
              <SafeImage src={profile.imageUrl} alt={profile.name} className="h-full w-full object-cover" fallback={<User className="h-20 w-20 text-slate-400" />} />
            ) : (
              <User className="h-20 w-20 text-slate-400" />
            )}
          </div>
          <h2 className="relative text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">{profile.name}</h2>
          <p className="relative mt-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-450">{profile.title}</p>
          <div className="relative mt-6 w-full space-y-3.5 border-t border-slate-100 pt-6 text-xs font-medium text-slate-600 dark:border-slate-800 dark:text-slate-400">
            {profile.emails?.map((email) => (
              <a key={email} href={`mailto:${email}`} className="flex items-center justify-center gap-3 break-all hover:text-blue-600 dark:hover:text-blue-400">
                <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                {email}
              </a>
            ))}
            {profile.phoneNumbers?.map((phone) => (
              <p key={phone} className="flex items-center justify-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                {phone}
              </p>
            ))}
            {profile.officeLocation && (
              <p className="flex items-center justify-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                {profile.officeLocation}
              </p>
            )}
          </div>
        </div>

        {profile.researchInterests?.length > 0 && (
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
            <h3 className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
              <Sparkles className="h-4.5 w-4.5 text-blue-500" />
              Research Focus
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.researchInterests.map((interest) => (
                <span key={interest} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      <section className="space-y-6 lg:col-span-8">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-850 dark:bg-slate-900 md:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition md:flex-1 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {isActive && <motion.div layoutId="pi-active-pill" className="absolute inset-0 rounded-xl bg-blue-50 dark:bg-blue-950/40" />}
                <Icon className="z-10 h-4 w-4" />
                <span className="z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="min-h-[400px] rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'bio' && (
              <motion.div key="bio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <User className="h-5 w-5 text-blue-500" />
                  Biography & Background
                </h3>
                <div className="prose max-w-none text-sm leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-400 sm:text-base" dangerouslySetInnerHTML={{ __html: sanitizeHTML(profile.bio) }} />
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div key="education" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  Education
                </h3>
                {profile.education.length === 0 ? (
                  <p className="py-10 text-center italic text-slate-500">No education entries recorded.</p>
                ) : (
                  <div className="space-y-5">
                    {sortByDisplayOrder(profile.education).map((edu, index) => (
                      <article key={`${edu.degree}-${index}`} className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {edu.degree} [{edu.year}]
                        </h4>
                        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                          {(edu.thesis_title || edu.specialization) && <li>{[edu.thesis_title, edu.specialization].filter(Boolean).join(' / ')}</li>}
                          {edu.supervisor && <li>Supervisor: {edu.supervisor}</li>}
                          {edu.department && <li>Department: {edu.department}</li>}
                          {(edu.institute || edu.university) && <li>{[edu.institute, edu.university].filter(Boolean).join(' / ')}</li>}
                          {edu.grade && <li>Grade: {edu.grade}</li>}
                        </ul>
                      </article>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'publications' && (
              <motion.div key="publications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Publications
                </h3>
                <PITable title="Journals" items={journalPublications} venueHeader="Name of Journal" venueValue={(item) => item.journalName || ''} />
                <PITable title="Conferences" items={conferencePublications} venueHeader="Name of Conference" venueValue={(item) => item.conferenceName || ''} />
                <PITable title="Book Chapters" items={bookChapters} venueHeader="Book / Publisher" venueValue={(item) => [item.bookTitle, item.publisher].filter(Boolean).join(' / ')} />
                <PITable title="Patents" items={patents} venueHeader="Patent Number / Office" venueValue={(item) => [item.patentNumber, item.publisher].filter(Boolean).join(' / ')} />
              </motion.div>
            )}

            {activeTab === 'teaching' && <motion.div key="teaching" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6"><h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white"><FileText className="h-5 w-5 text-blue-500" />Teaching</h3><SectionEntries entries={teachingEntries} /></motion.div>}
            {activeTab === 'activities' && <motion.div key="activities" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6"><h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white"><Tag className="h-5 w-5 text-blue-500" />Activities</h3><SectionEntries entries={activityEntries} /></motion.div>}
            {activeTab === 'achievements' && <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6"><h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white"><Award className="h-5 w-5 text-blue-500" />Achievements</h3><SectionEntries entries={achievementEntries} /></motion.div>}
            {activeTab === 'miscellaneous' && <motion.div key="miscellaneous" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6"><h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white"><Sparkles className="h-5 w-5 text-blue-500" />Miscellaneous</h3><SectionEntries entries={miscellaneousEntries} /></motion.div>}

            {activeTab === 'contact' && (
              <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Office Details & Contact
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950">
                    <h4 className="text-sm font-extrabold text-slate-950 dark:text-white">Direct Inquiries</h4>
                    <div className="mt-4 space-y-2">
                      {profile.emails?.length ? profile.emails.map((email) => (
                        <a key={email} href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
                          <Mail className="h-4.5 w-4.5" />
                          {email}
                        </a>
                      )) : <p className="text-xs italic text-slate-500">No email addresses available.</p>}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950">
                    <h4 className="text-sm font-extrabold text-slate-950 dark:text-white">Campus Coordinates</h4>
                    <div className="mt-4 space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-400">
                      {profile.officeLocation && <p className="flex gap-3"><MapPin className="h-4.5 w-4.5 text-slate-400" />Office: {profile.officeLocation}</p>}
                      {profile.phoneNumbers?.map((phone) => <p key={phone} className="flex gap-3"><Phone className="h-4.5 w-4.5 text-slate-400" />{phone}</p>)}
                      <p className="flex gap-3"><MapPin className="h-4.5 w-4.5 text-slate-400" />Department of Computer Science & Engineering, IIT Patna, Bihta, Bihar, India - 801106</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
