import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
