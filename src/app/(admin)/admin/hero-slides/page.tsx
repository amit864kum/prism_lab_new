'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import SafeImage from '@/components/ui/SafeImage'
import { AlertCircle, Plus, Trash2, Edit2, CheckCircle, Eye, EyeOff } from 'lucide-react'

interface HeroSlide {
  _id: string
  imageUrl: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
  order: number
  isActive: boolean
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const activeCount = slides.filter((s) => s.isActive).length

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/hero-slides?all=true')
      const data = await res.json()
      if (res.ok) {
        setSlides(data.slides || [])
      } else {
        showFeedback(data.error || 'Failed to fetch slides', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching slides from server', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const resetForm = () => {
    setEditId(null)
    setImageUrl('')
    setTitle('')
    setSubtitle('')
    setCtaText('')
    setCtaUrl('')
    setOrder(0)
    setIsActive(true)
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditId(slide._id)
    setImageUrl(slide.imageUrl)
    setTitle(slide.title)
    setSubtitle(slide.subtitle || '')
    setCtaText(slide.ctaText || '')
    setCtaUrl(slide.ctaUrl || '')
    setOrder(slide.order)
    setIsActive(slide.isActive)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return

    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('Slide deleted successfully', 'success')
        fetchSlides()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to delete slide', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while deleting slide', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) {
      showFeedback('Please upload an image first.', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      imageUrl,
      title,
      subtitle: subtitle || undefined,
      ctaText: ctaText || undefined,
      ctaUrl: ctaUrl || undefined,
      order: Number(order),
      isActive,
    }

    try {
      const url = editId ? `/api/hero-slides/${editId}` : '/api/hero-slides'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'Slide updated successfully!' : 'Slide created successfully!',
          'success'
        )
        resetForm()
        fetchSlides()
      } else {
        showFeedback(data.error || 'Failed to save slide', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving the slide', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hero Slides</h1>
          <p className="text-gray-500 text-sm mt-1">Manage slides for the home page carousel.</p>
        </div>
        {editId && (
          <button
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 font-medium transition"
          >
            Cancel Edit & Add New
          </button>
        )}
      </div>

      {/* Warning Alert if Active Slides != 3 */}
      {activeCount !== 3 && !loading && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">
              Active Slides Count Warning
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              There are currently <strong className="font-bold">{activeCount}</strong> active slides. 
              The home page carousel requires exactly <strong className="font-bold">3</strong> active slides to render correctly.
            </p>
          </div>
        </div>
      )}

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
        {/* CRUD Form */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <FileUpload
                label="Slide Image"
                value={imageUrl}
                onChange={setImageUrl}
                type="image"
                subfolder="hero"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Slide Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="e.g. Prism Research Lab"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Subtitle (Optional)
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                placeholder="e.g. IIT Patna Computer Science & Engineering"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="e.g. Learn More"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  CTA Redirect URL
                </label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="e.g. https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center pt-2">
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
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                  Set Slide Active
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : editId ? 'Update Slide' : 'Create Slide'}
            </button>
          </form>
        </div>

        {/* Slides list */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Existing Hero Slides</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading slides...</div>
            ) : slides.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No slides found. Create one.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {slides.map((slide) => (
                  <div key={slide._id} className="p-5 flex flex-col md:flex-row gap-5 items-start md:items-center">
                    <div className="h-24 w-40 relative rounded-md overflow-hidden bg-gray-150 border border-gray-200 flex-shrink-0">
                      <SafeImage
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 truncate">{slide.title}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            slide.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {slide.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {slide.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{slide.subtitle || 'No subtitle'}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span>Order: <strong className="text-gray-600 font-semibold">{slide.order}</strong></span>
                        {slide.ctaText && (
                          <span>
                            CTA: <strong className="text-gray-600 font-medium">{slide.ctaText}</strong> ({slide.ctaUrl})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="p-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg hover:text-blue-600 transition"
                        title="Edit Slide"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide._id)}
                        className="p-2 border border-gray-300 hover:bg-rose-50 text-gray-600 rounded-lg hover:text-rose-600 transition"
                        title="Delete Slide"
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
