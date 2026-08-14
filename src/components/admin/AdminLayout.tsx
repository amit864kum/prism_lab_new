'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import SafeImage from '@/components/ui/SafeImage'
import ThemeToggle from '@/components/layout/ThemeToggle'
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  BookOpen,
  Briefcase,
  Building2,
  Images,
  Users,
  LogOut,
  Menu,
  X,
  Compass,
  Code2
} from 'lucide-react'

const PRISM_ICON = '/images/prism-emblem.png'
const IITP_LOGO = '/images/iitp-logo.png'

interface SidebarItem {
  label: string
  href: string
  icon: any
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'About Section', href: '/admin/about', icon: FileText },
  { label: 'News Items', href: '/admin/news', icon: Newspaper },
  { label: 'Research Areas', href: '/admin/research-areas', icon: Compass },
  { label: 'Projects', href: '/admin/projects', icon: Briefcase },
  { label: 'Sponsors', href: '/admin/sponsors', icon: Building2 },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'Members', href: '/admin/members', icon: Users },
  { label: 'Member Publications', href: '/admin/member-publications', icon: FileText },
  { label: 'Publications', href: '/admin/publications', icon: BookOpen },
 { label: 'Developer', href: '/admin/developer', icon: Code2 }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        router.push('/admin/login')
        router.refresh()
      } else {
        alert('Logout failed. Please try again.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('An error occurred during logout.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="admin-shell min-h-screen bg-gray-50 flex dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-slate-950 text-white border-r border-slate-800">
        <div className="h-[95px] flex items-center px-5 border-b border-slate-800 gap-4 bg-white text-slate-950">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#08265c]/20 bg-white p-1.5">
            <SafeImage src={PRISM_ICON} alt="PRISM logo" className="h-full w-full rounded-full object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block text-3xl font-black leading-none tracking-tight text-[#08265c]">PRISM</span>
            <span className="mt-1 block text-[12px] font-semibold leading-snug text-slate-600">
              Pervasive & Intelligent Systems Lab
            </span>
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 gap-3 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="h-5 w-5" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white flex flex-col border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800 bg-white text-slate-950">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#08265c]/20 bg-white p-1">
              <SafeImage src={PRISM_ICON} alt="PRISM logo" className="h-full w-full rounded-full object-contain" />
            </span>
            <div>
              <span className="block text-xl font-black text-[#08265c]">PRISM</span>
              <span className="block text-[10px] font-semibold text-slate-600">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:text-white focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 gap-3 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="h-5 w-5" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Mobile Header */}
        <header className="h-[84px] flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-200 sticky top-0 z-30 lg:hidden shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-xl font-black text-[#08265c] tracking-tight">PRISM Admin</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="https://www.iitp.ac.in" target="_blank" rel="noopener noreferrer" aria-label="Open IIT Patna website">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#08265c] bg-white p-0.5">
                <SafeImage src={IITP_LOGO} alt="IIT Patna logo" className="h-full w-full rounded-full object-contain" />
              </span>
            </a>
          </div>
        </header>

        <header className="sticky top-0 z-20 hidden h-[95px] items-center justify-between border-b border-slate-200 bg-white/95 px-8 shadow-sm backdrop-blur-xl lg:flex">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-600">PRISM Lab</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-slate-950">
              Academic Research Administration
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="https://www.iitp.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open IIT Patna website"
              className="admin-brand-mark flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <SafeImage
                src={IITP_LOGO}
                alt="IIT Patna logo"
                className="h-full w-full rounded-full object-contain"
                loading="eager"
              />
            </a>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
