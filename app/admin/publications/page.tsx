'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import { BookOpen, Plus, Trash2, Edit2, CheckCircle, Search, FileText, ExternalLink, Calendar } from 'lucide-react'

interface Member {
  _id: string
  name: string
  role: string
}

interface Publication {
  _id: string
  title: string
  slug: string
  type: 'Journal Article' | 'Conference Paper' | 'Workshop Paper' | 'Technical Report' | 'Book Chapter' | 'Thesis'
  authors: Member[]
  year: number
  venue?: string
  abstract?: string
  pdfUrl?: string
  externalUrl?: string
  tags: string[]
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [type, setType] = useState<Publication['type']>('Journal Article')
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [venue, setVenue] = useState('')
  const [abstract, setAbstract] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const [manualSlug, setManualSlug] = useState(false)

  const fetchPublicationsAndMembers = async () => {
    try {
      const [pubRes, memRes] = await Promise.all([
        fetch('/api/publications'),
        fetch('/api/members')
      ])

      const pubData = await pubRes.json()
      const memData = await memRes.json()

      if (pubRes.ok) {
        setPublications(pubData.publications || [])
      } else {
        showFeedback(pubData.error || 'Failed to fetch publications', 'error')
      }

      if (memRes.ok) {
        setMembers(memData.members || [])
      }
    } catch (err) {
      showFeedback('Error loading data from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicationsAndMembers()
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!manualSlug && !editId) {
      setSlug(slugify(val))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(e.target.value))
    setManualSlug(true)
  }

  const handleAuthorToggle = (memberId: string) => {
    if (selectedAuthors.includes(memberId)) {
      setSelectedAuthors(selectedAuthors.filter((id) => id !== memberId))
    } else {
      setSelectedAuthors([...selectedAuthors, memberId])
    }
  }

  const resetForm = () => {
    setEditId(null)
    setTitle('')
    setSlug('')
    setType('Journal Article')
    setSelectedAuthors([])
    setYear(new Date().getFullYear())
    setVenue('')
    setAbstract('')
    setPdfUrl('')
    setExternalUrl('')
    setTagsInput('')
    setManualSlug(false)
  }

  const handleEdit = (pub: Publication) => {
    setEditId(pub._id)
    setTitle(pub.title)
    setSlug(pub.slug)
    setType(pub.type)
    setSelectedAuthors(pub.authors.map((a) => a._id))
    setYear(pub.year)
    setVenue(pub.venue || '')
    setAbstract(pub.abstract || '')
    setPdfUrl(pub.pdfUrl || '')
    setExternalUrl(pub.externalUrl || '')
    setTagsInput(pub.tags ? pub.tags.join(', ') : '')
    setManualSlug(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return

    try {
      const res = await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('Publication deleted successfully', 'success')
        fetchPublicationsAndMembers()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to delete publication', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred during deletion', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showFeedback('Publication title is required', 'error')
      return
    }
    if (!slug.trim()) {
      showFeedback('Slug is required', 'error')
      return
    }
    if (selectedAuthors.length === 0) {
      showFeedback('Please select at least one author.', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      title,
      slug,
      type,
      authors: selectedAuthors,
      year: Number(year),
      venue: venue || undefined,
      abstract: abstract || undefined,
      pdfUrl: pdfUrl || undefined,
      externalUrl: externalUrl || undefined,
      tags: tagsInput
        ? tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        : [],
    }

    try {
      const url = editId ? `/api/publications/${editId}` : '/api/publications'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'Publication updated successfully!' : 'Publication created successfully!',
          'success'
        )
        resetForm()
        fetchPublicationsAndMembers()
      } else {
        showFeedback(data.error || 'Failed to save publication', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'All' || pub.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            Publications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage research papers, journal articles, books, and theses.
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
          className={`p-4 rounded-md text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
              : 'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit Publication' : 'Add Publication'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Paper Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                placeholder="e.g. A Deep Learning Approach to NLP"
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
                placeholder="a-deep-learning-approach-to-nlp"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                >
                  <option value="Journal Article">Journal Article</option>
                  <option value="Conference Paper">Conference Paper</option>
                  <option value="Workshop Paper">Workshop Paper</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Technical Report">Technical Report</option>
                  <option value="Thesis">Thesis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Publication Year
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Lab Authors
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-gray-50/50">
                {members.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No members available. Add members first.</p>
                ) : (
                  members.map((member) => (
                    <label key={member._id} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAuthors.includes(member._id)}
                        onChange={() => handleAuthorToggle(member._id)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{member.name} <span className="text-[10px] text-gray-400 font-medium">({member.role})</span></span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Venue/Journal/Conference Name
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="e.g. IEEE Transactions on Pattern Analysis"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="NLP, Deep Learning, Speech"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Abstract (Optional)
              </label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                placeholder="Paste paper abstract summary..."
              />
            </div>

            <div>
              <FileUpload
                label="Full Paper PDF (Optional)"
                value={pdfUrl}
                onChange={setPdfUrl}
                type="pdf"
                subfolder="publications"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                External Link URL (e.g. Publisher, Arxiv)
              </label>
              <input
                type="text"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="e.g. https://doi.org/10.1109/..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : editId ? 'Update Publication' : 'Create Publication'}
            </button>
          </form>
        </div>

        {/* List View */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900">Publications List</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                >
                  <option value="All">All Types</option>
                  <option value="Journal Article">Journal Article</option>
                  <option value="Conference Paper">Conference Paper</option>
                  <option value="Workshop Paper">Workshop Paper</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Technical Report">Technical Report</option>
                  <option value="Thesis">Thesis</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500 font-medium">Loading publications...</div>
            ) : filteredPublications.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-medium">
                No publications found matching current search/filter.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPublications.map((pub) => (
                  <div key={pub._id} className="py-5 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-bold text-gray-950 text-base leading-snug">{pub.title}</h3>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded font-semibold flex items-center gap-1.5 flex-shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                        {pub.year}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-xs text-gray-500 font-semibold">
                      <span>Authors:</span>
                      {pub.authors.map((author, index) => (
                        <span key={author._id} className="text-gray-850 font-bold">
                          {author.name}
                          {index < pub.authors.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                      <span>Type: <strong className="text-slate-700">{pub.type}</strong></span>
                      {pub.venue && <span>Venue: <strong className="text-slate-750 font-semibold">{pub.venue}</strong></span>}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
                      <div className="flex gap-3">
                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            PDF Paper
                          </a>
                        )}
                        {pub.externalUrl && (
                          <a
                            href={pub.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            External Link
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pub)}
                          className="p-1.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded hover:text-blue-600 transition"
                          title="Edit Publication"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pub._id)}
                          className="p-1.5 border border-gray-300 hover:bg-rose-50 text-gray-650 rounded hover:text-rose-600 transition"
                          title="Delete Publication"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
