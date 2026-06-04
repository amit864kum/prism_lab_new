'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Newspaper, Plus, Trash2, Edit2, CheckCircle, ExternalLink, Calendar } from 'lucide-react'

interface NewsItem {
  _id: string
  title: string
  content: string
  date: string
  imageUrl?: string
  externalLink?: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10))
  const [imageUrl, setImageUrl] = useState('')
  const [externalLink, setExternalLink] = useState('')

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      if (res.ok) {
        setNews(data.news || [])
      } else {
        showFeedback(data.error || 'Failed to fetch news feed', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching news from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const resetForm = () => {
    setEditId(null)
    setTitle('')
    setContent('')
    setDate(new Date().toISOString().substring(0, 10))
    setImageUrl('')
    setExternalLink('')
  }

  const handleEdit = (item: NewsItem) => {
    setEditId(item._id)
    setTitle(item.title)
    setContent(item.content)
    setDate(new Date(item.date).toISOString().substring(0, 10))
    setImageUrl(item.imageUrl || '')
    setExternalLink(item.externalLink || '')
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('News item deleted successfully', 'success')
        fetchNews()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to delete news item', 'error')
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
    if (!content.trim() || content === '<p></p>') {
      showFeedback('News content is required', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      title,
      content,
      // Convert standard date string (YYYY-MM-DD) to ISO Datetime
      date: new Date(date).toISOString(),
      imageUrl: imageUrl || undefined,
      externalLink: externalLink || undefined,
    }

    try {
      const url = editId ? `/api/news/${editId}` : '/api/news'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'News item updated successfully!' : 'News item created successfully!',
          'success'
        )
        resetForm()
        fetchNews()
      } else {
        showFeedback(data.error || 'Failed to save news item', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-blue-500" />
            News & Events
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Publish and manage news articles, announcements, and lab activities.
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
        {/* News Editor Form */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit News Item' : 'Create News Item'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Headline Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                placeholder="e.g. Lab wins Best Paper Award!"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  External Link
                </label>
                <input
                  type="text"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Content
              </label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div>
              <FileUpload
                label="News Image (Optional)"
                value={imageUrl}
                onChange={setImageUrl}
                type="image"
                subfolder="news"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : editId ? 'Update Article' : 'Publish Article'}
            </button>
          </form>
        </div>

        {/* News Items Listing */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Existing News & Announcements</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500 font-medium">Loading news feed...</div>
            ) : news.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">
                No news items found. Use the form to write your first news post.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {news.map((item) => (
                  <div key={item._id} className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                    {item.imageUrl && (
                      <div className="h-20 w-32 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-bold text-gray-900 leading-snug">{item.title}</h3>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 flex-shrink-0">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Truncated clean HTML preview */}
                      <div
                        className="text-sm text-gray-500 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />

                      {item.externalLink && (
                        <a
                          href={item.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline mt-1"
                        >
                          View External Article
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2 self-end sm:self-start">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg hover:text-blue-600 transition"
                        title="Edit Item"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 border border-gray-300 hover:bg-rose-50 text-gray-600 rounded-lg hover:text-rose-600 transition"
                        title="Delete Item"
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
