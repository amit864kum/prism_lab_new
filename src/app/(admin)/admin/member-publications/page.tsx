'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import FileUpload from '@/components/admin/FileUpload'
import {
  BookOpen,
  CheckCircle,
  Edit2,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import {
  getPublicationTypeLabel,
  PUBLICATION_TYPES,
  type PublicationType,
} from '@/lib/publication-types'
import { isSelectableAdminPublicationMember } from '@/lib/admin-member-visibility'

interface Member {
  _id: string
  name: string
  slug: string
  role: string
  status: string
}

interface ProfilePublication {
  _id: string
  title: string
  slug: string
  type: PublicationType
  authors: Member[]
  externalAuthors?: string[]
  year: number
  venue?: string
  journalName?: string
  doiLink?: string
  description?: string
  datasetLink?: string
  date?: string
  location?: string
  talkType?: string
  displayOrder?: number
  abstract?: string
  pdfUrl?: string
  externalUrl?: string
  tags?: string[]
  profileOnly: true
}

const currentYear = new Date().getFullYear()

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function emptyForm(type: PublicationType = 'journal') {
  return {
    title: '',
    slug: '',
    type,
    authors: [] as string[],
    externalAuthors: '',
    year: currentYear,
    venue: '',
    referenceLink: '',
    description: '',
    pdfUrl: '',
  }
}

export default function MemberPublicationsPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [publications, setPublications] = useState<ProfilePublication[]>([])
  const [form, setForm] = useState(emptyForm())
  const [editId, setEditId] = useState<string | null>(null)
  const [manualSlug, setManualSlug] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    window.setTimeout(() => setMessage({ text: '', type: '' }), 4500)
  }

  const loadData = async () => {
    try {
      const [publicationResponse, memberResponse] = await Promise.all([
        fetch('/api/member-publications?limit=100'),
        fetch('/api/members?limit=100'),
      ])
      const [publicationData, memberData] = await Promise.all([
        publicationResponse.json(),
        memberResponse.json(),
      ])

      if (!publicationResponse.ok) {
        showFeedback(publicationData.error || 'Unable to load member publications.', 'error')
      } else {
        setPublications(publicationData.publications || [])
      }

      if (!memberResponse.ok) {
        showFeedback(memberData.error || 'Unable to load members.', 'error')
      } else {
        setMembers((memberData.members || []).filter(isSelectableAdminPublicationMember))
      }
    } catch {
      showFeedback('Unable to load member publication data.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((current) => ({ ...current, ...updates }))
  }

  const resetForm = () => {
    setEditId(null)
    setManualSlug(false)
    setForm(emptyForm())
  }

  const toggleMember = (memberId: string) => {
    updateForm({
      authors: form.authors.includes(memberId)
        ? form.authors.filter((id) => id !== memberId)
        : [...form.authors, memberId],
    })
  }

  const handleEdit = (publication: ProfilePublication) => {
    setEditId(publication._id)
    setManualSlug(true)
    setForm({
      title: publication.title,
      slug: publication.slug,
      type: publication.type,
      authors: publication.authors.map((author) => author._id),
      externalAuthors: (publication.externalAuthors || []).join(', '),
      year: publication.year,
      venue: publication.journalName || publication.venue || '',
      referenceLink:
        publication.doiLink || publication.datasetLink || publication.externalUrl || '',
      description: publication.description || publication.abstract || '',
      pdfUrl: publication.pdfUrl || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validateForm = () => {
    if (!form.title.trim()) return 'Publication title is required.'
    if (!form.slug.trim()) return 'Publication slug is required.'
    if (form.authors.length === 0) return 'Select at least one member profile.'
    if (!Number.isInteger(form.year) || form.year < 2000 || form.year > 2100) {
      return 'Enter a valid year between 2000 and 2100.'
    }
    if ((form.type === 'journal' || form.type === 'conference') && !form.venue.trim()) {
      return form.type === 'journal' ? 'Journal name is required.' : 'Conference name is required.'
    }
    if (form.referenceLink.trim() && !form.referenceLink.startsWith('http')) {
      return 'Reference link must be a valid http(s) URL.'
    }
    return ''
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      showFeedback(validationError, 'error')
      return
    }

    const referenceLink = form.referenceLink.trim()
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      type: form.type,
      authors: form.authors,
      externalAuthors: form.externalAuthors
        .split(',')
        .map((author) => author.trim())
        .filter(Boolean),
      researchAreas: [],
      year: Number(form.year),
      venue: form.type === 'journal' ? undefined : form.venue.trim() || undefined,
      journalName: form.type === 'journal' ? form.venue.trim() : undefined,
      doiLink:
        !['dataset', 'invited-talk'].includes(form.type) && referenceLink
          ? referenceLink
          : undefined,
      datasetLink: form.type === 'dataset' && referenceLink ? referenceLink : undefined,
      externalUrl: form.type === 'invited-talk' && referenceLink ? referenceLink : undefined,
      description: form.description.trim() || undefined,
      pdfUrl: form.pdfUrl || undefined,
      tags: [],
      profileOnly: true,
    }

    setSubmitting(true)
    try {
      const response = await fetch(
        editId ? `/api/member-publications/${editId}` : '/api/member-publications',
        {
          method: editId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        showFeedback(data.details?.[0]?.message || data.error || 'Unable to save publication.', 'error')
        return
      }

      showFeedback(
        editId
          ? 'Member publication updated. You remain on this admin page.'
          : 'Member publication created. You remain on this admin page.',
        'success'
      )
      resetForm()
      await loadData()
    } catch {
      showFeedback('Unable to save the member publication.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (publication: ProfilePublication) => {
    if (!window.confirm(`Delete “${publication.title}” from all linked member profiles?`)) return

    try {
      const response = await fetch(`/api/member-publications/${publication._id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) {
        showFeedback(data.error || 'Unable to delete publication.', 'error')
        return
      }
      showFeedback('Member publication deleted.', 'success')
      if (editId === publication._id) resetForm()
      await loadData()
    } catch {
      showFeedback('Unable to delete the member publication.', 'error')
    }
  }

  const filteredPublications = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return publications
    return publications.filter((publication) =>
      `${publication.title} ${publication.authors.map((author) => author.name).join(' ')}`
        .toLowerCase()
        .includes(query)
    )
  }, [publications, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-gray-900">
          <UserRound className="h-8 w-8 text-blue-500" />
          Member Publications
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create publications that appear only on selected member profiles. Saving never redirects
          to the public Publications page.
        </p>
      </div>

      {message.text && (
        <div
          role="status"
          className={`flex items-center gap-2 rounded-lg border-l-4 p-4 text-sm font-semibold ${
            message.type === 'success'
              ? 'border-green-500 bg-green-50 text-green-800'
              : 'border-red-500 bg-red-50 text-red-800'
          }`}
        >
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Plus className="h-5 w-5 text-blue-500" />
                {editId ? 'Edit Member Publication' : 'Add Member Publication'}
              </h2>
              <p className="mt-1 text-xs text-gray-500">Select every profile where it should appear.</p>
            </div>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                aria-label="Cancel publication edit"
                className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Title</span>
            <input
              required
              value={form.title}
              onChange={(event) =>
                updateForm({
                  title: event.target.value,
                  slug: !manualSlug && !editId ? slugify(event.target.value) : form.slug,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Publication title"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Slug</span>
            <input
              required
              value={form.slug}
              onChange={(event) => {
                setManualSlug(true)
                updateForm({ slug: slugify(event.target.value) })
              }}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="publication-title"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="mb-1 block text-sm font-semibold text-gray-700">Type</span>
              <select
                value={form.type}
                onChange={(event) => updateForm({ type: event.target.value as PublicationType })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PUBLICATION_TYPES.map((type) => (
                  <option key={type} value={type}>{getPublicationTypeLabel(type)}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-sm font-semibold text-gray-700">Year</span>
              <input
                type="number"
                min={2000}
                max={2100}
                required
                value={form.year}
                onChange={(event) => updateForm({ year: Number(event.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">
              {form.type === 'journal'
                ? 'Journal Name'
                : form.type === 'conference'
                  ? 'Conference Name'
                  : 'Venue / Publisher (Optional)'}
            </span>
            <input
              value={form.venue}
              required={form.type === 'journal' || form.type === 'conference'}
              onChange={(event) => updateForm({ venue: event.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">
              DOI / Dataset / Reference Link (Optional)
            </span>
            <input
              type="url"
              value={form.referenceLink}
              onChange={(event) => updateForm({ referenceLink: event.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">External Authors</span>
            <input
              value={form.externalAuthors}
              onChange={(event) => updateForm({ externalAuthors: event.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Separate names with commas"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => updateForm({ description: event.target.value })}
              className="w-full resize-y rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <FileUpload
            label="Publication PDF (Optional)"
            value={form.pdfUrl}
            onChange={(pdfUrl) => updateForm({ pdfUrl })}
            type="pdf"
            subfolder="publications"
          />

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-gray-700">Member Profiles</legend>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-3">
              {members.length === 0 ? (
                <p className="text-xs italic text-gray-500">No members available.</p>
              ) : (
                members.map((member) => (
                  <label
                    key={member._id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-2 text-sm ring-1 ring-gray-100 hover:ring-blue-200"
                  >
                    <input
                      type="checkbox"
                      checked={form.authors.includes(member._id)}
                      onChange={() => toggleMember(member._id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-gray-900">{member.name}</span>
                      <span className="block truncate text-xs text-gray-500">{member.role}</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {submitting ? 'Saving...' : editId ? 'Update Member Publication' : 'Add to Selected Profiles'}
          </button>
        </form>

        <section className="space-y-4 xl:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Profile-only Publications</h2>
                <p className="text-xs text-gray-500">
                  {filteredPublications.length} record{filteredPublications.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search title or member..."
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
              Loading member publications...
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
              No profile-only publications found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPublications.map((publication) => (
                <article
                  key={publication._id}
                  className="publication-hover-card rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                          {getPublicationTypeLabel(publication.type)}
                        </span>
                        <span className="text-xs font-bold text-gray-400">{publication.year}</span>
                      </div>
                      <h3 className="font-extrabold leading-snug text-gray-950">{publication.title}</h3>
                      {(publication.journalName || publication.venue) && (
                        <p className="text-xs italic text-gray-500">
                          {publication.journalName || publication.venue}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {publication.authors.map((author) => (
                          <Link
                            key={author._id}
                            href={`/people/current-members/${author.slug || author._id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            {author.name}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(publication)}
                        aria-label={`Edit ${publication.title}`}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(publication)}
                        aria-label={`Delete ${publication.title}`}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        <BookOpen className="mr-2 inline h-4 w-4" />
        Publications created here are excluded from the main <strong>/publications</strong> page and
        appear only on the selected member profiles.
      </div>
    </div>
  )
}
