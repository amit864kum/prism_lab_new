
import {
  Boxes,
  BrainCircuit,
  Cpu,
  RadioTower,
  Share2,
  TrendingUp
} from 'lucide-react'

const researchNodes = [
  // IoT → text above logo
  {
    label: 'Internet of Things',
    icon: RadioTower,
    className:
      'left-1/2 top-[1%] -translate-x-1/2 flex-col-reverse items-center text-center',
  },

  // Network Economics → text right
  {
    label: 'Network Economics',
    icon: TrendingUp,
    className:
      'right-[-15%] top-[28%] flex-row items-center gap-3 text-left',
  },

  // Mechanism Design → text below
  {
    label: 'Mechanism Design',
    icon: Cpu,
    className:
      'right-[7%] bottom-[18%] flex-col items-center text-center',
  },

  // Game Theory → logo in orbit, text below
  {
    label: 'Game-Theoretic Applications',
    icon: Share2,
    className:
      'left-1/2 bottom-[2%] -translate-x-1/2 flex-col items-center text-center',
  },

  // Blockchain
  {
    label: 'Blockchain',
    icon: Boxes,
    className:
      'left-[10%] bottom-[22%] flex-col items-center text-center',
  },

  // Machine Learning → text left
  {
    label: 'Machine Learning',
    icon: BrainCircuit,
    className:
      'left-[-15%] top-[28%] flex-row-reverse items-center gap-3 text-right',
  },
]

export default function OrbitalResearchSystem() {
  return (
    <div className="w-full overflow-hidden py-4 flex justify-center items-center">
      <div className="relative aspect-square w-[85%] sm:w-full max-w-[440px] lg:mr-4 xl:max-w-[490px] 2xl:max-w-[520px] scale-[0.85] sm:scale-100 origin-center">

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
  className={`absolute ${node.className} flex gap-2 sm:gap-3`}

          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/70 bg-slate-950/80 text-white shadow-[0_0_36px_rgba(59,130,246,0.30)] transition hover:-translate-y-1 hover:border-cyan-100 sm:h-16 sm:w-16">
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <span className="max-w-[120px] text-[10px] font-semibold leading-snug text-white sm:text-[12px] xl:text-sm">
              {node.label}
            </span>
          </div>
        )
      })}
      </div>
    </div>
  )
}
