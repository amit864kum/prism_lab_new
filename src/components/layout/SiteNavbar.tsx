'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import ThemeToggle from '@/components/layout/ThemeToggle'

const PRISM_ICON = '/images/prism-emblem.png'
const IITP_LOGO = '/images/iitp-logo.png'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Research Areas', href: '/research/areas' },
  { label: 'Projects', href: '/projects' },
  { label: 'Publications', href: '/publications' },
  { label: 'Members', href: '/members' },
  { label: 'News', href: '/#news-events' },
  { label: 'Contact', href: '/#contact' },
]

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href.startsWith('/#')) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function SiteNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-950/95 transition-all duration-300 ${scrolled
        ? 'border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl'
        : 'border-transparent shadow-sm'
        }`}
    >
      <div className="relative mx-auto flex h-[84px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:h-[95px] lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-5">
          <span className="flex h-[64px] w-[64px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#08265c]/20 bg-white p-1.5 sm:h-[72px] sm:w-[72px]">
            <SafeImage src={PRISM_ICON} alt="PRISM logo" className="h-full w-full rounded-full object-contain" loading="eager" fetchPriority="high" />
          </span>
          <span className="min-w-0">
            <span className="block text-[2rem] font-black leading-none tracking-tight text-[#08265c] dark:text-blue-400 sm:text-[2.55rem]">
              PRISM
            </span>
            <span className="mt-1 block truncate text-[13px] font-medium text-slate-700 dark:text-slate-300 sm:text-[15px]">
              Pervasive & Intelligent Systems Lab
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400 sm:text-[12px]">
              Department of CSE IIT Patna
            </span>
          </span>
        </Link>

        <nav className="absolute left-[59%] hidden -translate-x-1/2 items-center gap-6 xl:flex 2xl:gap-8">
          {NAV_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative whitespace-nowrap py-2 text-[14px] font-bold transition-colors 2xl:text-[15px] ${active ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 hover:text-blue-700 dark:text-slate-100 dark:hover:text-blue-400'
                  }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left rounded-full bg-blue-600 transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <a
            href="https://www.iitp.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open IIT Patna website"
            className="hidden h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-full border-2 border-[#08265c] bg-white p-1 transition hover:-translate-y-0.5 sm:flex"
          >
            <SafeImage
              src={IITP_LOGO}
              alt="IIT Patna logo"
              className="h-full w-full rounded-full object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-900 xl:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 shadow-xl transition-all duration-300 xl:hidden ${mobileOpen ? 'max-h-[520px] py-4 opacity-100' : 'max-h-0 overflow-hidden py-0 opacity-0'
          }`}
      >
        <nav className="mx-auto grid max-w-7xl gap-1">
          {NAV_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${active ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
              >
                {item.label}
              </Link>
            )
          })}
          <a
            href="https://www.iitp.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#08265c] bg-white p-0.5">
              <SafeImage
                src={IITP_LOGO}
                alt="IIT Patna logo"
                className="h-full w-full rounded-full object-contain"
              />
            </span>
            Indian Institute of Technology Patna
          </a>
        </nav>
      </div>
    </header>
  )
}
