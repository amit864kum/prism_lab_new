'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import SafeImage from '@/components/ui/SafeImage'
import RichTextEditor from '@/components/admin/LazyRichTextEditor'
import { Users, Plus, Trash2, Edit2, Search, Mail, BookOpen, Globe, FileText, X } from 'lucide-react'
import { MEMBER_ROLES, MEMBER_ROLE_LABELS, type MemberRole, type MemberStatus } from '@/lib/member-options'
import { isVisibleAdminMember } from '@/lib/admin-member-visibility'
import { getPublicationTypeLabel, PUBLICATION_TYPES, type PublicationType } from '@/lib/publication-types'
import {
  ADMIN_MEMBER_GROUPS,
  getAdminMemberGroupKey,
  getAdminMemberStatusLabel,
  getAdminMemberStatusOptions,
  normalizeStatusForRole,
  type AdminMemberGroupKey,
} from '@/lib/admin-member-groups'
import { Github } from 'lucide-react'

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2005/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

interface Member {
  githubUrl: string
  _id: string
  name: string
  slug: string
  role: MemberRole
  status: MemberStatus
  yearJoined?: number
  yearLeft?: number
  imageUrl?: string
  bio?: string
  thesisTitle?: string
  currentPosition?: string
  email?: string
  linkedinUrl?: string
  googleScholarUrl?: string
  personalPortfolioWebsite?: string
  resumePdf?: string
  displayOrder?: number
}

interface ApiValidationIssue {
  path?: Array<string | number>
  message?: string
}

const MEMBER_FIELD_LABELS: Record<string, string> = {
  name: 'Full Name',
  slug: 'SEO URL Slug',
  role: 'Lab Role',
  status: 'Status',
  yearJoined: 'Year Joined',
  yearLeft: 'Year Left',
  thesisTitle: 'Thesis Title',
  currentPosition: 'Current Position',
  email: 'Email Address',
  linkedinUrl: 'LinkedIn Link',
  googleScholarUrl: 'Google Scholar Link',
  githubUrl: 'GitHub Link',
  personalPortfolioWebsite: 'Personal Portfolio Website',
  displayOrder: 'Display Order',
}

function getMemberSaveError(data: {
  error?: string
  details?: ApiValidationIssue[]
}) {
  if (!Array.isArray(data.details) || data.details.length === 0) {
    return data.error || 'Failed to save member'
  }

  return data.details
    .slice(0, 3)
    .map((issue) => {
      const field = String(issue.path?.[0] || '')
      const label = MEMBER_FIELD_LABELS[field]
      return label ? `${label}: ${issue.message || 'Invalid value'}` : issue.message || 'Invalid value'
    })
    .join(' • ')
}

const ADMIN_MEMBER_ROLES = MEMBER_ROLES.filter(
  (memberRole): memberRole is Exclude<MemberRole, 'Intern'> => memberRole !== 'Intern'
)

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGroup, setFilterGroup] = useState<'All' | AdminMemberGroupKey>('All')

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [role, setRole] = useState<MemberRole>('PhD Scholar')
  const [status, setStatus] = useState<MemberStatus>('current')
  const [yearJoined, setYearJoined] = useState('')
  const [yearLeft, setYearLeft] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [bio, setBio] = useState('')
  const [thesisTitle, setThesisTitle] = useState('')
  const [currentPosition, setCurrentPosition] = useState('')
  const [email, setEmail] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [googleScholarUrl, setGoogleScholarUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [personalPortfolioWebsite, setPersonalPortfolioWebsite] = useState('')
  const [resumePdf, setResumePdf] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')

  // Profile-only publication form states
  const [publicationMember, setPublicationMember] = useState<Member | null>(null)
  const [publicationSubmitting, setPublicationSubmitting] = useState(false)
  const [publicationTitle, setPublicationTitle] = useState('')
  const [publicationType, setPublicationType] = useState<PublicationType>('journal')
  const [publicationYear, setPublicationYear] = useState(String(new Date().getFullYear()))
  const [publicationVenue, setPublicationVenue] = useState('')
  const [publicationLink, setPublicationLink] = useState('')
  const [publicationPdfUrl, setPublicationPdfUrl] = useState('')
  const [publicationDescription, setPublicationDescription] = useState('')
  const [publicationExternalAuthors, setPublicationExternalAuthors] = useState('')
  const [publicationCoAuthors, setPublicationCoAuthors] = useState<string[]>([])

  const [manualSlug, setManualSlug] = useState(false)

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members')
      const data = await res.json()
      if (res.ok) {
        setMembers(
          (data.members || []).filter(isVisibleAdminMember)
        )
      } else {
        showFeedback(data.error || 'Failed to fetch members list', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching members from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!manualSlug && !editId) {
      setSlug(slugify(val))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(e.target.value))
    setManualSlug(true)
  }

  const resetPublicationForm = (close = false) => {
    setPublicationTitle('')
    setPublicationType('journal')
    setPublicationYear(String(new Date().getFullYear()))
    setPublicationVenue('')
    setPublicationLink('')
    setPublicationPdfUrl('')
    setPublicationDescription('')
    setPublicationExternalAuthors('')
    setPublicationCoAuthors([])
    if (close) setPublicationMember(null)
  }

  const openPublicationForm = (member: Member) => {
    resetPublicationForm()
    setPublicationMember(member)
    window.requestAnimationFrame(() => {
      document.getElementById('member-publication-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const togglePublicationCoAuthor = (memberId: string) => {
    setPublicationCoAuthors((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    )
  }

  const handlePublicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicationMember) return

    const trimmedTitle = publicationTitle.trim()
    if (!trimmedTitle) {
      showFeedback('Publication title is required', 'error')
      return
    }

    const year = Number(publicationYear)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      showFeedback('Enter a valid publication year between 2000 and 2100', 'error')
      return
    }

    if (
      (publicationType === 'journal' || publicationType === 'conference') &&
      !publicationVenue.trim()
    ) {
      showFeedback(
        publicationType === 'journal' ? 'Journal name is required' : 'Conference name is required',
        'error'
      )
      return
    }

    const uniqueSuffix = Date.now().toString(36)
    const authors = Array.from(new Set([publicationMember._id, ...publicationCoAuthors]))
    const referenceLink = publicationLink.trim()
    const payload = {
      title: trimmedTitle,
      slug: `${slugify(trimmedTitle) || 'publication'}-${uniqueSuffix}`,
      type: publicationType,
      authors,
      externalAuthors: publicationExternalAuthors
        .split(',')
        .map((author) => author.trim())
        .filter(Boolean),
      researchAreas: [],
      year,
      venue:
        publicationType === 'journal' ? undefined : publicationVenue.trim() || undefined,
      journalName: publicationType === 'journal' ? publicationVenue.trim() : undefined,
      doiLink:
        !['dataset', 'invited-talk'].includes(publicationType) && referenceLink
          ? referenceLink
          : undefined,
      datasetLink: publicationType === 'dataset' && referenceLink ? referenceLink : undefined,
      externalUrl:
        publicationType === 'invited-talk' && referenceLink ? referenceLink : undefined,
      description: publicationDescription.trim() || undefined,
      pdfUrl: publicationPdfUrl || undefined,
      tags: [],
      profileOnly: true,
    }

    setPublicationSubmitting(true)
    try {
      const res = await fetch('/api/member-publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        const validationMessage = data.details?.[0]?.message
        showFeedback(validationMessage || data.error || 'Failed to add publication', 'error')
        return
      }

      showFeedback(
        `Publication added to ${authors.length} selected member profile${authors.length === 1 ? '' : 's'}.`,
        'success'
      )
      resetPublicationForm(true)
      fetchMembers()
    } catch {
      showFeedback('An error occurred while adding the publication', 'error')
    } finally {
      setPublicationSubmitting(false)
    }
  }

  const resetForm = () => {
    setEditId(null)
    setName('')
    setSlug('')
    setRole('PhD Scholar')
    setStatus('current')
    setYearJoined('')
    setYearLeft('')
    setImageUrl('')
    setBio('')
    setThesisTitle('')
    setCurrentPosition('')
    setEmail('')
    setLinkedinUrl('')
    setGoogleScholarUrl('')
    setGithubUrl('')
    setPersonalPortfolioWebsite('')
    setResumePdf('')
    setDisplayOrder('')
    setManualSlug(false)
  }

  const handleEdit = (m: Member) => {
    setEditId(m._id)
    setName(m.name)
    setSlug(m.slug)
    setRole(m.role)
    setStatus(normalizeStatusForRole(m.role, m.status))
    setYearJoined(m.yearJoined ? String(m.yearJoined) : '')
    setYearLeft(m.yearLeft ? String(m.yearLeft) : '')
    setImageUrl(m.imageUrl || '')
    setBio(m.bio || '')
    setThesisTitle(m.thesisTitle || '')
    setCurrentPosition(m.currentPosition || '')
    setEmail(m.email || '')
    setLinkedinUrl(m.linkedinUrl || '')
    setGoogleScholarUrl(m.googleScholarUrl || '')
    setGithubUrl(m.githubUrl || '')
    setPersonalPortfolioWebsite(m.personalPortfolioWebsite || '')
    setResumePdf(m.resumePdf || '')
    setDisplayOrder(m.displayOrder ? String(m.displayOrder) : '')
    setManualSlug(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return

    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('Member removed successfully', 'success')
        fetchMembers()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to remove member', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred during deletion', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showFeedback('Name is required', 'error')
      return
    }
    if (!slug.trim()) {
      showFeedback('Slug is required', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      name,
      slug,
      role,
      status,
      yearJoined: yearJoined ? Number(yearJoined) : undefined,
      yearLeft: yearLeft ? Number(yearLeft) : undefined,
      imageUrl: imageUrl || undefined,
      bio: bio || undefined,
      thesisTitle: thesisTitle || undefined,
      currentPosition: currentPosition || undefined,
      email: email || undefined,
      linkedinUrl: linkedinUrl || undefined,
      googleScholarUrl: googleScholarUrl || undefined,
      githubUrl: githubUrl || undefined,
      personalPortfolioWebsite: personalPortfolioWebsite || undefined,
      resumePdf: resumePdf || undefined,
      displayOrder: displayOrder ? Number(displayOrder) : undefined,
    }

    try {
      const url = editId ? `/api/members/${editId}` : '/api/members'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'Member details updated successfully!' : 'Member added successfully!',
          'success'
        )
        resetForm()
        fetchMembers()
      } else {
        showFeedback(getMemberSaveError(data), 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGroup =
      filterGroup === 'All' || getAdminMemberGroupKey(m) === filterGroup
    return matchesSearch && matchesGroup
  })

  const groupedMembers = ADMIN_MEMBER_GROUPS.map((group) => ({
    ...group,
    members: filteredMembers
      .filter((member) => getAdminMemberGroupKey(member) === group.key)
      .sort((a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999)),
  })).filter((group) => group.members.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-500" />
            Lab Members
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage lab researchers, PhD scholars, students, and alumni.
          </p>
        </div>
        {editId && (
          <button
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 font-semibold transition"
          >
            Cancel Edit & Add New
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md text-sm font-medium ${message.type === 'success'
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit Member Details' : 'Add New Member'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                placeholder="e.g. Shubham Kumar"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                SEO Url Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={handleSlugChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="amit-kumar"
              />
              <p className="text-xs text-gray-400 mt-1">
                Autogenerated. URL path: `/people/current-members/[id]`
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Lab Role
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const nextRole = e.target.value as MemberRole
                    setRole(nextRole)
                    setStatus((currentStatus) =>
                      normalizeStatusForRole(nextRole, currentStatus)
                    )
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                >
                  {ADMIN_MEMBER_ROLES.map((memberRole) => (
                    <option key={memberRole} value={memberRole}>
                      {MEMBER_ROLE_LABELS[memberRole]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const val = e.target.value as any
                    setStatus(val)
                    if (val === 'current') setYearLeft('')
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                >
                  {getAdminMemberStatusOptions(role).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Year Joined
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={yearJoined}
                  onChange={(e) => setYearJoined(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="e.g. 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Year Left
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={yearLeft}
                  onChange={(e) => setYearLeft(e.target.value)}
                  disabled={status === 'current'}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="e.g. 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div>
              <FileUpload
                label="Profile Picture (Optional)"
                value={imageUrl}
                onChange={setImageUrl}
                type="image"
                subfolder="members"
              />
            </div>

            {status !== 'current' && (
              <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Alumni Details</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    These details are shown on the public Alumni cards.
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Thesis Title
                  </label>
                  <textarea
                    rows={2}
                    value={thesisTitle}
                    onChange={(event) => setThesisTitle(event.target.value)}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Enter the thesis title"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Current Position
                  </label>
                  <input
                    type="text"
                    value={currentPosition}
                    onChange={(event) => setCurrentPosition(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="e.g. Research Engineer, Organization"
                  />
                </div>
              </div>
            )}

            <div>
              <FileUpload
                label="Resume PDF (Optional)"
                value={resumePdf}
                onChange={setResumePdf}
                type="pdf"
                subfolder="resumes"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Biography Details
              </label>
              <RichTextEditor value={bio} onChange={setBio} />
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-800">Links / Contact</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                  placeholder="e.g. amit@iitp.ac.in"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    LinkedIn Link
                  </label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Google Scholar Link
                  </label>
                  <input
                    type="text"
                    value={googleScholarUrl}
                    onChange={(e) => setGoogleScholarUrl(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                    placeholder="https://scholar.google.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  GitHub Link
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Personal Portfolio Website
                </label>
                <input
                  type="text"
                  inputMode="url"
                  value={personalPortfolioWebsite}
                  onChange={(e) => setPersonalPortfolioWebsite(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : editId ? 'Update Member' : 'Add Member'}
            </button>
          </form>
        </div>

        {/* Directory Listing */}
        <div className="xl:col-span-2 space-y-4">
          {publicationMember && (
            <div
              id="member-publication-form"
              className="scroll-mt-24 rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Add Profile Publication
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    This publication will appear on <strong>{publicationMember.name}</strong>&apos;s
                    profile and any additional member profiles selected below. It will not appear in
                    the global Publications page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => resetPublicationForm(true)}
                  className="rounded-lg border border-gray-300 bg-white p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Close publication form"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handlePublicationSubmit} className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Publication Title
                  </label>
                  <input
                    type="text"
                    required
                    value={publicationTitle}
                    onChange={(e) => setPublicationTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the publication title"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Publication Type
                    </label>
                    <select
                      value={publicationType}
                      onChange={(e) => setPublicationType(e.target.value as PublicationType)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PUBLICATION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {getPublicationTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Publication Year
                    </label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={2100}
                      value={publicationYear}
                      onChange={(e) => setPublicationYear(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      {publicationType === 'journal'
                        ? 'Journal Name'
                        : publicationType === 'conference'
                          ? 'Conference Name'
                          : 'Venue / Publisher (Optional)'}
                    </label>
                    <input
                      type="text"
                      required={publicationType === 'journal' || publicationType === 'conference'}
                      value={publicationVenue}
                      onChange={(e) => setPublicationVenue(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter journal, conference, or venue"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      DOI / Reference Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={publicationLink}
                      onChange={(e) => setPublicationLink(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://doi.org/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    External Authors (Optional)
                  </label>
                  <input
                    type="text"
                    value={publicationExternalAuthors}
                    onChange={(e) => setPublicationExternalAuthors(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Separate names with commas"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={publicationDescription}
                    onChange={(e) => setPublicationDescription(e.target.value)}
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Short publication description"
                  />
                </div>

                <FileUpload
                  label="Publication PDF (Optional)"
                  value={publicationPdfUrl}
                  onChange={setPublicationPdfUrl}
                  type="pdf"
                  subfolder="publications"
                />

                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-gray-700">
                    Also show on other member profiles (Optional)
                  </legend>
                  <div className="max-h-52 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
                    {members
                      .filter((member) => member._id !== publicationMember._id)
                      .map((member) => (
                        <label
                          key={member._id}
                          className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={publicationCoAuthors.includes(member._id)}
                            onChange={() => togglePublicationCoAuthor(member._id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium">{member.name}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {MEMBER_ROLE_LABELS[member.role]}
                          </span>
                        </label>
                      ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={publicationSubmitting}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {publicationSubmitting ? 'Adding Publication...' : 'Add to Selected Profiles'}
                  </button>
                  <a
                    href={`/people/current-members/${publicationMember.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View {publicationMember.name}&apos;s profile
                  </a>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900">Lab Directory</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={filterGroup}
                  onChange={(e) =>
                    setFilterGroup(e.target.value as 'All' | AdminMemberGroupKey)
                  }
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                >
                  <option value="All">All Categories</option>
                  {ADMIN_MEMBER_GROUPS.map((group) => (
                    <option key={group.key} value={group.key}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500 font-medium">Loading members...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-medium">
                No members found matching the selected filters.
              </div>
            ) : (
              <div className="space-y-8">
                {groupedMembers.map((group) => (
                  <div key={group.key} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h3 className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        {group.label} ({group.members.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {group.members.map((member) => (
                        <div key={member._id} className="py-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                          <div className="h-16 w-16 relative rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                            {member.imageUrl ? (
                              <SafeImage
                                src={member.imageUrl}
                                alt={member.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Users className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-grow space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${member.status === 'current'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-150 text-gray-800'
                                  }`}
                              >
                                {getAdminMemberStatusLabel(member)}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-blue-600">
                              {MEMBER_ROLE_LABELS[member.role]}
                              {member.displayOrder && <span className="text-gray-400"> &bull; Order {member.displayOrder}</span>}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 font-medium">
                              {member.yearJoined && (
                                <span>
                                  Joined: <strong className="text-gray-600 font-semibold">{member.yearJoined}</strong>
                                </span>
                              )}
                              {member.status === 'alumni' && member.yearLeft && (
                                <span>
                                  Left: <strong className="text-gray-600 font-semibold">{member.yearLeft}</strong>
                                </span>
                              )}
                              {member.status === 'completed' && (
                                <span>
                                  Completed{member.yearLeft ? ': ' : ''}
                                  {member.yearLeft && <strong className="text-gray-600 font-semibold">{member.yearLeft}</strong>}
                                </span>
                              )}
                            </div>
                            {/* Contact shortcuts */}
                            <div className="flex gap-3 pt-1">
                              {member.email && (
                                <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-blue-500" title="Email">
                                  <Mail className="h-4 w-4" />
                                </a>
                              )}
                              {member.linkedinUrl && (
                                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-550" title="LinkedIn">
                                  <Linkedin className="h-4 w-4" />
                                </a>
                              )}
                              {member.googleScholarUrl && (
                                <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-550" title="Google Scholar">
                                  <BookOpen className="h-4 w-4" />
                                </a>
                              )}
                              {member.githubUrl && (
                                <a
                                  href={member.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-blue-550"
                                  title="GitHub"
                                >
                                  <Github className="h-4 w-4" />
                                </a>
                              )}
                              {member.personalPortfolioWebsite && (
                                <a href={member.personalPortfolioWebsite} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-550" title="Portfolio">
                                  <Globe className="h-4 w-4" />
                                </a>
                              )}
                              {member.resumePdf && (
                                <a href={member.resumePdf} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-550" title="Resume PDF">
                                  <FileText className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => openPublicationForm(member)}
                              className="p-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                              title="Add profile publication"
                              aria-label={`Add publication to ${member.name}'s profile`}
                            >
                              <BookOpen className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(member)}
                              className="p-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg hover:text-blue-600 transition"
                              title="Edit Member"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(member._id)}
                              className="p-2 border border-gray-300 hover:bg-rose-50 text-gray-600 rounded-lg hover:text-rose-600 transition"
                              title="Delete Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
