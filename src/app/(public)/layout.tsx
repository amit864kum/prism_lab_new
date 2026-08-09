import SiteNavbar from '@/components/layout/SiteNavbar'
import Footer from '@/components/layout/Footer'
import ScrollToTopButton from '@/components/layout/ScrollToTopButton'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
