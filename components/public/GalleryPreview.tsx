'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Lightbox from '@/components/ui/Lightbox'

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
        className="relative h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg group cursor-zoom-in"
      >
        <img
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
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-full text-white transition focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-full text-white transition focus:outline-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

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
