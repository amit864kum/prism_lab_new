'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Wifi, Radio, Zap } from 'lucide-react'
import Link from 'next/link'

interface Slide {
  imageUrl: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
}

// Default 5G & Beyond placeholder slides shown when no slides in DB
const DEFAULT_SLIDES: Slide[] = [
  {
    imageUrl: '',
    title: 'Pioneering 5G & Beyond Research',
    subtitle: 'Advancing next-generation wireless communication, network architecture, and mmWave technologies at IIT Patna.',
    ctaText: 'Explore Research',
    ctaUrl: '/research/areas',
  },
  {
    imageUrl: '',
    title: 'Next-Generation Network Intelligence',
    subtitle: 'Developing AI-driven solutions for ultra-low latency, massive connectivity, and intelligent spectrum management.',
    ctaText: 'View Publications',
    ctaUrl: '/publications',
  },
  {
    imageUrl: '',
    title: 'Shaping the Future of Connectivity',
    subtitle: 'Our lab bridges theoretical foundations with real-world impact — from 5G NR to 6G vision and beyond.',
    ctaText: 'Meet Our Team',
    ctaUrl: '/people/current-members',
  },
]

// 5G-themed gradient backgrounds for each slide
const SLIDE_GRADIENTS = [
  'from-[#020c1b] via-[#0a1628] to-[#071a3e]',
  'from-[#050012] via-[#0c0a2e] to-[#0d1b4a]',
  'from-[#020b18] via-[#061525] to-[#041230]',
]

const SLIDE_ACCENTS = [
  { primary: '#3b82f6', secondary: '#6366f1' },
  { primary: '#8b5cf6', secondary: '#06b6d4' },
  { primary: '#06b6d4', secondary: '#3b82f6' },
]

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const displaySlides = slides.length > 0 ? slides : DEFAULT_SLIDES
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(1)

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % displaySlides.length)
  }, [displaySlides.length])

  const goToPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
  }, [displaySlides.length])

  // 3-second auto-advance
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(goToNext, 3000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, goToNext])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    goToPrev()
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    goToNext()
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const activeSlide = displaySlides[currentIndex]
  const accent = SLIDE_ACCENTS[currentIndex % SLIDE_ACCENTS.length]
  const gradient = SLIDE_GRADIENTS[currentIndex % SLIDE_GRADIENTS.length]
  const hasImage = activeSlide.imageUrl && activeSlide.imageUrl.length > 0

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  }

  return (
    <div className="relative w-full h-[72vh] md:h-[82vh] overflow-hidden bg-[#020c1b]">

      {/* ── Background: image or 5G themed gradient ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`bg-${currentIndex}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        >
          {hasImage && (
            <img
              src={activeSlide.imageUrl}
              alt={activeSlide.title}
              className="w-full h-full object-cover opacity-25"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── 5G Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${accent.primary}55 1px, transparent 1px), linear-gradient(90deg, ${accent.primary}55 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Animated radial signal rings ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              borderColor: `${accent.primary}30`,
              width: `${280 + i * 180}px`,
              height: `${280 + i * 180}px`,
              right: `-${60 + i * 40}px`,
              top: `${-40 + i * 20}px`,
            }}
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
        {/* Bottom-left signal decoration */}
        {[0, 1].map((i) => (
          <motion.div
            key={`bl-${i}`}
            className="absolute rounded-full border"
            style={{
              borderColor: `${accent.secondary}25`,
              width: `${160 + i * 120}px`,
              height: `${160 + i * 120}px`,
              left: `-${40 + i * 30}px`,
              bottom: `${-30 + i * 20}px`,
            }}
            animate={{ opacity: [0.05, 0.25, 0.05] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2 }}
          />
        ))}
      </div>

      {/* ── Floating 5G tech icons ── */}
      <div className="absolute top-8 right-8 flex flex-col gap-3 opacity-20 pointer-events-none">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <Wifi className="h-7 w-7 text-blue-400" />
        </motion.div>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}>
          <Radio className="h-6 w-6 text-indigo-400" />
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}>
          <Zap className="h-5 w-5 text-cyan-400" />
        </motion.div>
      </div>

      {/* ── Gradient overlays for text readability ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

      {/* ── Slide Text Content ── */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${currentIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-3xl space-y-6"
            >
              {/* 5G badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase"
                style={{
                  borderColor: `${accent.primary}50`,
                  backgroundColor: `${accent.primary}12`,
                  color: accent.primary,
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: accent.primary }}
                />
                Prism Lab · IIT Patna · 5G & Beyond
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
                {activeSlide.title}
              </h1>

              {/* Subtitle */}
              {activeSlide.subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-medium"
                >
                  {activeSlide.subtitle}
                </motion.p>
              )}

              {/* CTA */}
              {activeSlide.ctaText && activeSlide.ctaUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center gap-4 pt-2"
                >
                  <Link
                    href={activeSlide.ctaUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`,
                      boxShadow: `0 8px 30px ${accent.primary}40`,
                    }}
                  >
                    {activeSlide.ctaText}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Progress bar at bottom ── */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10">
        <AnimatePresence>
          {isAutoPlaying && (
            <motion.div
              key={currentIndex}
              className="h-full"
              style={{ background: `linear-gradient(90deg, ${accent.primary}, ${accent.secondary})` }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Prev / Next buttons ── */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 group p-3 rounded-full border border-white/20 bg-black/30 hover:bg-white/15 backdrop-blur-sm text-white transition-all hover:scale-110 focus:outline-none"
      >
        <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 group p-3 rounded-full border border-white/20 bg-black/30 hover:bg-white/15 backdrop-blur-sm text-white transition-all hover:scale-110 focus:outline-none"
      >
        <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 focus:outline-none ${
              currentIndex === index
                ? 'w-8 h-2.5'
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
            }`}
            style={
              currentIndex === index
                ? { background: `linear-gradient(90deg, ${accent.primary}, ${accent.secondary})` }
                : {}
            }
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute bottom-5 right-6 text-xs font-bold text-white/40 tabular-nums select-none">
        {String(currentIndex + 1).padStart(2, '0')} / {String(displaySlides.length).padStart(2, '0')}
      </div>
    </div>
  )
}
