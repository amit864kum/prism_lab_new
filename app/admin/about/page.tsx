'use client'

import { useState, useEffect } from 'react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { FileText, Save, CheckCircle, AlertCircle } from 'lucide-react'

export default function AboutPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about')
      const data = await res.json()
      if (res.ok && data.about) {
        setContent(data.about.content || '')
      } else {
        showFeedback(data.error || 'Failed to fetch about section', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching database content', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || content === '<p></p>') {
      showFeedback('Description content cannot be empty.', 'error')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback('About section updated successfully!', 'success')
      } else {
        showFeedback(data.error || 'Failed to update about section', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-500" />
          About Lab Description
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Edit the main introduction text displayed on the public home page.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md text-sm font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
              : 'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-sm text-center text-gray-500 font-medium animate-pulse">
          Loading About section details...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Introductory Content
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Use formatting like bolding, italics, headings, and lists to structure your introduction nicely.
            </p>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:bg-gray-400"
            >
              <Save className="h-4.5 w-4.5" />
              {saving ? 'Saving changes...' : 'Save Description'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
