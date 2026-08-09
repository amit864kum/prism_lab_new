'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

interface LightboxProps {
  images: { imageUrl: string; caption?: string }[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diffX = touchStartX - touchEndX

    if (diffX > 50) {
      // Swiped left -> Next image
      onNavigate((currentIndex + 1) % images.length)
    } else if (diffX < -50) {
      // Swiped right -> Previous image
      onNavigate((currentIndex - 1 + images.length) % images.length)
    }
    setTouchStartX(null)
  }

  useEffect(() => {
    // Reset zoom when image index changes
    setZoomLevel(1)
  }, [currentIndex])

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length)
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images, onClose, onNavigate])

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/95 text-white p-4 select-none backdrop-blur-sm"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between w-full h-14 px-2 md:px-6">
            <p className="text-sm font-semibold truncate text-slate-400 max-w-md">
              {currentIndex + 1} / {images.length} {currentImage.caption && `- ${currentImage.caption}`}
            </p>

            <div className="flex items-center gap-3">
              {/* Zoom In/Out */}
              <button
                onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.5))}
                className="p-2 border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(3, prev + 0.5))}
                className="p-2 border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors text-slate-300"
                title="Close (Esc)"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Center Carousel Area */}
          <div className="flex-1 relative flex items-center justify-center min-h-0 w-full">
            {/* Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                  className="absolute left-2 md:left-6 z-10 p-3 bg-slate-900/60 hover:bg-slate-900 rounded-full border border-slate-800 text-white transition-all shadow-md focus:outline-none"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => onNavigate((currentIndex + 1) % images.length)}
                  className="absolute right-2 md:right-6 z-10 p-3 bg-slate-900/60 hover:bg-slate-900 rounded-full border border-slate-800 text-white transition-all shadow-md focus:outline-none"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Active Image Wrapper */}
            <div className="w-full h-full max-h-[80vh] flex items-center justify-center p-2 relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ transform: `scale(${zoomLevel})` }}
                src={currentImage.imageUrl}
                alt={currentImage.caption || `Lightbox Image ${currentIndex}`}
                className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
              />
            </div>
          </div>

          {/* Bottom Caption Bar */}
          <div className="h-16 flex items-center justify-center text-center px-4 w-full">
            {currentImage.caption && (
              <p className="text-xs font-semibold text-slate-300 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800 max-w-xl truncate">
                {currentImage.caption}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
