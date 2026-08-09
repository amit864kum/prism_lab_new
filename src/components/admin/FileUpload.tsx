'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, CheckCircle } from 'lucide-react'

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  type: 'image' | 'pdf'
  subfolder: string
  label?: string
}

export default function FileUpload({ value, onChange, type, subfolder, label }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setError('')
    setUploading(true)

    // Client-side validations
    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.')
        setUploading(false)
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image file size must be under 2MB.')
        setUploading(false)
        return
      }
    } else if (type === 'pdf') {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed.')
        setUploading(false)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('PDF file size must be under 10MB.')
        setUploading(false)
        return
      }
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('subfolder', subfolder)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file')
      }

      onChange(data.url)
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}

      {value ? (
        <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center gap-4">
          {type === 'image' ? (
            <div className="h-20 w-20 relative rounded-md overflow-hidden bg-gray-150 border border-gray-200 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-8 w-8" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{value.split('/').pop()}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-green-600 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              Uploaded successfully
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition-all ${
            uploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={type === 'image' ? 'image/jpeg,image/png,image/webp,image/gif' : 'application/pdf'}
            className="hidden"
          />
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-gray-700">
            {uploading ? 'Uploading file...' : 'Click to select and upload file'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {type === 'image'
              ? 'Supports JPG, PNG, WEBP, GIF (Max 2MB)'
              : 'Supports PDF format (Max 10MB)'}
          </p>
          {error && <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>}
        </div>
      )}
    </div>
  )
}
