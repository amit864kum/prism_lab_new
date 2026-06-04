'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import { Compass, Plus, Trash2, Edit2, CheckCircle, Search, Link } from 'lucide-react'

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
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [searchTerm, setSearchTerm] = useState('')

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [order, setOrder] = useState(0)

  // Track if user has manually edited slug to avoid overwriting auto-generated slugs
  const [manualSlug, setManualSlug] = useState(false)

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/research-areas')
      const data = await res.json()
      if (res.ok) {
        setAreas(data.researchAreas || [])
      } else {
        showFeedback(data.error || 'Failed to fetch research areas', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching research areas from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-') // remove consecutive hyphens
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

  const resetForm = () => {
    setEditId(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setImageUrl('')
    setOrder(0)
    setManualSlug(false)
  }

  const handleEdit = (area: ResearchArea) => {
    setEditId(area._id)
    setTitle(area.title)
    setSlug(area.slug)
    setDescription(area.description)
    setImageUrl(area.imageUrl || '')
    setOrder(area.order)
    setManualSlug(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this research area?')) return

    try {
      const res = await fetch(`/api/research-areas/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('Research area deleted successfully', 'success')
        fetchAreas()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to delete research area', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred during deletion', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showFeedback('Title is required', 'error')
      return
    }
    if (!slug.trim()) {
      showFeedback('Slug is required', 'error')
      return
    }
    if (!description.trim()) {
      showFeedback('Description is required', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      title,
      slug,
      description,
      imageUrl: imageUrl || undefined,
      order: Number(order),
    }

    try {
      const url = editId ? `/api/research-areas/${editId}` : '/api/research-areas'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'Research area updated successfully!' : 'Research area created successfully!',
          'success'
        )
        resetForm()
        fetchAreas()
      } else {
        showFeedback(data.error || 'Failed to save research area', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving the research area', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredAreas = areas.filter(
    (area) =>
      area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Compass className="h-8 w-8 text-blue-500" />
            Research Areas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and edit key research domains of the lab.
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
        {/* Research Area Form */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit Research Area' : 'Create Research Area'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Area Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                placeholder="e.g. Speech and Language Processing"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                SEO Url Slug
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={handleSlugChange}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="speech-and-language-processing"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Autogenerated from title. URL path: `/research/areas/[slug]`
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Overview Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm leading-relaxed"
                placeholder="Enter details about this research area, goals, and focus..."
              />
            </div>

            <div>
              <FileUpload
                label="Feature Image (Optional)"
                value={imageUrl}
                onChange={setImageUrl}
                type="image"
                subfolder="research"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                required
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : editId ? 'Update Area' : 'Create Area'}
            </button>
          </form>
        </div>

        {/* Research Area List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900">Research Focus Areas</h2>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center text-gray-500 font-medium">Loading research areas...</div>
            ) : filteredAreas.length === 0 ? (
              <div className="py-8 text-center text-gray-500 font-medium">
                {searchTerm ? 'No research areas matches your search.' : 'No research areas found.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAreas.map((area) => (
                  <div
                    key={area._id}
                    className="border border-gray-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition bg-gray-50/50"
                  >
                    <div>
                      {area.imageUrl && (
                        <div className="h-32 w-full relative rounded-md overflow-hidden bg-gray-100 border border-gray-200 mb-4">
                          <img
                            src={area.imageUrl}
                            alt={area.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{area.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-3">
                        <Link className="h-3.5 w-3.5" />
                        {area.slug}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-4 leading-relaxed mb-4">
                        {area.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-250/50 pt-4 mt-auto">
                      <span className="text-xs text-gray-400">
                        Order: <strong className="text-gray-600 font-semibold">{area.order}</strong>
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(area)}
                          className="p-1.5 border border-gray-300 hover:bg-gray-50 text-gray-650 rounded-md hover:text-blue-600 transition"
                          title="Edit Area"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(area._id)}
                          className="p-1.5 border border-gray-300 hover:bg-rose-50 text-gray-650 rounded-md hover:text-rose-600 transition"
                          title="Delete Area"
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
