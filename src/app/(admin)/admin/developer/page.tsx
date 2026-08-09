'use client'

import { useEffect, useState } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import SafeImage from '@/components/ui/SafeImage'
import { AlertCircle, CheckCircle, Code2, Loader2, Mail, MapPin, Phone, Save } from 'lucide-react'

interface FooterDeveloperForm {
  copyrightText: string
  developerName: string
  developerLink: string
  prismLogoUrl: string
  address: string
  contactNumber: string
  email: string
  googleMapsEmbedUrl: string
  heroPublicationsCount: string
  heroResearchAreasCount: string
  heroScholarsCount: string
  heroProjectsCount: string
}

const emptyForm: FooterDeveloperForm = {
  copyrightText: '© 2026 Prism Lab, IIT Patna. All rights reserved.',
  developerName: 'Designed & Developed by Amit Kumar',
  developerLink: 'https://amit-three.vercel.app/',
  prismLogoUrl: '',
  address: '',
  contactNumber: '',
  email: '',
  googleMapsEmbedUrl: '',
  heroPublicationsCount: '',
  heroResearchAreasCount: '',
  heroScholarsCount: '',
  heroProjectsCount: '',
}

export default function DeveloperPage() {
  const [form, setForm] = useState<FooterDeveloperForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const updateForm = (updates: Partial<FooterDeveloperForm>) => {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const fetchFooter = async () => {
    try {
      const res = await fetch('/api/footer')
      const data = await res.json()

      if (res.ok && data.footer) {
        setForm({
          copyrightText: data.footer.copyrightText || emptyForm.copyrightText,
          developerName: data.footer.developerName || emptyForm.developerName,
          developerLink: data.footer.developerLink || emptyForm.developerLink,
          prismLogoUrl: data.footer.prismLogoUrl || '',
          address: data.footer.address || '',
          contactNumber: data.footer.contactNumber || '',
          email: data.footer.email || '',
          googleMapsEmbedUrl: data.footer.googleMapsEmbedUrl || '',
          heroPublicationsCount: data.footer.heroPublicationsCount != null ? String(data.footer.heroPublicationsCount) : '',
          heroResearchAreasCount: data.footer.heroResearchAreasCount != null ? String(data.footer.heroResearchAreasCount) : '',
          heroScholarsCount: data.footer.heroScholarsCount != null ? String(data.footer.heroScholarsCount) : '',
          heroProjectsCount: data.footer.heroProjectsCount != null ? String(data.footer.heroProjectsCount) : '',
        })
      } else {
        showFeedback(data.error || 'Failed to fetch developer settings', 'error')
      }
    } catch {
      showFeedback('Error fetching developer settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFooter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.copyrightText.trim()) return showFeedback('Copyright text is required.', 'error')
    if (!form.developerName.trim()) return showFeedback('Developer name is required.', 'error')
    if (!form.developerLink.trim()) return showFeedback('Developer link is required.', 'error')

    setSaving(true)
    try {
      const res = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          heroPublicationsCount: form.heroPublicationsCount === '' ? null : Number(form.heroPublicationsCount),
          heroResearchAreasCount: form.heroResearchAreasCount === '' ? null : Number(form.heroResearchAreasCount),
          heroScholarsCount: form.heroScholarsCount === '' ? null : Number(form.heroScholarsCount),
          heroProjectsCount: form.heroProjectsCount === '' ? null : Number(form.heroProjectsCount),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        showFeedback(data.error || 'Failed to save developer settings', 'error')
        return
      }

      showFeedback('Developer/footer settings saved successfully.', 'success')
    } catch {
      showFeedback('An error occurred while saving developer settings.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-gray-900">
          <Code2 className="h-8 w-8 text-blue-500" />
          Developer
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage footer contact details, PRISM logo, maps embed URL, and developer attribution.
        </p>
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-2 rounded-md border-l-4 p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'border-green-500 bg-green-50 text-green-800'
              : 'border-red-500 bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm font-semibold text-gray-500 shadow-sm">
          Loading developer settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="border-b border-gray-100 pb-3 text-md font-bold text-gray-900">Footer Identity</h2>

              <FileUpload
                label="PRISM Logo"
                value={form.prismLogoUrl}
                onChange={(url) => updateForm({ prismLogoUrl: url })}
                type="image"
                subfolder="logos"
              />

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Address</span>
                <textarea
                  value={form.address}
                  onChange={(event) => updateForm({ address: event.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PRISM Lab, IIT Patna..."
                />
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Contact Number</span>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(event) => updateForm({ contactNumber: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+91..."
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm({ email: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="prism@iitp.ac.in"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Google Maps Embed URL</span>
                <input
                  type="url"
                  value={form.googleMapsEmbedUrl}
                  onChange={(event) => updateForm({ googleMapsEmbedUrl: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </label>
            </section>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-md font-bold text-gray-900">Homepage Hero Stat Overrides</h2>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  Leave a field empty to use the automatic database count.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Publications Count</span>
                  <input
                    type="number"
                    min="0"
                    value={form.heroPublicationsCount}
                    onChange={(event) => updateForm({ heroPublicationsCount: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Auto"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Research Areas Count</span>
                  <input
                    type="number"
                    min="0"
                    value={form.heroResearchAreasCount}
                    onChange={(event) => updateForm({ heroResearchAreasCount: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Auto"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Active Research Scholars</span>
                  <input
                    type="number"
                    min="0"
                    value={form.heroScholarsCount}
                    onChange={(event) => updateForm({ heroScholarsCount: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Auto"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Ongoing Research Projects</span>
                  <input
                    type="number"
                    min="0"
                    value={form.heroProjectsCount}
                    onChange={(event) => updateForm({ heroProjectsCount: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Auto"
                  />
                </label>
              </div>
            </section>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="border-b border-gray-100 pb-3 text-md font-bold text-gray-900">Developer Attribution</h2>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Copyright Text</span>
                <input
                  type="text"
                  required
                  value={form.copyrightText}
                  onChange={(event) => updateForm({ copyrightText: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Developer Name</span>
                  <input
                    type="text"
                    required
                    value={form.developerName}
                    onChange={(event) => updateForm({ developerName: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Developer URL</span>
                  <input
                    type="url"
                    required
                    value={form.developerLink}
                    onChange={(event) => updateForm({ developerLink: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {saving ? 'Saving...' : 'Save Developer Settings'}
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-md font-bold text-gray-900">Live Footer Preview</h2>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm">
              {form.prismLogoUrl && (
                <SafeImage src={form.prismLogoUrl} alt="PRISM logo preview" className="mb-4 h-14 w-auto object-contain" />
              )}
              <p className="font-bold text-slate-900">PRISM Lab</p>
              {form.address && (
                <p className="mt-3 flex gap-2 text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                  <span>{form.address}</span>
                </p>
              )}
              {form.contactNumber && (
                <p className="mt-2 flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 text-blue-600" />
                  {form.contactNumber}
                </p>
              )}
              {form.email && (
                <p className="mt-2 flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4 text-blue-600" />
                  {form.email}
                </p>
              )}
              {form.googleMapsEmbedUrl && (
                <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <iframe
                    src={form.googleMapsEmbedUrl}
                    className="h-full w-full"
                    loading="lazy"
                    title="PRISM Lab map preview"
                  />
                </div>
              )}
              <div className="mt-5 border-t border-slate-200 pt-4 text-xs font-medium text-slate-500">
                <p>{form.copyrightText}</p>
                <a href={form.developerLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-bold text-blue-700 hover:underline">
                  {form.developerName}
                </a>
              </div>
            </div>
          </aside>
        </form>
      )}
    </div>
  )
}
