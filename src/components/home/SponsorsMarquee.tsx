'use client'

import SafeImage from '@/components/ui/SafeImage'

interface Sponsor {
  name: string
  logoUrl: string
}

const CorporateFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600">
    <svg
      className="w-5 h-5 opacity-60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.685 0-5.3.233-7.854.692V21m16.5 0A21.18 21.18 0 0112 19.5c-2.9 0-5.717.387-8.394 1.11M21 21H3"
      />
    </svg>
  </div>
)

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="flex items-center gap-3 shrink-0 select-none group px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
      <div className="h-12 w-20 relative bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800">
        <SafeImage
          src={sponsor.logoUrl}
          alt={sponsor.name}
          className="max-h-full max-w-full object-contain"
          fallback={<CorporateFallback />}
        />
      </div>

      <span className="text-base font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {sponsor.name}
      </span>
    </div>
  )
}

export default function SponsorsMarquee({
  sponsors,
}: {
  sponsors: Sponsor[]
}) {
  if (sponsors.length === 0) return null

  const shouldMarquee = sponsors.length > 5

  // CENTERED MODE (1–5 sponsors)
  if (!shouldMarquee) {
    return (
      <div className="w-full py-10 bg-slate-50 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-850">
        <div className="flex flex-wrap justify-center items-center gap-8 px-6">
          {sponsors.map((sponsor, index) => (
            <SponsorCard key={index} sponsor={sponsor} />
          ))}
        </div>
      </div>
    )
  }

  // MARQUEE MODE (6+ sponsors)
  return (
    <div className="relative w-full overflow-hidden py-8 bg-slate-50 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-850 flex">
      {/* Track 1 */}
      <div className="flex animate-marquee gap-12 pr-12 items-center shrink-0">
        {sponsors.map((sponsor, index) => (
          <SponsorCard key={index} sponsor={sponsor} />
        ))}
      </div>

      {/* Track 2 */}
      <div
        className="flex animate-marquee gap-12 pr-12 items-center shrink-0"
        aria-hidden="true"
      >
        {sponsors.map((sponsor, index) => (
          <SponsorCard key={`dup-${index}`} sponsor={sponsor} />
        ))}
      </div>

      {/* Edge fade */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent pointer-events-none z-10" />

      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent pointer-events-none z-10" />
    </div>
  )
}