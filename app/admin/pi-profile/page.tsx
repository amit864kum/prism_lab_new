'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { User, Save, Plus, Trash2, CheckCircle, AlertCircle, PlusCircle } from 'lucide-react'

interface EducationItem {
  degree: string
  institution: string
  year: number
}

export default function PIProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exists, setExists] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Form states
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [email, setEmail] = useState('')
  const [officeLocation, setOfficeLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [researchInterests, setResearchInterests] = useState<string[]>([])
  const [education, setEducation] = useState<EducationItem[]>([])

  const fetchPIProfile = async () => {
    try {
      const res = await fetch('/api/pi-profile')
      const data = await res.json()

      if (res.status === 404) {
        // No PI Profile created yet, we can create one
        setExists(false)
        setLoading(false)
        return
      }

      if (res.ok && data.piProfile) {
        setExists(true)
        setName(data.piProfile.name || '')
        setTitle(data.piProfile.title || '')
        setBio(data.piProfile.bio || '')
        setImageUrl(data.piProfile.imageUrl || '')
        setEmail(data.piProfile.email || '')
        setOfficeLocation(data.piProfile.officeLocation || '')
        setPhoneNumber(data.piProfile.phoneNumber || '')
        setResearchInterests(data.piProfile.researchInterests || [])
        setEducation(data.piProfile.education || [])
      } else {
        showFeedback(data.error || 'Failed to fetch PI profile', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching PI profile from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPIProfile()
  }, [])

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleAddInterest = () => {
    if (!interestInput.trim()) return
    if (researchInterests.includes(interestInput.trim())) return
    setResearchInterests([...researchInterests, interestInput.trim()])
    setInterestInput('')
  }

  const handleRemoveInterest = (indexToRemove: number) => {
    setResearchInterests(researchInterests.filter((_, idx) => idx !== indexToRemove))
  }

  const handleAddEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: new Date().getFullYear() }])
  }

  const handleRemoveEducation = (indexToRemove: number) => {
    setEducation(education.filter((_, idx) => idx !== indexToRemove))
  }

  const handleEducationChange = (index: number, field: keyof EducationItem, value: any) => {
    const updated = [...education]
    updated[index] = {
      ...updated[index],
      [field]: field === 'year' ? Number(value) : value,
    }
    setEducation(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showFeedback('Name is required', 'error')
      return
    }
    if (!title.trim()) {
      showFeedback('Title is required', 'error')
      return
    }
    if (!bio.trim() || bio === '<p></p>') {
      showFeedback('Biography is required', 'error')
      return
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', 'error')
      return
    }

    // Validate education items have valid content
    for (const edu of education) {
      if (!edu.degree.trim() || !edu.institution.trim() || !edu.year) {
        showFeedback('Please complete all education entries (degree, institution, and year).', 'error')
        return
      }
    }

    setSaving(true)
    const payload = {
      name,
      title,
      bio,
      imageUrl: imageUrl || undefined,
      email: email || undefined,
      officeLocation: officeLocation || undefined,
      phoneNumber: phoneNumber || undefined,
      researchInterests,
      education,
    }

    try {
      // If it exists, use PUT to update. If not, use POST to create initial.
      const url = '/api/pi-profile'
      const method = exists ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setExists(true)
        showFeedback('Principal Investigator Profile saved successfully!', 'success')
      } else {
        showFeedback(data.error || 'Failed to save PI profile', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <User className="h-8 w-8 text-blue-500" />
          PI Profile Editor
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage name, photo, bio, contact details, research interests, and education of the Principal Investigator.
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
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-sm text-center text-gray-500 font-semibold animate-pulse">
          Loading PI Profile details...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Bio Details / Upload */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Photo & Info
                </h2>

                <div>
                  <FileUpload
                    label="PI Profile Photo"
                    value={imageUrl}
                    onChange={setImageUrl}
                    type="image"
                    subfolder="pi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-semibold text-gray-800"
                    placeholder="e.g. Dr. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Designation/Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="e.g. Associate Professor, CSE"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Contact Details
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="johndoe@iitp.ac.in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="e.g. Block 3, Room 402"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="e.g. +91 612 302 8xxx"
                  />
                </div>
              </div>
            </div>

            {/* Right side: Biography Editor & Lists */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Biography & Overview
                </h2>
                <div>
                  <RichTextEditor value={bio} onChange={setBio} />
                </div>
              </div>

              {/* Research Interests Tags */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Research Interests
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder="e.g. Natural Language Processing"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
                  >
                    Add
                  </button>
                </div>
                {researchInterests.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No interests listed. Add some above.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {researchInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(idx)}
                          className="text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          <Trash2 className="h-3 w-3 text-rose-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Education Array */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h2 className="text-md font-bold text-gray-900">Education Details</h2>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Degree
                  </button>
                </div>

                {education.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No education details listed.</p>
                ) : (
                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50 items-end"
                      >
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                          <div className="sm:col-span-1">
                            <label className="block text-xs font-semibold text-gray-550 mb-1">
                              Degree / Program
                            </label>
                            <input
                              type="text"
                              required
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                              placeholder="e.g. Ph.D. in CSE"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <label className="block text-xs font-semibold text-gray-550 mb-1">
                              University / Institute
                            </label>
                            <input
                              type="text"
                              required
                              value={edu.institution}
                              onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                              placeholder="e.g. IIT Bombay"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <label className="block text-xs font-semibold text-gray-550 mb-1">
                              Graduation Year
                            </label>
                            <input
                              type="number"
                              required
                              min={1900}
                              max={2100}
                              value={edu.year}
                              onChange={(e) => handleEducationChange(idx, 'year', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(idx)}
                          className="p-2 border border-gray-350 bg-white hover:bg-rose-50 text-rose-500 rounded-md flex-shrink-0 hover:border-rose-300 transition"
                          title="Delete Degree"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition disabled:bg-gray-400"
                >
                  <Save className="h-5 w-5" />
                  {saving ? 'Saving changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
