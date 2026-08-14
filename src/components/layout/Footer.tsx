'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'

const PRISM_EMBLEM = '/images/prism-emblem.png'

interface FooterData {
  copyrightText: string
  developerName: string
  developerLink: string
  prismLogoUrl?: string
  address?: string
  contactNumber?: string
  email?: string
  googleMapsEmbedUrl?: string
}

const fallbackFooter: FooterData = {
  copyrightText: '© 2026 PRISM Lab, IIT Patna. All rights reserved.',
  developerName: 'Designed & Developed by Amit Kumar',
  developerLink: 'https://amit-three.vercel.app/',
  prismLogoUrl: '',
  address: '',
  contactNumber: '',
  email: '',
  googleMapsEmbedUrl: '',
}

export default function Footer() {
  const [data, setData] = useState<FooterData | null>(null)
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch('/api/footer')
        const json = await res.json()

        if (res.ok && json.footer) {
          setData({
            copyrightText:
              json.footer.copyrightText ||
              fallbackFooter.copyrightText,
            developerName:
              json.footer.developerName ||
              fallbackFooter.developerName,
            developerLink:
              json.footer.developerLink ||
              fallbackFooter.developerLink,
            prismLogoUrl: json.footer.prismLogoUrl || '',
            address: json.footer.address || '',
            contactNumber: json.footer.contactNumber || '',
            email: json.footer.email || '',
            googleMapsEmbedUrl:
              json.footer.googleMapsEmbedUrl || '',
          })
        }
      } catch (err) {
        console.error('Failed to fetch footer info', err)
      }
    }

    fetchFooter()
  }, [])
  if (!data) return null

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    data.address || 'Indian Institute of Technology Patna',
  )}`

  return (
    <footer
      id="contact"
      className="site-footer scroll-mt-24 bg-[#181818] text-white"
    >
      <div className="footer-accent-line h-1" aria-hidden="true" />

      <div className="bg-[#181818]">
        <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-6 py-10 md:px-10 lg:grid-cols-[0.8fr_1fr_1.35fr] lg:gap-14 lg:px-14 lg:py-10">
          <div className="flex items-center justify-center">
            <Link
              href="/"
              aria-label="Go to PRISM Lab home page"
              className="inline-flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#181818]"
            >
              <span className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white p-2 shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-[1.03] sm:h-44 sm:w-44 lg:h-48 lg:w-48">
                <SafeImage
                  src={PRISM_EMBLEM}
                  alt="PRISM Lab emblem"
                  className="h-full w-full rounded-full object-contain"
                  loading="eager"
                />
              </span>
            </Link>
          </div>

          <section className="text-center">
            <h2 className="footer-brand-copy font-serif text-3xl font-medium text-blue-400">
              Contact Us
            </h2>

            {data.address && (
              <p className="footer-address-copy mx-auto mt-6 max-w-md text-base leading-8 text-slate-200">
                {data.address}
              </p>
            )}

            <div className="mt-4 flex flex-col items-center gap-2 text-base">
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="inline-flex max-w-full items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
                >
                  <Mail className="h-5 w-5 flex-shrink-0 text-white" />
                  <span className="break-all">{data.email}</span>
                </a>
              )}
              {data.contactNumber && (
                <a
                  href={`tel:${data.contactNumber.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
                >
                  <Phone className="h-5 w-5 flex-shrink-0 text-white" />
                  <span>{data.contactNumber}</span>
                </a>
              )}
            </div>
          </section>

          <section>
            {data.googleMapsEmbedUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-white/40 bg-white shadow-[0_14px_35px_rgba(0,0,0,0.28)]">
                <iframe
                  src={data.googleMapsEmbedUrl}
                  className="h-64 w-full sm:h-72"
                  loading="lazy"
                  title="PRISM Lab Location"
                />
                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-md transition hover:bg-blue-50"
                >
                  Open in Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/30 text-sm text-slate-400 sm:h-72">
                Location map will appear here.
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 px-12 py-4 text-center text-xs text-slate-400 sm:flex-row sm:px-16 sm:text-left">
          <p className="footer-bottom-copy">{data.copyrightText}</p>
          <a
            href={data.developerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-blue-400"
          >
            {data.developerName}
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
