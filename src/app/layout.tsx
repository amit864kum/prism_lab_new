import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/config/theme'

export const metadata: Metadata = {
  title: 'Prism Lab - IIT Patna',
  description: 'Official website of Prism Research Lab at IIT Patna',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={DEFAULT_THEME}
          enableSystem={false}
          disableTransitionOnChange
          storageKey={THEME_STORAGE_KEY}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
