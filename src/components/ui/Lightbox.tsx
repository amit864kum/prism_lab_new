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
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          className="fixed inset-0 z-[100] flex select-none flex-col bg-black/90 p-4 text-white backdrop-blur-sm sm:p-6"
        >
          <div className="absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 sm:top-6">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.5))}
                aria-label="Zoom out"
                className="rounded-md bg-white/10 p-2.5 text-white transition hover:bg-white/20"
                title="Zoom Out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(3, prev + 0.5))}
                aria-label="Zoom in"
                className="rounded-md bg-white/10 p-2.5 text-white transition hover:bg-white/20"
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close gallery viewer"
                className="rounded-md p-2.5 text-white transition hover:bg-white/15"
                title="Close (Esc)"
              >
                <X className="h-7 w-7" />
              </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center pt-14 sm:pt-10">
            {images.length > 1 && (
              <>
                <button
                  onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                  aria-label="Previous lightbox image"
                  className="absolute left-0 z-20 flex h-14 w-12 items-center justify-center bg-white/20 text-white transition hover:bg-white/30 sm:left-3 sm:h-16 sm:w-14"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => onNavigate((currentIndex + 1) % images.length)}
                  aria-label="Next lightbox image"
                  className="absolute right-0 z-20 flex h-14 w-12 items-center justify-center bg-white/20 text-white transition hover:bg-white/30 sm:right-3 sm:h-16 sm:w-14"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className="flex h-full max-h-[72vh] w-[calc(100%-5rem)] max-w-5xl items-center justify-center overflow-hidden rounded-xl bg-white p-4 shadow-2xl sm:w-[calc(100%-9rem)] sm:p-8"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: zoomLevel }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={currentImage.imageUrl}
                alt={currentImage.caption || `Lightbox Image ${currentIndex}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div className="flex min-h-20 flex-col items-center justify-center px-4 pt-4 text-center">
            {currentImage.caption && (
              <p className="max-w-4xl text-base font-semibold leading-6 text-white sm:text-xl">
                {currentImage.caption}
              </p>
            )}
            <p className="mt-1 text-xs font-medium text-slate-400">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
