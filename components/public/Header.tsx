'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon, ChevronDown, Compass, Users } from 'lucide-react'

interface NavLink {
  label: string
  href?: string
  dropdown?: { label: string; href: string }[]
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Research',
    dropdown: [
      { label: 'Research Areas', href: '/research/areas' },
      { label: 'Projects', href: '/research/projects' },
      { label: 'Sponsors', href: '/research/sponsors' },
    ],
  },
  { label: 'Publications', href: '/publications' },
  {
    label: 'People',
    dropdown: [
      { label: 'Principal Investigator', href: '/people/principal-investigator' },
      { label: 'Current Members', href: '/people/current-members' },
      { label: 'Alumni', href: '/people/alumni' },
      { label: 'Collaborators', href: '/people/collaborators' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
]

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // Ensure theme is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-lg tracking-wider">
            P
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none block">
              Prism Lab
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-widest uppercase block mt-0.5">
              IIT Patna
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            if (link.dropdown) {
              const isDropdownActive = link.dropdown.some((item) => pathname.startsWith(item.href))
              return (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors py-2 ${
                      isDropdownActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-650 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div
                    className={`absolute left-0 mt-0 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-xl py-2 px-1 transition-all duration-300 ${
                      activeDropdown === link.label
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    {link.dropdown.map((item) => {
                      const isItemActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            isItemActive
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            } else {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href!}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-650 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                </Link>
              )
            }
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-55/30 dark:hover:bg-slate-850 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          )}

          {/* Admin Login Link */}
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center justify-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-blue-500/10"
          >
            Admin Portal
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-40 w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-850 shadow-2xl p-6 transition-transform duration-350 ease-in-out transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-bold text-slate-900 dark:text-white">Navigation</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {NAV_LINKS.map((link) => {
            if (link.dropdown) {
              return (
                <div key={link.label} className="space-y-2">
                  <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    {link.label}
                  </span>
                  <div className="pl-3 border-l border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-sm font-semibold transition-colors ${
                          pathname === item.href
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-650 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            } else {
              return (
                <Link
                  key={link.label}
                  href={link.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-650 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                </Link>
              )
            }
          })}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition"
          >
            Admin Portal
          </Link>
        </nav>
      </div>
    </header>
  )
}
