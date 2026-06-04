'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Image,
  FileText,
  Newspaper,
  BookOpen,
  Briefcase,
  Building2,
  Images,
  User,
  Users,
  LogOut,
  Menu,
  X,
  Compass,
  FileSpreadsheet
} from 'lucide-react'

interface SidebarItem {
  label: string
  href: string
  icon: any
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Hero Slides', href: '/admin/hero-slides', icon: Image },
  { label: 'About Section', href: '/admin/about', icon: FileText },
  { label: 'News Items', href: '/admin/news', icon: Newspaper },
  { label: 'Research Areas', href: '/admin/research-areas', icon: Compass },
  { label: 'Projects', href: '/admin/projects', icon: Briefcase },
  { label: 'Sponsors', href: '/admin/sponsors', icon: Building2 },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'PI Profile', href: '/admin/pi-profile', icon: User },
  { label: 'Members', href: '/admin/members', icon: Users },
  { label: 'Publications', href: '/admin/publications', icon: BookOpen },
  { label: 'Footer Editor', href: '/admin/footer', icon: FileSpreadsheet }
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900 text-white border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-850 gap-2">
          <FileSpreadsheet className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-bold tracking-wider">Prism Lab Admin</span>
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold tracking-wider">Prism Lab</span>
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
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-200 sticky top-0 z-30 lg:hidden shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-bold text-gray-800 tracking-wider">Prism Lab Admin</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Content Section */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
