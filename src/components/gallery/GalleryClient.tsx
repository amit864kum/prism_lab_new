'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, Camera, Calendar } from 'lucide-react'
import Lightbox from '@/components/ui/Lightbox'

import SafeImage from '@/components/ui/SafeImage'

interface GalleryImage {
  _id: string
  imageUrl: string
  caption?: string
  category: string
  uploadDate: string
}

interface ClientProps {
  initialImages: GalleryImage[]
}

export default function GalleryClient({ initialImages }: ClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [lightboxIndex, setLightboxIndex] = useState<number>(0)
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)

  // Extract unique categories from database images
  const uniqueCategories = useMemo(() => {
    const categories = initialImages.map((img) => img.category).filter(Boolean)
    // Make sure we have the default academic categories if not in dataset
    const defaults = ['All', 'Research & Activities', 'Group Discussion']
    const combined = Array.from(new Set([...defaults, ...categories]))
    // Filter out 'All' as we want to handle it manually at the beginning
    const finalCats = combined.filter((c) => c !== 'All' && c !== 'all')
    return ['All', ...finalCats]
  }, [initialImages])

  // Filter images by active category
  const filteredImages = useMemo(() => {
    if (activeCategory === 'All' || activeCategory === 'all') {
      return initialImages
    }
    return initialImages.filter(
      (img) => img.category.toLowerCase() === activeCategory.toLowerCase()
    )
  }, [initialImages, activeCategory])

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200/60 dark:border-slate-850 pb-5 bg-white dark:bg-slate-900 p-4 border rounded-2xl shadow-sm">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {filteredImages.length === 0 ? (
        <div className="py-24 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl text-center text-slate-500 italic shadow-sm">
          No images uploaded to this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => (
              <motion.div
                key={img._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleOpenLightbox(idx)}
                className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 relative aspect-[4/3] flex items-center justify-center"
              >
                {/* Photo rendering */}
                <SafeImage
                  src={img.imageUrl}
                  alt={img.caption || `Gallery photo ${idx}`}
                  className="w-full h-full object-cover transition duration-350 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Glassmorphism overlay */}
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-between p-5 text-white">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-600 text-white">
                      {img.category}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                      <ZoomIn className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {img.caption && (
                      <p className="text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3">
                        {img.caption}
                      </p>
                    )}
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(img.uploadDate).toLocaleDateString(undefined, {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox full-screen viewer */}
      <Lightbox
        images={filteredImages.map((img) => ({
          imageUrl: img.imageUrl,
          caption: img.caption,
        }))}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(index) => setLightboxIndex(index)}
      />
    </div>
  )
}
