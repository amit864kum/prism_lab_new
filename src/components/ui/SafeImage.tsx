'use client'

import React, { useState, useEffect, useRef } from 'react'

// Module-level global cache to persist failed URLs across component mount/unmount.
// This prevents remounted components (like in carousels) from starting the retry loop again.
const failedUrlsGlobal = new Set<string>()

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string
  fallback?: React.ReactNode
  maxRetries?: number
  retryInterval?: number
}

export default function SafeImage({
  src,
  alt,
  className,
  fallback,
  maxRetries = 3,
  retryInterval = 1000,
  onError,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src)
  const [retryCount, setRetryCount] = useState(0)
  const [isFailed, setIsFailed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Sync state if the source URL changes
  useEffect(() => {
    if (src && failedUrlsGlobal.has(src)) {
      setIsFailed(true)
    } else {
      setCurrentSrc(src)
      setRetryCount(0)
      setIsFailed(false)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [src])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If the developer passed a custom onError, call it
    if (onError) {
      onError(e)
    }

    if (!src) {
      setIsFailed(true)
      return
    }

    // Check if it's already in the global failure cache
    if (failedUrlsGlobal.has(src)) {
      setIsFailed(true)
      return
    }

    if (retryCount < maxRetries) {
      const nextCount = retryCount + 1
      timerRef.current = setTimeout(() => {
        setRetryCount(nextCount)
        // Add cache busting param to trigger another browser download attempt
        const separator = src.includes('?') ? '&' : '?'
        setCurrentSrc(`${src}${separator}retry=${nextCount}`)
      }, retryInterval)
    } else {
      // Retries exhausted - add to global failure cache
      failedUrlsGlobal.add(src)
      setIsFailed(true)
    }
  }

  if (isFailed || !currentSrc) {
    if (fallback) {
      return <>{fallback}</>
    }
    // Default elegant placeholder matching the dark/light slate palette
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-lg text-slate-400 dark:text-slate-600 ${className}`}>
        <svg
          className="w-8 h-8 opacity-40 animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={props.loading || 'lazy'}
      decoding={props.decoding || 'async'}
      {...props}
    />
  )
}
