'use client'

import { useEffect, useMemo, useState } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import SafeImage from '@/components/ui/SafeImage'
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit2,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import {
  getPublicationTypeLabel,
  PUBLICATION_TYPES,
  type PublicationType,
} from '@/lib/publication-types'

interface Member {
  _id: string
  name: string
  role: string
  status: string
  imageUrl?: string
}

interface ResearchArea {
  _id: string
  title: string
  slug: string
}

interface Publication {
  _id: string
  title: string
  slug: string
  type: PublicationType
  authors: Member[]
  externalAuthors?: string[]
  researchAreas?: ResearchArea[]
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
  tags: string[]
}

const categoryTabs: PublicationType[] = [...PUBLICATION_TYPES]

const categoryHelp: Record<PublicationType, string> = {
  journal: 'Table-based journal publications with DOI, journal name, PDF, and author selection.',
  conference: 'Conference papers with proceedings/venue details, DOI, PDF, and external links.',
  'book-chapter': 'Book chapters and edited-volume contributions with PDF/link support.',
  dataset: 'Dataset records with description, dataset URL, DOI, PDF, and card preview.',
  patent: 'Patent records with inventors, year, document links, and ordering.',
  'invited-talk': 'Invited talks with date, location, talk type, and card preview.',
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

function createEmptyForm(type: PublicationType) {
  return {
    title: '',
    slug: '',
    type,
    selectedAuthors: [] as string[],
    externalAuthors: [''] as string[],
    selectedResearchAreas: [] as string[],
    year: currentYear,
    venue: '',
    journalName: '',
    doiLink: '',
    description: '',
    datasetLink: '',
    date: '',
    location: '',
    talkType: '',
    displayOrder: undefined as number | undefined,
    abstract: '',
    pdfUrl: '',
    externalUrl: '',
    tagsInput: '',
  }
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([])
  const [activeTab, setActiveTab] = useState<PublicationType>('journal')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [manualSlug, setManualSlug] = useState(false)
  const [form, setForm] = useState(createEmptyForm('journal'))

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const fetchData = async () => {
    try {
      const [pubRes, memRes, areaRes] = await Promise.all([
        fetch('/api/publications'),
        fetch('/api/members'),
        fetch('/api/research-areas'),
      ])
      const [pubData, memData, areaData] = await Promise.all([
        pubRes.json(),
        memRes.json(),
        areaRes.json(),
      ])

      if (pubRes.ok) {
        setPublications(pubData.publications || [])
      } else {
        showFeedback(pubData.error || 'Failed to fetch publications', 'error')
      }

      if (memRes.ok) {
        setMembers(memData.members || [])
      }

      if (areaRes.ok) {
        setResearchAreas(areaData.researchAreas || [])
      }
    } catch {
      showFeedback('Error loading publication data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activePublications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return publications
      .filter((pub) => pub.type === activeTab)
      .filter((pub) => {
        if (!query) return true
        const authorText = pub.authors.map((author) => author.name).join(' ').toLowerCase()
        return `${pub.title} ${pub.venue || ''} ${pub.journalName || ''} ${authorText}`
          .toLowerCase()
          .includes(query)
      })
      .sort((a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999) || b.year - a.year)
  }, [activeTab, publications, searchTerm])

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  const handleTabChange = (type: PublicationType) => {
    setActiveTab(type)
    setEditId(null)
    setManualSlug(false)
    setSearchTerm('')
    setForm(createEmptyForm(type))
  }

  const resetForm = () => {
    setEditId(null)
    setManualSlug(false)
    setForm(createEmptyForm(activeTab))
  }

  const handleTitleChange = (value: string) => {
    updateForm({
      title: value,
      slug: !manualSlug && !editId ? slugify(value) : form.slug,
    })
  }

  const toggleAuthor = (memberId: string) => {
    const selectedAuthors = form.selectedAuthors.includes(memberId)
      ? form.selectedAuthors.filter((id) => id !== memberId)
      : [...form.selectedAuthors, memberId]
    updateForm({ selectedAuthors })
  }

  const toggleResearchArea = (areaId: string) => {
    const selectedResearchAreas = form.selectedResearchAreas.includes(areaId)
      ? form.selectedResearchAreas.filter((id) => id !== areaId)
      : [...form.selectedResearchAreas, areaId]
    updateForm({ selectedResearchAreas })
  }

  const handleEdit = (publication: Publication) => {
    setActiveTab(publication.type)
    setEditId(publication._id)
    setManualSlug(true)
    setForm({
      title: publication.title || '',
      slug: publication.slug || '',
      type: publication.type,
      selectedAuthors: publication.authors.map((author) => author._id),
      externalAuthors:
        publication.externalAuthors || [''],
      selectedResearchAreas: (publication.researchAreas || []).map((area) => area._id),
      year: publication.year || currentYear,
      venue: publication.venue || '',
      journalName: publication.journalName || publication.venue || '',
      doiLink: publication.doiLink || '',
      description: publication.description || publication.abstract || '',
      datasetLink: publication.datasetLink || '',
      date: publication.date || '',
      location: publication.location || '',
      talkType: publication.talkType || '',
      displayOrder: publication.displayOrder,
      abstract: publication.abstract || '',
      pdfUrl: publication.pdfUrl || '',
      externalUrl: publication.externalUrl || '',
      tagsInput: publication.tags?.join(', ') || '',
    })
  }

  const validateForm = () => {
    if (!form.title.trim()) return 'Title is required.'
    if (!form.slug.trim()) return 'Slug is required.'
    if (form.selectedAuthors.length === 0) return 'Select at least one author.'
    if (!form.year) return 'Year is required.'
    if (form.type === 'journal' && !form.journalName.trim()) return 'Journal name is required.'
    if (form.type === 'conference' && !form.venue.trim()) return 'Conference name is required.'
    if (form.doiLink.trim() && !form.doiLink.startsWith('http')) return 'DOI link must be a valid URL.'
    if (form.externalUrl.trim() && !form.externalUrl.startsWith('http')) return 'External link must be a valid URL.'
    if (form.datasetLink.trim() && !form.datasetLink.startsWith('http')) return 'Dataset link must be a valid URL.'
    return ''
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      showFeedback(validationError, 'error')
      return
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      type: form.type,
      authors: form.selectedAuthors,
      externalAuthors:
        form.externalAuthors
          .map((author) => author.trim())
          .filter(Boolean),
      researchAreas: form.selectedResearchAreas,
      year: Number(form.year),
      venue: form.venue.trim() || undefined,
      journalName: form.journalName.trim() || undefined,
      doiLink: form.doiLink.trim() || undefined,
      description: form.description.trim() || undefined,
      datasetLink: form.datasetLink.trim() || undefined,
      date: form.date.trim() || undefined,
      location: form.location.trim() || undefined,
      talkType: form.talkType.trim() || undefined,
      displayOrder: form.displayOrder ? Number(form.displayOrder) : undefined,
      abstract: form.abstract.trim() || undefined,
      pdfUrl: form.pdfUrl || undefined,
      externalUrl: form.externalUrl.trim() || undefined,
      tags: form.tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    setSubmitting(true)
    try {
      const url = editId ? `/api/publications/${editId}` : '/api/publications'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        showFeedback(data.error || 'Failed to save publication', 'error')
        return
      }

      showFeedback(editId ? 'Publication updated successfully.' : 'Publication created successfully.', 'success')
      resetForm()
      fetchData()
    } catch {
      showFeedback('An error occurred while saving the publication.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this publication?')) return

    try {
      const res = await fetch(`/api/publications/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        showFeedback(data.error || 'Failed to delete publication', 'error')
        return
      }
      showFeedback('Publication deleted successfully.', 'success')
      fetchData()
    } catch {
      showFeedback('An error occurred while deleting the publication.', 'error')
    }
  }

  const movePublication = async (publication: Publication, direction: 'up' | 'down') => {
    const currentIndex = activePublications.findIndex((item) => item._id === publication._id)
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const nextPublication = activePublications[nextIndex]
    if (!nextPublication) return

    const payload = {
      ...publication,
      authors: publication.authors.map((author) => author._id),
      researchAreas: (publication.researchAreas || []).map((area) => area._id),
      displayOrder: nextPublication.displayOrder || nextIndex + 1,
    }

    try {
      const res = await fetch(`/api/publications/${publication._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) fetchData()
    } catch {
      showFeedback('Failed to reorder publication.', 'error')
    }
  }

  const isCardCategory = activeTab === 'dataset' || activeTab === 'invited-talk'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-gray-900">
            <BookOpen className="h-8 w-8 text-blue-500" />
            Publications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage global lab publications separately from PI profile publications.
          </p>
        </div>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-2 rounded-md border-l-4 p-4 text-sm font-medium ${message.type === 'success'
            ? 'border-green-500 bg-green-50 text-green-800'
            : 'border-red-500 bg-red-50 text-red-800'
            }`}
        >
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max gap-2">
          {categoryTabs.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTabChange(type)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${activeTab === type
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {getPublicationTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-1"
        >
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Plus className="h-5 w-5 text-blue-500" />
              {editId ? 'Edit' : 'Add'} {getPublicationTypeLabel(activeTab)}
            </h2>
            <p className="mt-1 text-xs font-medium text-gray-500">{categoryHelp[activeTab]}</p>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Title</span>
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Publication title"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Slug</span>
            <input
              type="text"
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
            <label className="block">
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
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Display Order</span>
              <input
                type="number"
                min={1}
                value={form.displayOrder || ''}
                onChange={(event) =>
                  updateForm({ displayOrder: event.target.value ? Number(event.target.value) : undefined })
                }
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Auto"
              />
            </label>
          </div>

          {activeTab === 'journal' && (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Journal Name</span>
              <input
                type="text"
                required
                value={form.journalName}
                onChange={(event) => updateForm({ journalName: event.target.value, venue: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IEEE Transactions..."
              />
            </label>
          )}

          {['conference', 'book-chapter', 'patent'].includes(activeTab) && (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">
                {activeTab === 'conference' ? 'Conference / Venue' : activeTab === 'patent' ? 'Patent Office / Venue' : 'Book / Publisher'}
              </span>
              <input
                type="text"
                required={activeTab === 'conference'}
                value={form.venue}
                onChange={(event) => updateForm({ venue: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Venue, publisher, or patent office"
              />
            </label>
          )}

          {activeTab === 'dataset' && (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Dataset Link</span>
              <input
                type="url"
                value={form.datasetLink}
                onChange={(event) => updateForm({ datasetLink: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </label>
          )}

          {activeTab === 'invited-talk' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateForm({ date: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Type</span>
                <input
                  type="text"
                  value={form.talkType}
                  onChange={(event) => updateForm({ talkType: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Keynote, seminar"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Location</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => updateForm({ location: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Institute / city"
                />
              </label>
            </div>
          )}

          {activeTab !== 'invited-talk' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">DOI Link</span>
                <input
                  type="url"
                  value={form.doiLink}
                  onChange={(event) => updateForm({ doiLink: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://doi.org/..."
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">External Link</span>
                <input
                  type="url"
                  value={form.externalUrl}
                  onChange={(event) => updateForm({ externalUrl: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </label>
            </div>
          )}

          {form.doiLink && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs">
              <p className="font-bold text-slate-900">{form.title || 'Paper Title'}</p>
              <a href={form.doiLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline">
                {form.doiLink}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {['dataset', 'invited-talk'].includes(activeTab) && (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => updateForm({ description: event.target.value })}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief academic description"
              />
            </label>
          )}

          <div>
            <span className="mb-2 block text-sm font-semibold text-gray-700">Select Authors</span>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50/60 p-3">
              {members.length === 0 ? (
                <p className="text-xs font-medium italic text-gray-500">No members available.</p>
              ) : (
                members.map((member) => (
                  <label key={member._id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-2 text-xs shadow-sm ring-1 ring-gray-100">
                    <input
                      type="checkbox"
                      checked={form.selectedAuthors.includes(member._id)}
                      onChange={() => toggleAuthor(member._id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                      {member.imageUrl ? (
                        <SafeImage src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-slate-500">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">{member.name}</p>
                      <p className="truncate font-semibold text-gray-500">{member.role} · {member.status}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="space-y-3">
            <span className="block text-sm font-semibold text-gray-700">
              External Authors
            </span>

            <p className="text-xs text-gray-500">
              Add authors who are not part of PRISM Lab.
            </p>

            {form.externalAuthors?.map((author, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    const updated = [...form.externalAuthors]
                    updated[index] = e.target.value

                    updateForm({
                      externalAuthors: updated,
                    })
                  }}
                  placeholder="Enter author name"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => {
                    const updated =
                      form.externalAuthors.filter(
                        (_, i) => i !== index
                      )

                    updateForm({
                      externalAuthors:
                        updated.length
                          ? updated
                          : [''],
                    })
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                updateForm({
                  externalAuthors: [
                    ...form.externalAuthors,
                    '',
                  ],
                })
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Add External Author
            </button>
          </div>
          {(activeTab === 'journal' || activeTab === 'conference') && (
            <div>
              <span className="mb-2 block text-sm font-semibold text-gray-700">Related Research Areas</span>
              <div className="rounded-lg border border-gray-300 bg-gray-50/60 p-3">
                {researchAreas.length === 0 ? (
                  <p className="text-xs font-medium italic text-gray-500">
                    No research areas available. Add research areas first.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {researchAreas.map((area) => (
                      <label
                        key={area._id}
                        className="flex cursor-pointer items-start gap-2 rounded-lg bg-white p-2 text-xs shadow-sm ring-1 ring-gray-100 transition hover:ring-blue-200"
                      >
                        <input
                          type="checkbox"
                          checked={form.selectedResearchAreas.includes(area._id)}
                          onChange={() => toggleResearchArea(area._id)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="min-w-0">
                          <span className="block font-bold text-gray-900">{area.title}</span>
                          <span className="block truncate font-medium text-gray-500">{area.slug}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs font-medium text-gray-400">
                Selected journal/conference publications will appear automatically on each research area page.
              </p>
            </div>
          )}

          {activeTab !== 'invited-talk' && (
            <FileUpload
              label="PDF Upload"
              value={form.pdfUrl}
              onChange={(url) => updateForm({ pdfUrl: url })}
              type="pdf"
              subfolder="publications"
            />
          )}

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Tags</span>
            <input
              type="text"
              value={form.tagsInput}
              onChange={(event) => updateForm({ tagsInput: event.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AI, Healthcare, Blockchain"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {submitting ? 'Saving...' : editId ? 'Update Publication' : 'Create Publication'}
          </button>
        </form>

        <section className="space-y-4 xl:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{getPublicationTypeLabel(activeTab)}</h2>
                <p className="text-xs font-medium text-gray-500">
                  {activePublications.length} item{activePublications.length === 1 ? '' : 's'} in this category
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title, venue, author..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-14 text-center text-sm font-semibold text-gray-500">Loading publications...</div>
            ) : activePublications.length === 0 ? (
              <div className="py-14 text-center text-sm font-semibold text-gray-500">
                No {getPublicationTypeLabel(activeTab).toLowerCase()} found.
              </div>
            ) : isCardCategory ? (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {activePublications.map((publication, index) => (
                  <PublicationCard
                    key={publication._id}
                    publication={publication}
                    index={index}
                    total={activePublications.length}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMove={movePublication}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-3 py-3">S. No.</th>
                      <th className="px-3 py-3">Authors</th>
                      <th className="px-3 py-3">Title</th>
                      <th className="px-3 py-3">Venue</th>
                      <th className="px-3 py-3">Year</th>
                      <th className="px-3 py-3">Order</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activePublications.map((publication, index) => (
                      <tr key={publication._id} className="align-top hover:bg-gray-50/70">
                        <td className="px-3 py-4 font-bold text-gray-700">{index + 1}</td>
                        <td className="px-3 py-4 text-xs font-semibold text-gray-600">
                          {[
                            ...publication.authors.map(
                              (author) => author.name
                            ),

                            ...(publication.externalAuthors || []),
                          ].join(', ')}
                        </td>
                        <td className="px-3 py-4">
                          <p className="font-bold leading-snug text-gray-950">{publication.title}</p>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs font-semibold">
                            {publication.doiLink && (
                              <a href={publication.doiLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                                DOI <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {publication.pdfUrl && (
                              <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                                PDF <FileText className="h-3 w-3" />
                              </a>
                            )}
                            {publication.externalUrl && (
                              <a href={publication.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                                Link <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs font-semibold text-gray-600">
                          {publication.journalName || publication.venue || '-'}
                        </td>
                        <td className="px-3 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                            <Calendar className="h-3.5 w-3.5" />
                            {publication.year}
                          </span>
                        </td>
                        <td className="px-3 py-4 font-bold text-gray-700">{publication.displayOrder || index + 1}</td>
                        <td className="px-3 py-4">
                          <ActionButtons
                            publication={publication}
                            index={index}
                            total={activePublications.length}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onMove={movePublication}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function PublicationCard({
  publication,
  index,
  total,
  onEdit,
  onDelete,
  onMove,
}: {
  publication: Publication
  index: number
  total: number
  onEdit: (publication: Publication) => void
  onDelete: (id: string) => void
  onMove: (publication: Publication, direction: 'up' | 'down') => void
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            {publication.type === 'dataset' ? 'Dataset' : publication.talkType || 'Invited Talk'}
          </p>
          <h3 className="mt-1 text-base font-extrabold leading-snug text-gray-950">{publication.title}</h3>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600">
          #{publication.displayOrder || index + 1}
        </span>
      </div>
      {publication.description && (
        <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-600">{publication.description}</p>
      )}
      <div className="mt-4 space-y-1 text-xs font-semibold text-gray-500">
        <p>
          Authors:{' '}
          <span className="text-gray-800">
            {[
              ...publication.authors.map(
                (author) => author.name
              ),

              ...(publication.externalAuthors || []),
            ].join(', ')}
          </span>
        </p>
        <p>Year: <span className="text-gray-800">{publication.year}</span></p>
        {publication.location && <p>Location: <span className="text-gray-800">{publication.location}</span></p>}
        {publication.date && <p>Date: <span className="text-gray-800">{publication.date}</span></p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
        {publication.datasetLink && (
          <a href={publication.datasetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
            Dataset <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {publication.doiLink && (
          <a href={publication.doiLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
            DOI <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {publication.pdfUrl && (
          <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
            PDF <FileText className="h-3 w-3" />
          </a>
        )}
      </div>
      <div className="mt-4 border-t border-gray-100 pt-3">
        <ActionButtons
          publication={publication}
          index={index}
          total={total}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      </div>
    </article>
  )
}

function ActionButtons({
  publication,
  index,
  total,
  onEdit,
  onDelete,
  onMove,
}: {
  publication: Publication
  index: number
  total: number
  onEdit: (publication: Publication) => void
  onDelete: (id: string) => void
  onMove: (publication: Publication, direction: 'up' | 'down') => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(publication, 'up')}
        className="rounded border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        title="Move up"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMove(publication, 'down')}
        className="rounded border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        title="Move down"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onEdit(publication)}
        className="rounded border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
        title="Edit"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(publication._id)}
        className="rounded border border-gray-300 p-1.5 text-gray-600 hover:bg-rose-50 hover:text-rose-600"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
