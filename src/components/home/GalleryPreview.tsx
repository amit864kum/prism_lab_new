'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Lightbox from '@/components/ui/Lightbox'

import SafeImage from '@/components/ui/SafeImage'

interface ImageItem {
  imageUrl: string
  caption?: string
  category?: string
}

const GALLERY_CATEGORIES = [
  { label: 'Research & Activity', value: 'Research & Activities' },
  { label: 'Group Discussion', value: 'Group Discussion' },
] as const

export default function GalleryPreview({ images }: { images: ImageItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(
    GALLERY_CATEGORIES[0].value
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const filteredImages = useMemo(
    () =>
      images.filter(
        (image) => image.category?.toLowerCase() === activeCategory.toLowerCase()
      ),
    [activeCategory, images]
  )

  useEffect(() => {
    if (!isAutoPlaying || filteredImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredImages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [filteredImages.length, isAutoPlaying])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentIndex(0)
    setIsAutoPlaying(true)
    setLightboxOpen(false)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAutoPlaying(false)
    setCurrentIndex(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
    )
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length)
  }

  if (images.length === 0) return null

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {GALLERY_CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => handleCategoryChange(category.value)}
            aria-pressed={activeCategory === category.value}
            className={`rounded-xl border px-5 py-2.5 text-sm font-bold transition ${
              activeCategory === category.value
                ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/15'
                : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {filteredImages.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-center text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No images uploaded to this category yet.
        </div>
      ) : (
        <>
      {/* Active Preview Area */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg group cursor-zoom-in"
      >
        <SafeImage
          src={filteredImages[currentIndex].imageUrl}
          alt={filteredImages[currentIndex].caption || 'Gallery Image'}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Hover zoom overlays */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="p-3 bg-white/20 backdrop-blur rounded-full text-white">
            <Maximize2 className="h-6 w-6" />
          </div>
        </div>

        {/* Dynamic Caption */}
        {filteredImages[currentIndex].caption && (
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
            <p className="text-xs font-semibold drop-shadow">{filteredImages[currentIndex].caption}</p>
          </div>
        )}

        {/* Navigation Arrows */}
        {filteredImages.length > 1 && (
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
      {filteredImages.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {filteredImages.map((_, index) => (
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
            {currentIndex + 1} / {filteredImages.length}
          </span>
        </div>
      )}

      {/* Lightbox Slideshow Modal */}
      <Lightbox
        images={filteredImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentIndex}
      />
        </>
      )}
    </div>
  )
}
