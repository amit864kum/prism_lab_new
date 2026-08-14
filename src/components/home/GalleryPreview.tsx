'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  MessagesSquare,
} from 'lucide-react'
import Lightbox from '@/components/ui/Lightbox'
import SafeImage from '@/components/ui/SafeImage'

export const GALLERY_AUTOPLAY_INTERVAL_MS = 2000

interface ImageItem {
  imageUrl: string
  caption?: string
  category?: string
}

const GALLERY_CATEGORIES = [
  {
    label: 'Research & Activity',
    value: 'Research & Activities',
    icon: FlaskConical,
  },
  {
    label: 'Group Discussion',
    value: 'Group Discussion',
    icon: MessagesSquare,
  },
] as const

export default function GalleryPreview({ images }: { images: ImageItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(
    GALLERY_CATEGORIES[0].value,
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)

  const filteredImages = useMemo(
    () =>
      images.filter(
        (image) =>
          image.category?.toLowerCase() === activeCategory.toLowerCase(),
      ),
    [activeCategory, images],
  )

  const carouselImages = useMemo(
    () =>
      filteredImages.length > 1
        ? [...filteredImages, ...filteredImages]
        : filteredImages,
    [filteredImages],
  )

  useEffect(() => {
    if (
      !isAutoPlaying ||
      lightboxOpen ||
      filteredImages.length <= 1
    ) {
      return
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % filteredImages.length)
      setCarouselPosition((previous) => previous + 1)
    }, GALLERY_AUTOPLAY_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [filteredImages.length, isAutoPlaying, lightboxOpen])

  useEffect(() => {
    const viewport = viewportRef.current
    const target = viewport?.querySelector<HTMLElement>(
      `[data-carousel-position="${carouselPosition}"]`,
    )
    if (!viewport || !target) return

    viewport.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
  }, [carouselPosition, filteredImages.length])

  useEffect(() => {
    if (
      filteredImages.length <= 1 ||
      carouselPosition < filteredImages.length
    ) {
      return
    }

    const resetTimer = window.setTimeout(() => {
      const viewport = viewportRef.current
      const firstCard = viewport?.querySelector<HTMLElement>(
        '[data-carousel-position="0"]',
      )

      if (viewport && firstCard) {
        viewport.scrollTo({ left: firstCard.offsetLeft, behavior: 'auto' })
      }
      setCarouselPosition(0)
    }, 450)

    return () => window.clearTimeout(resetTimer)
  }, [carouselPosition, filteredImages.length])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentIndex(0)
    setCarouselPosition(0)
    setIsAutoPlaying(true)
    setLightboxOpen(false)
  }

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCarouselPosition((previous) =>
      previous === 0 ? filteredImages.length - 1 : previous - 1,
    )
    setCurrentIndex(
      (previous) =>
        (previous - 1 + filteredImages.length) % filteredImages.length,
    )
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCarouselPosition((previous) => previous + 1)
    setCurrentIndex((previous) => (previous + 1) % filteredImages.length)
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  if (images.length === 0) return null

  return (
    <div className="relative w-full space-y-[30px]">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        {GALLERY_CATEGORIES.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.value

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => handleCategoryChange(category.value)}
              aria-pressed={isActive}
              className={`group flex min-w-[210px] items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 sm:text-base ${
                isActive
                  ? 'bg-gradient-to-r from-[#08265c] to-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-700 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-[#08265c] dark:text-slate-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-300'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'bg-blue-50 text-blue-700 group-hover:bg-white dark:bg-blue-950/60 dark:text-blue-300'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {category.label}
            </button>
          )
        })}
      </div>

      {filteredImages.length === 0 ? (
        <div className="flex h-52 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 text-center text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No images uploaded to this category yet.
        </div>
      ) : (
        <>
          <div className="group/gallery relative" aria-label="Gallery carousel">
            <div ref={viewportRef} className="overflow-hidden px-3 py-2">
              <div className="flex w-max min-w-full justify-center gap-4">
                {carouselImages.map((image, position) => {
                  const originalIndex = position % filteredImages.length

                  return (
                    <button
                      key={`${image.imageUrl}-${position}`}
                      type="button"
                      data-carousel-position={position}
                      data-gallery-index={originalIndex}
                      onClick={() => openLightbox(originalIndex)}
                      aria-label={`Open image ${originalIndex + 1}${
                        image.caption ? `: ${image.caption}` : ''
                      }`}
                      className="group/gallery-card relative h-[280px] w-[min(78vw,300px)] flex-shrink-0 cursor-zoom-in overflow-hidden rounded-md bg-slate-100 text-left shadow-[0_4px_12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.2)] dark:bg-slate-900 sm:h-[300px] sm:w-[300px]"
                    >
                      <SafeImage
                        src={image.imageUrl}
                        alt={
                          image.caption ||
                          `Gallery image ${originalIndex + 1}`
                        }
                        className="h-full w-full object-contain transition-transform duration-300 group-hover/gallery-card:scale-105"
                      />
                      {image.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2.5 text-center text-white backdrop-blur-[1px]">
                          <p className="line-clamp-2 text-xs font-medium leading-5 sm:text-sm">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {filteredImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Previous gallery image"
                  className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white shadow-lg transition hover:scale-105 hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:-left-1"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next gallery image"
                  className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white shadow-lg transition hover:scale-105 hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:-right-1"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

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
