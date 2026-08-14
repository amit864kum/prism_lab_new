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

function SponsorCard({ sponsor, marquee = false }: { sponsor: Sponsor; marquee?: boolean }) {
  return (
    <article
      className={`group relative flex min-h-52 select-none flex-col items-center justify-center px-6 py-7 text-center ${
        marquee ? 'w-64 shrink-0' : 'w-full'
      }`}
    >
      <div className="pointer-events-none absolute inset-4 scale-95 rounded-[2rem] bg-blue-500/[0.04] opacity-0 blur-sm transition duration-300 group-hover:scale-100 group-hover:opacity-100 dark:bg-blue-400/[0.06]" />
      <div className="relative flex h-28 w-full max-w-52 items-center justify-center p-3 transition duration-300 group-hover:-translate-y-1">
        <SafeImage
          src={sponsor.logoUrl}
          alt={sponsor.name}
          className="h-full w-full object-contain"
          fallback={<CorporateFallback />}
        />
      </div>

      <span className="relative mt-5 h-px w-10 bg-slate-200 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-400 dark:bg-slate-700" />
      <h3 className="relative mt-4 text-sm font-extrabold leading-6 tracking-wide text-slate-700 transition-colors group-hover:text-blue-700 dark:text-slate-300 dark:group-hover:text-blue-300 sm:text-base">
        {sponsor.name}
      </h3>
    </article>
  )
}

export default function SponsorsMarquee({
  sponsors,
}: {
  sponsors: Sponsor[]
}) {
  if (sponsors.length === 0) return null

  if (sponsors.length > 3) {
    return (
      <div className="sponsors-marquee relative w-full overflow-hidden py-1">
        <div className="flex w-max">
          <div className="animate-marquee flex shrink-0 items-stretch gap-6 pr-6">
            {sponsors.map((sponsor) => (
              <SponsorCard
                key={`primary-${sponsor.name}-${sponsor.logoUrl}`}
                sponsor={sponsor}
                marquee
              />
            ))}
          </div>
          <div
            className="animate-marquee flex shrink-0 items-stretch gap-6 pr-6"
            aria-hidden="true"
          >
            {sponsors.map((sponsor) => (
              <SponsorCard
                key={`duplicate-${sponsor.name}-${sponsor.logoUrl}`}
                sponsor={sponsor}
                marquee
              />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-50/95 to-transparent dark:from-slate-900/95 sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-50/95 to-transparent dark:from-slate-900/95 sm:w-24" />
      </div>
    )
  }

  return (
    <div className="px-5 sm:px-8 lg:px-12">
      <div
        className={`mx-auto grid divide-y divide-slate-200/80 dark:divide-slate-800/80 ${
          sponsors.length === 1
            ? 'max-w-sm grid-cols-1'
            : sponsors.length === 2
              ? 'max-w-2xl grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-y-0'
              : 'max-w-5xl grid-cols-1 sm:grid-cols-2 sm:[&>*:nth-child(even)]:border-l sm:[&>*:nth-child(even)]:border-slate-200/80 sm:dark:[&>*:nth-child(even)]:border-slate-800/80 lg:grid-cols-3 lg:[&>*]:border-l lg:[&>*]:border-slate-200/80 lg:[&>*:nth-child(3n+1)]:border-l-0 lg:dark:[&>*]:border-slate-800/80'
        }`}
      >
        {sponsors.map((sponsor) => (
          <SponsorCard key={`${sponsor.name}-${sponsor.logoUrl}`} sponsor={sponsor} />
        ))}
      </div>
    </div>
  )
}
