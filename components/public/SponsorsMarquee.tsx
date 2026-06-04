'use client'

interface Sponsor {
  name: string
  logoUrl: string
}

export default function SponsorsMarquee({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null

  // Duplicate the list of sponsors to ensure infinite scrolling covers viewport width
  const items = [...sponsors, ...sponsors, ...sponsors, ...sponsors]

  return (
    <div className="relative w-full overflow-hidden py-6 bg-slate-50 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-850">
      <div className="flex animate-marquee gap-12 items-center">
        {items.map((sponsor, index) => (
          <div
            key={index}
            className="flex items-center gap-3 shrink-0 select-none group px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-sm hover:shadow transition duration-300"
          >
            <div className="h-10 w-16 relative bg-slate-100 dark:bg-slate-950 rounded overflow-hidden flex items-center justify-center p-1 border border-slate-150 dark:border-slate-850">
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className="max-h-full max-w-full object-contain filter dark:brightness-95"
              />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {sponsor.name}
            </span>
          </div>
        ))}
      </div>

      {/* Left/Right fading gradients for smooth edge blend */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none" />
    </div>
  )
}
