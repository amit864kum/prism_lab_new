
import type { SVGProps } from 'react'
import {
  Boxes,
  RadioTower,
  TrendingUp
} from 'lucide-react'

function MobileEdgeComputingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M8 8h8M12 4a6.5 6.5 0 0 1 0 8M12 4a6.5 6.5 0 0 0 0 8" />
      <path d="m9 11-3 4M15 11l3 4M12 12v3" />
      <rect x="3" y="15" width="5" height="6" rx="1" />
      <rect x="9.5" y="15" width="5" height="6" rx="1" />
      <rect x="16" y="15" width="5" height="6" rx="1" />
    </svg>
  )
}

function AiEducationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m7 7 5-3 5 3-5 3-5-3Z" />
      <path d="M17 7v4M9 9v2.5c1.8 1.3 4.2 1.3 6 0V9" />
      <circle cx="5" cy="17" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
      <circle cx="19" cy="17" r="1.5" />
      <path d="m6.4 16.5 4.2-2.2M13.4 14.3l4.2 2.2M12 14v3.5" />
      <circle cx="12" cy="14" r="1" />
    </svg>
  )
}

function GameTheoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M8.8 10c.6-1.8 1.7-2.7 3.2-2.7s2.6.9 3.2 2.7" />
      <circle cx="5" cy="17" r="2" />
      <path d="M2 22c.5-1.8 1.5-2.7 3-2.7S7.5 20.2 8 22" />
      <circle cx="19" cy="17" r="2" />
      <path d="M16 22c.5-1.8 1.5-2.7 3-2.7s2.5.9 3 2.7" />
      <path d="m9.5 9-3 5M14.5 9l3 5M8 17h8" />
    </svg>
  )
}

const researchNodes = [
  // Mobile Edge Computing → text above logo
  {
    label: 'Mobile Edge Computing',
    icon: MobileEdgeComputingIcon,
    className:
      'left-1/2 top-0 -translate-x-1/2 flex-col-reverse items-center text-center sm:top-[1%]',
  },

  // Network Economics → text right
  {
    label: 'Network Economics',
    icon: TrendingUp,
    className:
      'right-[2%] top-[24%] flex-col items-center text-center sm:right-[-15%] sm:top-[28%] sm:flex-row sm:text-left',
  },

  // AI for Education → text below
  {
    label: 'AI for Education',
    icon: AiEducationIcon,
    className:
      'right-[2%] bottom-[17%] flex-col items-center text-center sm:right-[7%] sm:bottom-[18%]',
  },

  // Game Theory → logo in orbit, text below
  {
    label: 'Game Theory',
    icon: GameTheoryIcon,
    className:
      'left-1/2 bottom-0 -translate-x-1/2 flex-col items-center text-center sm:bottom-[2%]',
  },

  // Blockchain
  {
    label: 'Blockchain',
    icon: Boxes,
    className:
      'left-[2%] bottom-[17%] flex-col items-center text-center sm:left-[10%] sm:bottom-[22%]',
  },

  // 5G and Beyond → text left
  {
    label: '5G and Beyond',
    icon: RadioTower,
    className:
      'left-[2%] top-[24%] flex-col items-center text-center sm:left-[-5%] sm:top-[28%] sm:flex-row-reverse sm:text-right',
  },
]

export default function OrbitalResearchSystem() {
  return (
    <div
      className="flex w-full items-center justify-center overflow-hidden py-4"
      data-testid="hero-orbital-system"
    >
      <div className="relative aspect-square w-full max-w-[440px] lg:mr-4 xl:max-w-[490px] 2xl:max-w-[520px]">

      {/* Outer Orbit */}
      <div className="absolute inset-[15%] rounded-full border border-cyan-100/65 shadow-[0_0_42px_rgba(59,130,246,0.24)]" />

      {/* Middle Orbit */}
      <div className="absolute inset-[27%] rounded-full border border-blue-300/20 bg-blue-500/5" />

      {/* Inner Orbit */}
      <div className="absolute inset-[38%] rounded-full border border-cyan-300/10 bg-slate-950/20" />

      {/* Orbit Line */}
      <div className="hero-orbit-line absolute inset-[14%] rounded-full border border-cyan-300/20 shadow-[0_0_28px_rgba(59,130,246,0.18)]" />

      {/* Center Prism System */}
      <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">

        {/* Neural Glow */}
        <div className="absolute inset-[-35%] rounded-full bg-cyan-400/10 blur-[70px]" />

        {/* Outer Ring */}
        <div className="absolute inset-[-15%] rounded-full border border-cyan-400/10" />

        {/* Neural Mesh Sphere */}
        <svg
          className="absolute inset-[-8%] h-[116%] w-[116%] opacity-40"
          viewBox="0 0 300 300"
        >
          <g stroke="rgba(96,165,250,0.16)" strokeWidth="1">
            <line x1="80" y1="70" x2="140" y2="40" />
            <line x1="140" y1="40" x2="210" y2="80" />
            <line x1="210" y1="80" x2="230" y2="150" />
            <line x1="230" y1="150" x2="180" y2="220" />
            <line x1="180" y1="220" x2="90" y2="210" />
            <line x1="90" y1="210" x2="60" y2="140" />
            <line x1="60" y1="140" x2="80" y2="70" />
          </g>

          <g fill="rgba(96,165,250,0.9)">
            <circle cx="80" cy="70" r="2.5" />
            <circle cx="140" cy="40" r="3" />
            <circle cx="210" cy="80" r="2.5" />
            <circle cx="230" cy="150" r="3" />
            <circle cx="180" cy="220" r="2.5" />
            <circle cx="90" cy="210" r="3" />
            <circle cx="60" cy="140" r="2.5" />
          </g>
        </svg>

        {/* Center Circle */}
        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-cyan-300/20 bg-slate-950/45 shadow-[0_0_120px_rgba(59,130,246,0.35)] backdrop-blur">

          <div
            className="hero-prism-symbol animate-[float_7s_ease-in-out_infinite]"
            aria-label="Triangular prism symbol"
          >
            <span className="hero-prism-face hero-prism-face-left" />
            <span className="hero-prism-face hero-prism-face-right" />
            <span className="hero-prism-face hero-prism-face-bottom" />
          </div>
        </div>
      </div>

      {/* Research Nodes */}
      {researchNodes.map((node) => {
        const Icon = node.icon

        return (
          <div
            key={node.label}
            data-research-node={node.label}
            className={`absolute ${node.className} flex gap-1.5 sm:gap-3`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/70 bg-slate-950/80 text-white shadow-[0_0_36px_rgba(59,130,246,0.30)] transition hover:-translate-y-1 hover:border-cyan-100 sm:h-16 sm:w-16">
              <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>

            <span className="max-w-[100px] text-[9px] font-semibold leading-[1.2] text-white sm:max-w-[120px] sm:text-[12px] sm:leading-snug xl:text-sm">
              {node.label}
            </span>
          </div>
        )
      })}
      </div>
    </div>
  )
}
