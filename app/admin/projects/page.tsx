'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Briefcase, Plus, Trash2, Edit2, CheckCircle, Search, Calendar, Link } from 'lucide-react'

interface Project {
  _id: string
  title: string
  slug: string
  description: string
  status: 'ongoing' | 'completed'
  startDate?: string
  endDate?: string
  imageUrl?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [searchTerm, setSearchTerm] = useState('')

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'ongoing' | 'completed'>('ongoing')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [manualSlug, setManualSlug] = useState(false)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (res.ok) {
        setProjects(data.projects || [])
      } else {
        showFeedback(data.error || 'Failed to fetch projects', 'error')
      }
    } catch (err) {
      showFeedback('Error fetching projects from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
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
    setStatus('ongoing')
    setStartDate('')
    setEndDate('')
    setImageUrl('')
    setManualSlug(false)
  }

  const handleEdit = (project: Project) => {
    setEditId(project._id)
    setTitle(project.title)
    setSlug(project.slug)
    setDescription(project.description)
    setStatus(project.status)
    setStartDate(project.startDate ? new Date(project.startDate).toISOString().substring(0, 10) : '')
    setEndDate(project.endDate ? new Date(project.endDate).toISOString().substring(0, 10) : '')
    setImageUrl(project.imageUrl || '')
    setManualSlug(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showFeedback('Project deleted successfully', 'success')
        fetchProjects()
      } else {
        const data = await res.json()
        showFeedback(data.error || 'Failed to delete project', 'error')
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
    if (!description.trim() || description === '<p></p>') {
      showFeedback('Project description is required', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      title,
      slug,
      description,
      status,
      // Format as ISO datetime string for Zod validation
      startDate: startDate ? new Date(startDate).toISOString() : '',
      endDate: endDate ? new Date(endDate).toISOString() : '',
      imageUrl: imageUrl || undefined,
    }

    try {
      const url = editId ? `/api/projects/${editId}` : '/api/projects'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        showFeedback(
          editId ? 'Project updated successfully!' : 'Project created successfully!',
          'success'
        )
        resetForm()
        fetchProjects()
      } else {
        showFeedback(data.error || 'Failed to save project', 'error')
      }
    } catch (err) {
      showFeedback('An error occurred while saving the project', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-500" />
            Lab Projects
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage ongoing and completed research projects of the lab.
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
        {/* Project Form */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            {editId ? 'Edit Project' : 'Create Project'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
                placeholder="e.g. AI-driven Healthcare Analysis"
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
                placeholder="ai-driven-healthcare-analysis"
              />
              <p className="text-xs text-gray-400 mt-1">
                Autogenerated from title. URL path: `/research/projects/[slug]`
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={status === 'ongoing'}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  const val = e.target.value as 'ongoing' | 'completed'
                  setStatus(val)
                  if (val === 'ongoing') setEndDate('') // reset end date if ongoing
                }}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Details
              </label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>

            <div>
              <FileUpload
                label="Project Feature Image (Optional)"
                value={imageUrl}
                onChange={setImageUrl}
                type="image"
                subfolder="projects"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : editId ? 'Update Project' : 'Create Project'}
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900">Current Projects</h2>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center text-gray-500 font-medium">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-8 text-center text-gray-500 font-medium">
                {searchTerm ? 'No projects matches your search.' : 'No projects found.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <div key={project._id} className="py-5 flex flex-col sm:flex-row gap-5 items-start">
                    {project.imageUrl && (
                      <div className="h-20 w-32 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow space-y-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-bold text-gray-900 text-base leading-tight">{project.title}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            project.status === 'ongoing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                        <Link className="h-3.5 w-3.5" />
                        {project.slug}
                      </div>

                      <div
                        className="text-sm text-gray-500 line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                      />

                      {(project.startDate || project.endDate) && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>
                            {project.startDate
                              ? new Date(project.startDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                })
                              : 'Unknown'}
                            {' - '}
                            {project.status === 'ongoing'
                              ? 'Present'
                              : project.endDate
                              ? new Date(project.endDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                })
                              : 'Completed'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg hover:text-blue-600 transition"
                        title="Edit Project"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-2 border border-gray-300 hover:bg-rose-50 text-gray-600 rounded-lg hover:text-rose-600 transition"
                        title="Delete Project"
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
