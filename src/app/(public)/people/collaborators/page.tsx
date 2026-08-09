import { Building2, GraduationCap, MapPin, Link2, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Collaborator {
  name: string
  location: string
  type: 'academic' | 'industry'
  representatives: string[]
  domains: string[]
  websiteUrl?: string
}

const COLLABORATORS: Collaborator[] = [
  {
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai, India',
    type: 'academic',
    representatives: ['Prof. Ramesh Kumar', 'Dr. Sneha Shah'],
    domains: ['Distributed Systems', 'Cloud Compiling'],
    websiteUrl: 'https://www.iitb.ac.in',
  },
  {
    name: 'Indian Institute of Science',
    location: 'Bangalore, India',
    type: 'academic',
    representatives: ['Prof. V. Srinivasan'],
    domains: ['Hardware-Software Codesign', 'AI Compilers'],
    websiteUrl: 'https://iisc.ac.in',
  },
  {
    name: 'National University of Singapore',
    location: 'Singapore',
    type: 'academic',
    representatives: ['Dr. Tan Wee Kiat'],
    domains: ['Parallel Architectures', 'Heterogeneous Systems'],
    websiteUrl: 'https://nus.edu.sg',
  },
  {
    name: 'Google Research India',
    location: 'Bangalore, India',
    type: 'industry',
    representatives: ['Dr. Anirudh Dev', 'Dr. Priya Mani'],
    domains: ['Efficient ML Systems', 'Large Scale Distributed Training'],
    websiteUrl: 'https://research.google',
  },
  {
    name: 'Intel Labs',
    location: 'Hillsboro, USA',
    type: 'industry',
    representatives: ['Dr. Charles Lindon'],
    domains: ['FPGA Prototyping', 'Memory Subsystem Optimizations'],
    websiteUrl: 'https://www.intel.com/content/www/us/en/research/intel-labs.html',
  },
  {
    name: 'NVIDIA Research',
    location: 'Santa Clara, USA',
    type: 'industry',
    representatives: ['Dr. Sarah Connor'],
    domains: ['GPU Architectures', 'Deep Learning Runtimes'],
    websiteUrl: 'https://www.nvidia.com/en-us/research/',
  },
]

export default function CollaboratorsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Title Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Research Collaborators
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Building systems and solving architecture problems requires diverse expertise. We are proud to partner with leading global institutions and labs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Academic Partners Section */}
        <div className="space-y-6">
          <div className="border-b border-slate-200/60 dark:border-slate-850 pb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Academic Collaborations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLABORATORS.filter((c) => c.type === 'academic').map((collab, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="space-y-4 z-10">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {collab.name}
                    </h3>
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      {collab.location}
                    </p>
                  </div>

                  {/* Representative Names */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Key Personnel
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                      {collab.representatives.join(', ')}
                    </p>
                  </div>

                  {/* Domains */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Collaborative Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {collab.domains.map((dom, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-800"
                        >
                          {dom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {collab.websiteUrl && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 z-10">
                    <a
                      href={collab.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-450 hover:underline"
                    >
                      Visit Institution Site
                      <Link2 className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Industry Partners Section */}
        <div className="space-y-6 pt-6">
          <div className="border-b border-slate-200/60 dark:border-slate-850 pb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Industrial Collaborations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLABORATORS.filter((c) => c.type === 'industry').map((collab, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="space-y-4 z-10">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {collab.name}
                    </h3>
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      {collab.location}
                    </p>
                  </div>

                  {/* Representative Names */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Key Personnel
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                      {collab.representatives.join(', ')}
                    </p>
                  </div>

                  {/* Domains */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Collaborative Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {collab.domains.map((dom, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-800"
                        >
                          {dom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {collab.websiteUrl && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 z-10">
                    <a
                      href={collab.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-450 hover:underline"
                    >
                      Visit Corporate Labs Site
                      <Link2 className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
