import { BrainCircuit, FileText, Trophy, Users } from 'lucide-react'

export interface HeroStatsValue {
  publications: number
  researchAreas: number
  scholars: number
  projects: number
}

const statItems = [
  { key: 'publications', label: 'Publications', sublabel: 'in Top Venues', icon: FileText },
  { key: 'researchAreas', label: 'Research Areas', sublabel: 'of Excellence', icon: BrainCircuit },
  { key: 'scholars', label: 'Active Research Scholars', sublabel: 'Current PhD Team', icon: Users },
  { key: 'projects', label: 'Ongoing Research Projects', sublabel: 'Funded Work', icon: Trophy },
] as const

export default function HeroStats({ stats }: { stats: HeroStatsValue }) {
  return (
    <div className="mx-auto mt-5 w-full max-w-[1390px] rounded-2xl border border-white/10 bg-slate-950/45 p-4 shadow-2xl shadow-black/20 backdrop-blur-md lg:mt-4 lg:w-[92%] xl:p-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.key} className="flex items-center gap-4 border-white/10 px-2 py-2 xl:border-r xl:last:border-r-0">
              <Icon className="h-10 w-10 flex-shrink-0 text-blue-400 xl:h-11 xl:w-11" />
              <div>
                <p className="text-3xl font-black leading-none text-white xl:text-[2.15rem]">{stats[item.key]}+</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-white xl:text-[15px]">{item.label}</p>
                <p className="text-xs font-medium text-slate-300 xl:text-[13px]">{item.sublabel}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
