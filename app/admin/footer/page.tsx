'use client'

import { useState, useEffect } from 'react'
import { FileSpreadsheet, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function FooterEditorPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Form states
  const [copyrightText, setCopyrightText] = useState('')
  const [developerName, setDeveloperName] = useState('')
  const [developerLink, setDeveloperLink] = useState('')

  const fetchFooter = async () => {
    try {
      const res = await fetch('/api/footer')
      const data = await res.json()

      if (res.ok && data.footer) {
        setCopyrightText(data.footer.copyrightText || '')
        setDeveloperName(data.footer.developerName || '')
        setDeveloperLink(data.footer.developerLink || '')
      } else {
        showFeedback(data.error || 'Failed to fetch footer settings', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching footer data from server', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFooter()
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!copyrightText.trim()) {
      showFeedback('Copyright text is required', 'error')
      return
    }
    if (!developerName.trim()) {
      showFeedback('Developer name is required', 'error')
      return
    }
    if (!developerLink.trim()) {
      showFeedback('Developer URL/link is required', 'error')
      return
    }

    setSaving(true)
    const payload = {
      copyrightText,
      developerName,
      developerLink,
    }

    try {
      const res = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback('Footer configuration updated successfully!', 'success')
      } else {
        showFeedback(data.error || 'Failed to save footer settings', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred during saving', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-8 w-8 text-blue-500" />
          Footer Settings Editor
        </h1>
        <p className="text-gray-555 text-sm mt-1">
          Configure the public website footer&apos;s copyright statements, attribution developer names, and target redirection URLs.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md text-sm font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-55 text-green-800 border-l-4 border-green-500'
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
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-sm text-center text-gray-500 font-semibold animate-pulse">
          Loading footer settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-md font-bold text-gray-900 border-b border-gray-150 pb-3">
              Redirection & Attributions
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                required
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-semibold text-gray-800"
                placeholder="e.g. © 2026 Prism Lab, IIT Patna. All rights reserved."
              />
              <p className="text-xs text-gray-400 mt-1">
                Copyright text displayed on the lower-left corner of the website footer.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Developer Name
              </label>
              <input
                type="text"
                required
                value={developerName}
                onChange={(e) => setDeveloperName(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-800"
                placeholder="e.g. Designed & Developed by Amit Kumar"
              />
              <p className="text-xs text-gray-400 mt-1">
                Developer name displayed on the lower-right corner of the website footer.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Developer URL Link
              </label>
              <input
                type="url"
                required
                value={developerLink}
                onChange={(e) => setDeveloperLink(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-850"
                placeholder="e.g. https://amit-three.vercel.app/"
              />
              <p className="text-xs text-gray-400 mt-1">
                Target URL redirect when users click the developer name link.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition disabled:bg-gray-400"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Updating Settings...
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
