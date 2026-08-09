'use client'

import { useEffect, useState } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/LazyRichTextEditor'
import DynamicProfileRepeater, { type RepeaterField } from '@/components/admin/DynamicProfileRepeater'
import ProfilePointSectionRepeater, {
  type ProfilePoint,
  type ProfilePointSectionEntry,
} from '@/components/admin/ProfilePointSectionRepeater'
import { AlertCircle, BookOpen, CheckCircle, Save, Trash2, User } from 'lucide-react'

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
}

interface TeachingItem extends ProfilePointSectionEntry {
  duration?: string
}

interface ActivityItem extends ProfilePointSectionEntry {
  year?: number
}

interface AchievementItem extends ProfilePointSectionEntry {
  date?: string
}

type MiscellaneousItem = ProfilePointSectionEntry

interface PIPublicationItem {
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

const currentYear = new Date().getFullYear()

const createEducation = (): EducationItem => ({
  degree: '',
  year: currentYear,
  thesis_title: '',
  specialization: '',
  supervisor: '',
  department: '',
  institute: '',
  university: '',
  grade: '',
})

const createTeaching = (): TeachingItem => ({
  title: '',
  points: [{ text: '', link: '' }],
  duration: '',
})

const createActivity = (): ActivityItem => ({
  title: '',
  points: [{ text: '', link: '' }],
  year: undefined,
})

const createAchievement = (): AchievementItem => ({
  title: '',
  points: [{ text: '', link: '' }],
  date: '',
})

const createMiscellaneous = (): MiscellaneousItem => ({
  title: '',
  points: [{ text: '', link: '' }],
})

const createPIPublication = (): PIPublicationItem => ({
  authors: '',
  title: '',
  doiLink: '',
  journalName: '',
  conferenceName: '',
  bookTitle: '',
  publisher: '',
  patentNumber: '',
  year: currentYear,
  displayOrder: undefined,
})

const educationFields: RepeaterField<EducationItem>[] = [
  { key: 'degree', label: 'Degree', required: true, placeholder: 'Ph.D., M.Tech, B.Tech' },
  { key: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: 2100 },
  { key: 'thesis_title', label: 'Thesis Title', placeholder: 'Thesis or dissertation title', className: 'sm:col-span-2' },
  { key: 'specialization', label: 'Specialization', placeholder: 'Wireless Networks, AI, Systems' },
  { key: 'supervisor', label: 'Supervisor', placeholder: 'Advisor or supervisor name' },
  { key: 'department', label: 'Department', placeholder: 'Department of CSE' },
  { key: 'institute', label: 'Institute', required: true, placeholder: 'IIT Patna' },
  { key: 'university', label: 'University', placeholder: 'University name' },
  { key: 'grade', label: 'Grade', placeholder: 'CGPA, percentage, distinction' },
]

const journalPublicationFields: RepeaterField<PIPublicationItem>[] = [
  { key: 'authors', label: 'Authors', required: true, className: 'sm:col-span-2', placeholder: 'A. Kumar, R. Singh, S. Verma' },
  { key: 'title', label: 'Paper Title', required: true, className: 'sm:col-span-2', placeholder: 'Paper title' },
  { key: 'doiLink', label: 'DOI Link', placeholder: 'https://doi.org/...' },
  { key: 'journalName', label: 'Journal Name', required: true, placeholder: 'Journal name' },
  { key: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: 2100 },
  { key: 'displayOrder', label: 'Display Order', type: 'number', min: 1 },
]

const conferencePublicationFields: RepeaterField<PIPublicationItem>[] = [
  { key: 'authors', label: 'Authors', required: true, className: 'sm:col-span-2', placeholder: 'A. Kumar, R. Singh, S. Verma' },
  { key: 'title', label: 'Paper Title', required: true, className: 'sm:col-span-2', placeholder: 'Conference paper title' },
  { key: 'doiLink', label: 'DOI Link', placeholder: 'https://doi.org/...' },
  { key: 'conferenceName', label: 'Conference Name', required: true, placeholder: 'Conference / proceedings' },
  { key: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: 2100 },
  { key: 'displayOrder', label: 'Display Order', type: 'number', min: 1 },
]

const bookChapterFields: RepeaterField<PIPublicationItem>[] = [
  { key: 'authors', label: 'Authors', required: true, className: 'sm:col-span-2' },
  { key: 'title', label: 'Chapter Title', required: true, className: 'sm:col-span-2' },
  { key: 'bookTitle', label: 'Book Title', placeholder: 'Edited book / volume' },
  { key: 'publisher', label: 'Publisher', placeholder: 'Publisher name' },
  { key: 'doiLink', label: 'DOI Link', placeholder: 'https://doi.org/...' },
  { key: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: 2100 },
  { key: 'displayOrder', label: 'Display Order', type: 'number', min: 1 },
]

const patentFields: RepeaterField<PIPublicationItem>[] = [
  { key: 'authors', label: 'Inventors', required: true, className: 'sm:col-span-2' },
  { key: 'title', label: 'Patent Title', required: true, className: 'sm:col-span-2' },
  { key: 'patentNumber', label: 'Patent Number', placeholder: 'Application / grant number' },
  { key: 'publisher', label: 'Patent Office', placeholder: 'Indian Patent Office, USPTO' },
  { key: 'doiLink', label: 'Reference Link', placeholder: 'https://...' },
  { key: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: 2100 },
  { key: 'displayOrder', label: 'Display Order', type: 'number', min: 1 },
]

export default function PIProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exists, setExists] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [officeLocation, setOfficeLocation] = useState('')
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [researchInterests, setResearchInterests] = useState<string[]>([])
  const [education, setEducation] = useState<EducationItem[]>([])
  const [teaching, setTeaching] = useState<TeachingItem[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [miscellaneous, setMiscellaneous] = useState<MiscellaneousItem[]>([])
  const [piPublicationTab, setPiPublicationTab] = useState<'journal' | 'conference' | 'book' | 'patent'>('journal')
  const [journalPublications, setJournalPublications] = useState<PIPublicationItem[]>([])
  const [conferencePublications, setConferencePublications] = useState<PIPublicationItem[]>([])
  const [bookChapters, setBookChapters] = useState<PIPublicationItem[]>([])
  const [patents, setPatents] = useState<PIPublicationItem[]>([])

  const toProfilePoints = (item: any): ProfilePoint[] => {
    const points = Array.isArray(item.points)
      ? item.points
      : [{ text: item.description || item.content || '', link: '' }]

    return points.map((point: any) => ({
      text: point.text || '',
      link: point.link || '',
    }))
  }

  const toPIPublications = (items: any[] = []): PIPublicationItem[] =>
    items.map((item, index) => ({
      authors: item.authors || '',
      title: item.title || '',
      doiLink: item.doiLink || '',
      journalName: item.journalName || '',
      conferenceName: item.conferenceName || '',
      bookTitle: item.bookTitle || '',
      publisher: item.publisher || '',
      patentNumber: item.patentNumber || '',
      year: Number(item.year) || currentYear,
      displayOrder: item.displayOrder || index + 1,
    }))

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const fetchPIProfile = async () => {
    try {
      const res = await fetch('/api/pi-profile')
      const data = await res.json()

      if (res.status === 404) {
        setExists(false)
        setLoading(false)
        return
      }

      if (!res.ok || !data.piProfile) {
        showFeedback(data.error || 'Failed to fetch PI profile', 'error')
        return
      }

      const profile = data.piProfile
      setExists(true)
      setName(profile.name || '')
      setTitle(profile.title || '')
      setBio(profile.bio || '')
      setImageUrl(profile.imageUrl || '')
      setEmails(profile.emails || [])
      setOfficeLocation(profile.officeLocation || '')
      setPhoneNumbers(profile.phoneNumbers || [])
      setResearchInterests(profile.researchInterests || [])
      setEducation(
        (profile.education || []).map((item: any) => ({
          degree: item.degree || '',
          year: Number(item.year) || currentYear,
          thesis_title: item.thesis_title || '',
          specialization: item.specialization || '',
          supervisor: item.supervisor || '',
          department: item.department || '',
          institute: item.institute || item.institution || '',
          university: item.university || '',
          grade: item.grade || '',
        }))
      )
      setTeaching(
        (profile.teaching || []).map((item: any) => ({
          title: item.title || '',
          duration: item.duration || '',
          points: toProfilePoints(item),
        }))
      )
      setActivities(
        (profile.activities || []).map((item: any) => ({
          title: item.title || '',
          year: item.year || undefined,
          points: toProfilePoints(item),
        }))
      )
      setAchievements(
        (profile.achievements || []).map((item: any) => ({
          title: item.title || '',
          date: item.date || '',
          points: toProfilePoints(item),
        }))
      )
      setMiscellaneous(
        (profile.miscellaneous || []).map((item: any) => ({
          title: item.title || '',
          points: toProfilePoints(item),
        }))
      )
      setJournalPublications(toPIPublications(profile.journalPublications || []))
      setConferencePublications(toPIPublications(profile.conferencePublications || []))
      setBookChapters(toPIPublications(profile.bookChapters || []))
      setPatents(toPIPublications(profile.patents || []))
    } catch (err) {
      showFeedback('Error fetching PI profile from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPIProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddInterest = () => {
    const value = interestInput.trim()
    if (!value || researchInterests.includes(value)) return
    setResearchInterests([...researchInterests, value])
    setInterestInput('')
  }

  const handleRemoveInterest = (indexToRemove: number) => {
    setResearchInterests(researchInterests.filter((_, idx) => idx !== indexToRemove))
  }

  const handleAddEmail = () => {
    const value = emailInput.trim()
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || emails.includes(value)) return
    setEmails([...emails, value])
    setEmailInput('')
  }

  const handleRemoveEmail = (indexToRemove: number) => {
    setEmails(emails.filter((_, idx) => idx !== indexToRemove))
  }

  const handleAddPhone = () => {
    const value = phoneInput.trim()
    if (!value || phoneNumbers.includes(value)) return
    setPhoneNumbers([...phoneNumbers, value])
    setPhoneInput('')
  }

  const handleRemovePhone = (indexToRemove: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, idx) => idx !== indexToRemove))
  }

  const getFinalEmails = () => {
    const pendingEmail = emailInput.trim()
    const combinedEmails = pendingEmail ? [...emails, pendingEmail] : emails
    return Array.from(new Set(combinedEmails.map((item) => item.trim()).filter(Boolean)))
  }

  const getFinalPhoneNumbers = () => {
    const pendingPhone = phoneInput.trim()
    const combinedPhones = pendingPhone ? [...phoneNumbers, pendingPhone] : phoneNumbers
    return Array.from(new Set(combinedPhones.map((item) => item.trim()).filter(Boolean)))
  }

  const normalizePoint = (point: ProfilePoint) => ({
    text: point.text.trim(),
    link: point.link?.trim() || '',
  })

  const normalizePointSection = <T extends ProfilePointSectionEntry>(items: T[]) =>
    items
      .map((item) => ({
        ...item,
        title: item.title.trim(),
        points: item.points.map(normalizePoint).filter((point) => point.text.length > 0),
      }))
      .filter((item) => item.title.length > 0 && item.points.length > 0)

  const normalizePIPublications = (items: PIPublicationItem[]) =>
    items
      .map((item, index) => ({
        authors: item.authors.trim(),
        title: item.title.trim(),
        doiLink: item.doiLink?.trim() || '',
        journalName: item.journalName?.trim() || '',
        conferenceName: item.conferenceName?.trim() || '',
        bookTitle: item.bookTitle?.trim() || '',
        publisher: item.publisher?.trim() || '',
        patentNumber: item.patentNumber?.trim() || '',
        year: Number(item.year),
        displayOrder: item.displayOrder ? Number(item.displayOrder) : index + 1,
      }))
      .filter((item) => item.authors.length > 0 && item.title.length > 0 && Boolean(item.year))

  const isValidOptionalUrl = (value?: string) => {
    if (!value?.trim()) return true
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const validateRequiredRepeaters = () => {
    const invalidEducation = education.some((item) => !item.degree.trim() || !item.institute.trim() || !item.year)
    if (invalidEducation) {
      showFeedback('Each education entry requires degree, year, and institute.', 'error')
      return false
    }

    const allPointSections = [...teaching, ...activities, ...achievements, ...miscellaneous]
    const invalidAcademicEntries = allPointSections.some(
      (item) => !item.title.trim() || item.points.filter((point) => point.text.trim()).length === 0
    )
    if (invalidAcademicEntries) {
      showFeedback('Each section entry requires a title and at least one description point.', 'error')
      return false
    }

    const invalidPointLinks = allPointSections.some((item) =>
      item.points.some((point) => !isValidOptionalUrl(point.link))
    )
    if (invalidPointLinks) {
      showFeedback('Point links must be valid http(s) URLs.', 'error')
      return false
    }

    const allPiPublications = [
      ...journalPublications,
      ...conferencePublications,
      ...bookChapters,
      ...patents,
    ]
    const invalidPiPublication = allPiPublications.some(
      (item) => !item.authors.trim() || !item.title.trim() || !item.year
    )
    if (invalidPiPublication) {
      showFeedback('Each PI publication requires authors, title, and year.', 'error')
      return false
    }

    const invalidPiPublicationLink = allPiPublications.some((item) => !isValidOptionalUrl(item.doiLink))
    if (invalidPiPublicationLink) {
      showFeedback('PI publication DOI/reference links must be valid http(s) URLs.', 'error')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showFeedback('Name is required', 'error')
      return
    }
    if (!title.trim()) {
      showFeedback('Title is required', 'error')
      return
    }
    if (!bio.trim() || bio === '<p></p>') {
      showFeedback('Biography is required', 'error')
      return
    }
    const finalEmails = getFinalEmails()
    const finalPhoneNumbers = getFinalPhoneNumbers()
    if (finalEmails.some((item) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item))) {
      showFeedback('Please enter valid email addresses before saving.', 'error')
      return
    }
    if (!validateRequiredRepeaters()) return

    setSaving(true)
    const payload = {
      name,
      title,
      bio,
      imageUrl: imageUrl || undefined,
      emails: finalEmails,
      officeLocation: officeLocation || undefined,
      phoneNumbers: finalPhoneNumbers,
      researchInterests,
      education,
      teaching: normalizePointSection(teaching),
      activities: normalizePointSection(
        activities.map((item) => ({
          ...item,
          year: item.year || undefined,
        }))
      ),
      achievements: normalizePointSection(achievements),
      miscellaneous: normalizePointSection(miscellaneous),
      journalPublications: normalizePIPublications(journalPublications),
      conferencePublications: normalizePIPublications(conferencePublications),
      bookChapters: normalizePIPublications(bookChapters),
      patents: normalizePIPublications(patents),
    }

    try {
      const res = await fetch('/api/pi-profile', {
        method: exists ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      
      if (res.ok) {
        setExists(true)
        setEmails(finalEmails)
        setEmailInput('')
        setPhoneNumbers(finalPhoneNumbers)
        setPhoneInput('')
        showFeedback('Principal Investigator Profile saved successfully!', 'success')
        // Re-fetch data to ensure it was actually saved correctly
        setTimeout(() => {
          fetchPIProfile()
        }, 500)
      } else {
        const errorMsg = data.details 
          ? `Validation Error: ${JSON.stringify(data.details)}`
          : data.error || 'Failed to save PI profile'
        showFeedback(errorMsg, 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <User className="h-8 w-8 text-blue-500" />
          PI Profile Editor
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage profile details, education, teaching, activities, achievements, and additional academic notes.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md text-sm font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
              : 'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-sm text-center text-gray-500 font-semibold animate-pulse">
          Loading PI Profile details...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">Photo & Info</h2>

                <FileUpload label="PI Profile Photo" value={imageUrl} onChange={setImageUrl} type="image" subfolder="pi" />

                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-1">Full Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-semibold text-gray-800"
                    placeholder="e.g. Dr. John Doe"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-1">Designation/Title</span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="e.g. Associate Professor, CSE"
                  />
                </label>
              </section>

              <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">Contact Details</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Addresses</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                      placeholder="johndoe@iitp.ac.in"
                    />
                    <button
                      type="button"
                      onClick={handleAddEmail}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {emails.length === 0 ? (
                    <p className="text-sm text-gray-500 italic mt-2">No emails added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {emails.map((email, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(idx)}
                            className="text-blue-400 hover:text-blue-600 focus:outline-none"
                            aria-label={`Remove ${email}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-1">Office Location</span>
                  <input
                    type="text"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="e.g. Block 3, Room 402"
                  />
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Numbers</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                      placeholder="e.g. +91 612 302 8xxx"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhone}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {phoneNumbers.length === 0 ? (
                    <p className="text-sm text-gray-500 italic mt-2">No phone numbers added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {phoneNumbers.map((phone, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200"
                        >
                          {phone}
                          <button
                            type="button"
                            onClick={() => handleRemovePhone(idx)}
                            className="text-green-400 hover:text-green-600 focus:outline-none"
                            aria-label={`Remove ${phone}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">Biography & Overview</h2>
                <RichTextEditor value={bio} onChange={setBio} />
              </section>

              <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">Research Interests</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="e.g. Natural Language Processing"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
                  >
                    Add
                  </button>
                </div>
                {researchInterests.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No interests listed. Add some above.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {researchInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(idx)}
                          className="text-slate-400 hover:text-slate-600 focus:outline-none"
                          aria-label={`Remove ${interest}`}
                        >
                          <Trash2 className="h-3 w-3 text-rose-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <DynamicProfileRepeater
                title="Education Details"
                addLabel="Add Degree"
                emptyText="No education details listed."
                items={education}
                createItem={createEducation}
                fields={educationFields}
                onChange={setEducation}
              />

              <ProfilePointSectionRepeater
                title="Teaching"
                addLabel="Add Teaching Entry"
                emptyText="No teaching entries listed."
                items={teaching}
                createItem={createTeaching}
                metaField={{ key: 'duration', label: 'Duration', placeholder: 'Spring 2025, 2022-2024' }}
                onChange={setTeaching}
              />

              <ProfilePointSectionRepeater
                title="Activities"
                addLabel="Add Activity"
                emptyText="No activities listed."
                items={activities}
                createItem={createActivity}
                metaField={{ key: 'year', label: 'Year', type: 'number', min: 1900, max: 2100 }}
                onChange={setActivities}
              />

              <ProfilePointSectionRepeater
                title="Achievements"
                addLabel="Add Achievement"
                emptyText="No achievements listed."
                items={achievements}
                createItem={createAchievement}
                metaField={{ key: 'date', label: 'Date / Year', placeholder: '2025 or Jan 2025' }}
                onChange={setAchievements}
              />

              <ProfilePointSectionRepeater
                title="Miscellaneous"
                addLabel="Add Miscellaneous Entry"
                emptyText="No miscellaneous entries listed."
                items={miscellaneous}
                createItem={createMiscellaneous}
                onChange={setMiscellaneous}
              />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h2 className="text-md font-bold text-gray-900">PI Publications</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'journal', label: 'Journal' },
                    { key: 'conference', label: 'Conference' },
                    { key: 'book', label: 'Book Chapters' },
                    { key: 'patent', label: 'Patents' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setPiPublicationTab(tab.key as typeof piPublicationTab)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        piPublicationTab === tab.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {piPublicationTab === 'journal' && (
                  <DynamicProfileRepeater
                    title="Journal Publications"
                    addLabel="Add Journal"
                    emptyText="No journal publications listed."
                    items={journalPublications}
                    createItem={createPIPublication}
                    fields={journalPublicationFields}
                    onChange={setJournalPublications}
                  />
                )}

                {piPublicationTab === 'conference' && (
                  <DynamicProfileRepeater
                    title="Conference Publications"
                    addLabel="Add Conference"
                    emptyText="No conference publications listed."
                    items={conferencePublications}
                    createItem={createPIPublication}
                    fields={conferencePublicationFields}
                    onChange={setConferencePublications}
                  />
                )}

                {piPublicationTab === 'book' && (
                  <DynamicProfileRepeater
                    title="Book Chapters"
                    addLabel="Add Book Chapter"
                    emptyText="No book chapters listed."
                    items={bookChapters}
                    createItem={createPIPublication}
                    fields={bookChapterFields}
                    onChange={setBookChapters}
                  />
                )}

                {piPublicationTab === 'patent' && (
                  <DynamicProfileRepeater
                    title="Patents"
                    addLabel="Add Patent"
                    emptyText="No patents listed."
                    items={patents}
                    createItem={createPIPublication}
                    fields={patentFields}
                    onChange={setPatents}
                  />
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition disabled:bg-gray-400"
                >
                  <Save className="h-5 w-5" />
                  {saving ? 'Saving changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
