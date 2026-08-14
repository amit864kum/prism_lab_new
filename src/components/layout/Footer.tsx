'use client'

import { useEffect, useState } from 'react'
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react'
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

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Research Areas', href: '/research/areas' },
  { label: 'Projects', href: '/projects' },
  { label: 'Publications', href: '/publications' },
  { label: 'Members', href: '/members' },
  { label: 'Contact', href: '/#contact' },
]

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
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#020814] text-slate-300"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_30%)]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-20 lg:px-10">

        {/* Main Footer Grid */}
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">

              <div className="flex justify-center">
                <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white/15 bg-white p-2 shadow-[0_0_35px_rgba(56,189,248,0.14)]">
                  <SafeImage
                    src={PRISM_EMBLEM}
                    alt="PRISM Lab emblem"
                    className="h-full w-full rounded-full object-contain"
                  />
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-black text-white">
                Pervasive & Intelligent Systems Lab
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                Department of Computer Science and Engineering,
                Indian Institute of Technology Patna.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
                IIT Patna Research Lab
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-lg font-bold text-white">
              Quick Links
            </h4>

            <div className="space-y-4">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-2 text-slate-400 transition hover:text-cyan-300"
                >
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-5 text-lg font-bold text-white">
              Contact
            </h4>

            <div className="space-y-5 text-sm">

              {data.address && (
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-cyan-400" />
                  <p className="leading-7 text-slate-400">
                    {data.address}
                  </p>
                </div>
              )}

              {data.contactNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  <span>{data.contactNumber}</span>
                </div>
              )}

              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-3 transition hover:text-cyan-300"
                >
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <span>{data.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Map */}
          <div>
            <h4 className="mb-5 text-lg font-bold text-white">
              Locate Us
            </h4>

            {data.googleMapsEmbedUrl && (
              <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(59,130,246,0.08)]">
                <iframe
                  src={data.googleMapsEmbedUrl}
                  className="h-[250px] w-full"
                  loading="lazy"
                  title="PRISM Lab Location"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-sm text-slate-500 lg:flex-row">
          <p>{data.copyrightText}</p>

          <a
            href={data.developerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 transition hover:text-cyan-300"
          >
            {data.developerName}
            <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
