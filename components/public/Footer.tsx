'use client'

import { useState, useEffect } from 'react'

interface FooterData {
  copyrightText: string
  developerName: string
  developerLink: string
}

export default function Footer() {
  const [data, setData] = useState<FooterData>({
    copyrightText: '© 2026 Prism Lab, IIT Patna. All rights reserved.',
    developerName: 'Designed & Developed by Amit Kumar',
    developerLink: 'https://amit-three.vercel.app/',
  })

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch('/api/footer')
        const json = await res.json()
        if (res.ok && json.footer) {
          setData({
            copyrightText: json.footer.copyrightText || '© 2026 Prism Lab, IIT Patna. All rights reserved.',
            developerName: json.footer.developerName || 'Designed & Developed by Amit Kumar',
            developerLink: json.footer.developerLink || 'https://amit-three.vercel.app/',
          })
        }
      } catch (err) {
        console.error('Failed to fetch footer info from server', err)
      }
    }
    fetchFooter()
  }, [])

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 py-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
        {/* Left Side: Copyright */}
        <p className="text-center md:text-left">
          {data.copyrightText}
        </p>

        {/* Right Side: Developer Credits */}
        <p className="text-center md:text-right">
          <a
            href={data.developerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            {data.developerName}
          </a>
        </p>
      </div>
    </footer>
  )
}
