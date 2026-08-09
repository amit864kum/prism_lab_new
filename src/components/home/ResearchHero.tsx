import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import HeroStats, { type HeroStatsValue } from './HeroStats'
import OrbitalResearchSystem from './OrbitalResearchSystem'

interface ResearchHeroProps {
  stats: HeroStatsValue
}

export default function ResearchHero({
  stats,
}: ResearchHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#020814] text-white min-h-[84vh] lg:min-h-[calc(100vh-95px)]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgba(0,115,255,0.32),transparent_30%),radial-gradient(circle_at_35%_78%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(112deg,#020713_0%,#041629_48%,#01050d_100%)]" />

      {/* Diagonal Ambient Light */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_38%,rgba(59,130,246,0.12)_50%,transparent_64%)]" />

      {/* Premium Radial Glow */}
      <div className="absolute right-[12%] top-1/2 h-[720px] w-[720px] -translate-y-1/2 rounded-full bg-blue-500/12 blur-[140px]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[18%] top-[28%] h-1 w-1 rounded-full bg-cyan-300 animate-pulse" />
        <div className="absolute right-[32%] top-[42%] h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        <div className="absolute left-[58%] top-[68%] h-1 w-1 rounded-full bg-sky-400 animate-pulse" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(79,170,255,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,170,255,0.2)_1px,transparent_1px)] bg-[size:46px_46px]" />

      {/* Network Mesh */}

      {/* Premium Intelligent Network Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Deep center glow */}
        <div className="absolute left-1/2 top-1/2 h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[180px]" />

        {/* Neural mesh */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.18]"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <g stroke="rgba(96,165,250,0.12)" strokeWidth="1">

            <line x1="80" y1="620" x2="260" y2="520" />
            <line x1="260" y1="520" x2="430" y2="600" />
            <line x1="430" y1="600" x2="680" y2="500" />
            <line x1="680" y1="500" x2="920" y2="570" />
            <line x1="920" y1="570" x2="1160" y2="470" />
            <line x1="1160" y1="470" x2="1440" y2="320" />

            <line x1="240" y1="320" x2="420" y2="260" />
            <line x1="420" y1="260" x2="620" y2="360" />
            <line x1="620" y1="360" x2="850" y2="300" />
            <line x1="850" y1="300" x2="1060" y2="380" />
            <line x1="1060" y1="380" x2="1300" y2="250" />

          </g>

          {/* glowing nodes */}
          <g fill="rgba(96,165,250,0.95)">
            <circle cx="80" cy="620" r="3" />
            <circle cx="260" cy="520" r="4" />
            <circle cx="430" cy="600" r="3" />
            <circle cx="680" cy="500" r="4" />
            <circle cx="920" cy="570" r="3" />
            <circle cx="1160" cy="470" r="4" />
            <circle cx="1440" cy="320" r="3" />

            <circle cx="240" cy="320" r="3" />
            <circle cx="420" cy="260" r="4" />
            <circle cx="620" cy="360" r="3" />
            <circle cx="850" cy="300" r="4" />
            <circle cx="1060" cy="380" r="3" />
            <circle cx="1300" cy="250" r="4" />
          </g>
        </svg>

        {/* Bottom animated wave like reference */}
        <div className="absolute bottom-0 left-0 h-[260px] w-full opacity-60">
          <svg
            className="h-full w-full"
            viewBox="0 0 1600 280"
            preserveAspectRatio="none"
          >
            <path
              d="M0,180 C180,130 320,250 520,180 C720,110 920,240 1120,180 C1320,120 1480,220 1600,180"
              fill="none"
              stroke="rgba(59,130,246,0.18)"
              strokeWidth="2"
            />

            <path
              d="M0,220 C220,160 420,260 620,210 C840,150 1040,250 1240,190 C1420,140 1540,210 1600,190"
              fill="none"
              stroke="rgba(96,165,250,0.12)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute left-[12%] top-[28%] h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
        <div className="absolute left-[24%] top-[52%] h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
        <div className="absolute left-[52%] top-[46%] h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
        <div className="absolute right-[18%] top-[32%] h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
        <div className="absolute right-[14%] top-[64%] h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
      </div>




      {/* Intelligent bottom wave */}
      <div className="absolute bottom-0 left-0 h-[220px] w-full overflow-hidden opacity-55">

        <svg
          className="absolute bottom-0 h-full w-full"
          viewBox="0 0 1600 260"
          preserveAspectRatio="none"
        >
          <path
            d="M0,180 C200,120 320,240 520,180 C740,110 920,240 1120,180 C1340,120 1480,220 1600,180"
            fill="none"
            stroke="rgba(59,130,246,0.18)"
            strokeWidth="2"
          >
            <animate
              attributeName="d"
              dur="18s"
              repeatCount="indefinite"
              values="
        M0,180 C200,120 320,240 520,180 C740,110 920,240 1120,180 C1340,120 1480,220 1600,180;
        M0,200 C220,140 340,220 540,190 C760,130 940,230 1140,170 C1360,130 1500,210 1600,190;
        M0,180 C200,120 320,240 520,180 C740,110 920,240 1120,180 C1340,120 1480,220 1600,180
        "
            />
          </path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto flex max-w-[1500px] flex-col px-4 pb-28 pt-16 sm:px-6 lg:min-h-[calc(100vh-95px)] lg:justify-between lg:px-12 lg:pb-12 lg:pt-6">

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[46%_54%] xl:gap-12">

          {/* Left Content */}
          <div className="max-w-[620px] lg:translate-x-6 lg:-translate-y-2">
            <div className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-cyan-300 xl:mb-6">
              <span className="h-px w-8 bg-cyan-300" />
              IIT Patna Research Lab
            </div>

            <h1 className="text-[clamp(2.8rem,min(4.7vw,7.5vh),5.2rem)] font-black leading-[0.88] tracking-tight text-white">
              Pervasive &<br />
              Intelligent<br />
              <span className="bg-gradient-to-r from-cyan-200 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Systems
              </span>
            </h1>

            <div className="mt-5 h-1 w-16 rounded-full bg-cyan-400 xl:mt-6" />

            <p className="mt-5 max-w-[540px] text-base font-normal leading-8 text-slate-200 xl:text-[18px]">
              Advancing the frontiers of intelligent systems through innovative
              research in emerging technologies and real-world applications.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row xl:mt-8">
              <Link
                href="/research/areas"
                className="inline-flex min-h-13 items-center justify-center gap-4 rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 px-7 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-600"
              >
                Explore Research
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/publications"
                className="inline-flex min-h-13 items-center justify-center gap-4 rounded-lg border border-white/75 bg-slate-950/10 px-7 py-3.5 text-[15px] font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
              >
                View Publications
                <FileText className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Right Orbital System */}
          <div className="relative flex justify-center lg:justify-end lg:translate-y-4 lg:-translate-x-16">
            <OrbitalResearchSystem />
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-20 mt-4 lg:-mt-3">
          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  )
}