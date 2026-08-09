'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import SafeImage from '@/components/ui/SafeImage'
import { Building2, Plus, Trash2, Edit2, CheckCircle, ExternalLink } from 'lucide-react'

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
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [order, setOrder] = useState(0)

  const fetchSponsors = async () => {
    try {
      const res = await fetch('/api/sponsors')
      const data = await res.json()
      if (res.ok) {
        setSponsors(data.sponsors || [])
      } else {
        showFeedback(data.error || 'Failed to fetch sponsors', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching sponsors from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const resetForm = () => {
    setEditId(null)
    setName('')
    setLogoUrl('')
    setWebsiteUrl('')
    setOrder(0)
  }

  const handleEdit = (sponsor: Sponsor) => {
    setEditId(sponsor._id)
    setName(sponsor.name)
    setLogoUrl(sponsor.logoUrl)
    setWebsiteUrl(sponsor.websiteUrl || '')
    setOrder(sponsor.order)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sponsor?')) return

    try {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('Sponsor deleted successfully', 'success')
        fetchSponsors()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to delete sponsor', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred during deletion', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showFeedback('Sponsor name is required', 'error')
      return
    }
    if (!logoUrl) {
      showFeedback('Sponsor logo is required', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      name,
      logoUrl,
      websiteUrl: websiteUrl || undefined,
      order: Number(order),
    }

    try {
      const url = editId ? `/api/sponsors/${editId}` : '/api/sponsors'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'Sponsor updated successfully!' : 'Sponsor created successfully!',
          'success'
        )
        resetForm()
        fetchSponsors()
      } else {
        showFeedback(data.error || 'Failed to save sponsor', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving the sponsor', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-500" />
            Sponsors & Partners
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage funding bodies, collaborating institutes, and industrial sponsors.
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
        {/* Sponsor Form */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit Sponsor' : 'Add New Sponsor'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sponsor Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                placeholder="e.g. DST, Government of India"
              />
            </div>

            <div>
              <FileUpload
                label="Sponsor Logo"
                value={logoUrl}
                onChange={setLogoUrl}
                type="image"
                subfolder="sponsors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Website URL (Optional)
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="e.g. https://dst.gov.in"
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
              {submitting ? 'Saving...' : editId ? 'Update Sponsor' : 'Create Sponsor'}
            </button>
          </form>
        </div>

        {/* Sponsor list */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Sponsor Directory</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500 font-medium">Loading sponsors list...</div>
            ) : sponsors.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">
                No sponsors found. Create one to display on the homepage marquee and sponsors page.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sponsors.map((sponsor) => (
                  <div key={sponsor._id} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="h-16 w-32 relative rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center p-2">
                      <SafeImage
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-grow space-y-1 min-w-0">
                      <h3 className="font-bold text-gray-900 leading-snug truncate">{sponsor.name}</h3>
                      {sponsor.websiteUrl && (
                        <a
                          href={sponsor.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                        >
                          Visit Sponsor Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Display Order: <strong className="text-gray-600 font-semibold">{sponsor.order}</strong>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleEdit(sponsor)}
                        className="p-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg hover:text-blue-600 transition"
                        title="Edit Sponsor"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor._id)}
                        className="p-2 border border-gray-300 hover:bg-rose-50 text-gray-600 rounded-lg hover:text-rose-600 transition"
                        title="Delete Sponsor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
