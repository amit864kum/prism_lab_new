'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Lightbox from '@/components/ui/Lightbox'

import SafeImage from '@/components/ui/SafeImage'

interface ImageItem {
  imageUrl: string
  caption?: string
  category?: string
}

export default function GalleryPreview({ images }: { images: ImageItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length])

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  if (images.length === 0) return null

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-4">
      {/* Active Preview Area */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg group cursor-zoom-in"
      >
        <SafeImage
          src={images[currentIndex].imageUrl}
          alt={images[currentIndex].caption || 'Gallery Image'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Hover zoom overlays */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="p-3 bg-white/20 backdrop-blur rounded-full text-white">
            <Maximize2 className="h-6 w-6" />
          </div>
        </div>

        {/* Dynamic Caption */}
        {images[currentIndex].caption && (
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
            <p className="text-xs font-semibold drop-shadow">{images[currentIndex].caption}</p>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-full text-white transition focus:outline-none"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-full text-white transition focus:outline-none"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dot Navigation Indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setIsAutoPlaying(false)
                setCurrentIndex(index)
              }}
              aria-label={`Go to image ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'w-6 bg-blue-600 dark:bg-blue-400'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
              }`}
            />
          ))}
          <span className="ml-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}

      {/* Lightbox Slideshow Modal */}
      <Lightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentIndex}
      />
    </div>
  )
}
