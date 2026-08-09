'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import SafeImage from '@/components/ui/SafeImage'
import { Images, Plus, Trash2, Edit2, CheckCircle, Calendar, Eye } from 'lucide-react'

interface GalleryImage {
  _id: string
  imageUrl: string
  caption?: string
  category?: string
  uploadDate: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [filterCategory, setFilterCategory] = useState('All')

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('Research & Activities')

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      if (res.ok) {
        setImages(data.galleryImages || [])
      } else {
        showFeedback(data.error || 'Failed to fetch gallery images', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching gallery images from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const resetForm = () => {
    setEditId(null)
    setImageUrl('')
    setCaption('')
    setCategory('Research & Activities')
  }

  const handleEdit = (img: GalleryImage) => {
    setEditId(img._id)
    setImageUrl(img.imageUrl)
    setCaption(img.caption || '')
    setCategory(img.category || 'Research & Activities')
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) return

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('Gallery image deleted successfully', 'success')
        fetchImages()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to delete image', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred during deletion', 'error')
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
      caption: caption || undefined,
      category,
      uploadDate: new Date().toISOString(), // automatically set upload date to now
    }

    try {
      const url = editId ? `/api/gallery/${editId}` : '/api/gallery'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'Gallery image updated successfully!' : 'Image added to gallery successfully!',
          'success'
        )
        resetForm()
        fetchImages()
      } else {
        showFeedback(data.error || 'Failed to save image', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving the image', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredImages = images.filter(
    (img) => filterCategory === 'All' || img.category === filterCategory
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Images className="h-8 w-8 text-blue-500" />
            Photo Gallery
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage lab activities, group discussions, and event photos.
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
        {/* Gallery Form */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit Image Info' : 'Upload New Photo'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <FileUpload
                label="Gallery Photo"
                value={imageUrl}
                onChange={setImageUrl}
                type="image"
                subfolder="gallery"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Image Caption (Optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                placeholder="Write a brief caption for this photo..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Gallery Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                <option value="Research & Activities">Research & Activities</option>
                <option value="Group Discussion">Group Discussion</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : editId ? 'Update Photo Info' : 'Upload Photo'}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900">Photo Library</h2>
              <div className="flex bg-gray-150 p-1 rounded-lg text-sm border border-gray-250 font-medium">
                {['All', 'Research & Activities', 'Group Discussion'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-md transition ${
                      filterCategory === cat
                        ? 'bg-white text-gray-900 shadow-sm font-semibold'
                        : 'text-gray-500 hover:text-gray-950'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500 font-medium">Loading photos...</div>
            ) : filteredImages.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-medium">
                No images found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredImages.map((img) => (
                  <div
                    key={img._id}
                    className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition bg-gray-50/50 flex flex-col justify-between"
                  >
                    <div className="aspect-video w-full relative overflow-hidden bg-gray-100 border-b border-gray-200">
                      <SafeImage
                        src={img.imageUrl}
                        alt={img.caption || 'Gallery Image'}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {img.category}
                        </span>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed line-clamp-3 mt-1.5">
                          {img.caption || 'No caption provided.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-250/50 pt-3 mt-4 text-[10px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(img.uploadDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEdit(img)}
                            className="p-1 border border-gray-300 hover:bg-gray-100 text-gray-650 rounded hover:text-blue-600 transition"
                            title="Edit"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(img._id)}
                            className="p-1 border border-gray-300 hover:bg-rose-50 text-gray-650 rounded hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
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
