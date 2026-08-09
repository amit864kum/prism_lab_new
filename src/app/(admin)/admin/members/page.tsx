'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import SafeImage from '@/components/ui/SafeImage'
import RichTextEditor from '@/components/admin/LazyRichTextEditor'
import { Users, Plus, Trash2, Edit2, Search, Mail, BookOpen, Globe, FileText } from 'lucide-react'
import { MEMBER_ROLES, MEMBER_ROLE_LABELS, type MemberRole, type MemberStatus } from '@/lib/member-options'
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
  email?: string
  linkedinUrl?: string
  googleScholarUrl?: string
  personalPortfolioWebsite?: string
  resumePdf?: string
  displayOrder?: number
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('All')

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
  const [email, setEmail] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [googleScholarUrl, setGoogleScholarUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [personalPortfolioWebsite, setPersonalPortfolioWebsite] = useState('')
  const [resumePdf, setResumePdf] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')

  const [manualSlug, setManualSlug] = useState(false)

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members')
      const data = await res.json()
      if (res.ok) {
        setMembers(data.members || [])
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
    setStatus(m.status)
    setYearJoined(m.yearJoined ? String(m.yearJoined) : '')
    setYearLeft(m.yearLeft ? String(m.yearLeft) : '')
    setImageUrl(m.imageUrl || '')
    setBio(m.bio || '')
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
        showFeedback(data.error || 'Failed to save member', 'error')
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
    const matchesRole = filterRole === 'All' || m.role === filterRole
    return matchesSearch && matchesRole
  })

  const groupedMembers = MEMBER_ROLES.reduce((acc, currentRole) => {
    const roleMembers = filteredMembers
      .filter((member) => member.role === currentRole)
      .sort((a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999))
    if (roleMembers.length > 0) acc[currentRole] = roleMembers
    return acc
  }, {} as Record<MemberRole, Member[]>)

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
                placeholder="e.g. Amit Kumar"
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
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                >
                  {MEMBER_ROLES.map((memberRole) => (
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
                  <option value="current">Current Member</option>
                  <option value="alumni">Alumni</option>
                  <option value="completed">Completed</option>
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
                  type="url"
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
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                >
                  <option value="All">All Roles</option>
                  {MEMBER_ROLES.map((memberRole) => (
                    <option key={memberRole} value={memberRole}>
                      {MEMBER_ROLE_LABELS[memberRole]}
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
                {Object.entries(groupedMembers).map(([groupRole, roleMembers]) => (
                  <div key={groupRole} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h3 className="text-sm font-extrabold text-gray-900">
                        {MEMBER_ROLE_LABELS[groupRole as MemberRole]} ({roleMembers.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {roleMembers.map((member) => (
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
                                {member.status}
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
