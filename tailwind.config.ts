import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Required for next-themes class-based toggling
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      spacing: {
        // Tailwind v3 doesn't include 4.5 by default — used throughout as h-4.5, w-4.5, p-4.5
        '4.5': '1.125rem',
        // Other non-standard values used in the codebase
        '5.5': '1.375rem',
        '13': '3.25rem',
      },
      transitionDuration: {
        // Used as transition-transform duration-350 in Header drawer
        '350': '350ms',
      },
    },
  },
  plugins: [],
}
export default config
