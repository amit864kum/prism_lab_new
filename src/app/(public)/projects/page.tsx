import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, Briefcase, Building2, Wallet } from 'lucide-react'
import { getPublicProjects } from '@/services/public-content.service'
import { stripHtml, truncate } from '@/utils/format'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects | PRISM Lab, IIT Patna',
  description:
    'Explore funded and collaborative research projects from PRISM Lab at IIT Patna.',
  openGraph: {
    title: 'Projects | PRISM Lab, IIT Patna',
    description:
      'Explore funded and collaborative research projects from PRISM Lab at IIT Patna.',
    type: 'website',
  },
}

export default async function ProjectsPage() {
  const projects = await getPublicProjects({ status: 1, createdAt: -1 })

  const serializedProjects = projects.map((project: any) => ({
    _id: project._id.toString(),
    title: project.title || '',
    slug: project.slug || '',
    description: truncate(stripHtml(project.description || ''), 180),
    projectAmount: project.projectAmount || '',
    sponsoredAgency: project.sponsoredAgency || '',
    status: project.status || 'ongoing',
  }))

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Research Projects
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Explore PRISM Lab&apos;s funded, sponsored, and collaborative research projects.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {serializedProjects.length === 0 ? (
          <div className="py-24 bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl text-center text-slate-500 italic shadow-sm">
            No projects have been published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {serializedProjects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project.slug}`}
                aria-label={`View project details for ${project.title}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800/60 dark:bg-slate-900 dark:focus-visible:ring-offset-slate-950 sm:p-6"
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                        project.status === 'ongoing'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-extrabold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {project.title}
                    </h2>
                    {project.description && (
                      <p className="line-clamp-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {(project.sponsoredAgency || project.projectAmount) && (
                    <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                      {project.sponsoredAgency && (
                        <p className="flex items-start gap-2">
                          <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                          <span>{project.sponsoredAgency}</span>
                        </p>
                      )}
                      {project.projectAmount && (
                        <p className="flex items-start gap-2">
                          <Wallet className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                          <span>{project.projectAmount}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm shadow-blue-500/10 transition group-hover:bg-blue-700">
                    View Details
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
