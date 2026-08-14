import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Landmark,
  Wallet,
} from 'lucide-react'
import { getPublicProjectBySlug } from '@/services/public-content.service'
import SafeImage from '@/components/ui/SafeImage'
import { sanitizeHTML } from '@/lib/sanitize'
import { formatMonthYear } from '@/utils/date'
import { stripHtml } from '@/utils/format'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found | PRISM Lab, IIT Patna',
    }
  }

  const description = stripHtml(
    (project as any).objective ||
      (project as any).description ||
      (project as any).detailedSummary ||
      ''
  )

  return {
    title: `${project.title} | Project | PRISM Lab, IIT Patna`,
    description: description.substring(0, 160),
    openGraph: {
      title: `${project.title} | Project | PRISM Lab, IIT Patna`,
      description: description.substring(0, 160),
      type: 'article',
      images: project.imageUrl ? [project.imageUrl] : undefined,
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const objectivePoints = Array.isArray((project as any).objectivePoints)
    ? (project as any).objectivePoints.filter((point: string) => point?.trim())
    : []

  const links = Array.isArray((project as any).links)
    ? (project as any).links.filter((link: any) => link?.title?.trim() && link?.url?.trim())
    : []

  const duration =
    project.status === 'ongoing'
      ? `${formatMonthYear(project.startDate) || 'Started'} - Present`
      : project.startDate || project.endDate
      ? `${formatMonthYear(project.startDate) || 'Started'}${
          project.endDate ? ` - ${formatMonthYear(project.endDate)}` : ''
        }`
      : ''

  return (
    <div className="project-page min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-16 text-white sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="max-w-4xl space-y-5">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                project.status === 'ongoing'
                  ? 'bg-amber-400/15 text-amber-200'
                  : 'bg-green-400/15 text-green-200'
              }`}
            >
              {project.status}
            </span>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <main className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {project.imageUrl && (
              <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
                <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-950">
                  <SafeImage
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {project.objective && (
              <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-xl font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  Objective
                </h2>
                <p className="text-sm font-medium leading-relaxed text-slate-650 dark:text-slate-350 sm:text-base">
                  {project.objective}
                </p>
              </section>
            )}

            {objectivePoints.length > 0 && (
              <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-xl font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Detailed Objectives
                </h2>
                <ol className="space-y-3">
                  {objectivePoints.map((point: string, index: number) => (
                    <li key={`${point}-${index}`} className="flex gap-3 text-sm leading-relaxed text-slate-650 dark:text-slate-350 sm:text-base">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {(project.projectAmount || project.sponsoredAgency) && (
              <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-xl font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <Landmark className="h-5 w-5 text-blue-500" />
                  Funding Details
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.projectAmount && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Wallet className="h-4 w-4 text-blue-500" />
                        Project Amount
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {project.projectAmount}
                      </p>
                    </div>
                  )}

                  {project.sponsoredAgency && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Landmark className="h-4 w-4 text-blue-500" />
                        Sponsored Agency
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {project.sponsoredAgency}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {project.description && (
              <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-xl font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Description
                </h2>
                <p className="text-sm font-medium leading-relaxed text-slate-650 dark:text-slate-350 sm:text-base">
                  {stripHtml(project.description)}
                </p>
              </section>
            )}

            {project.detailedSummary && (
              <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-xl font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Detailed Project Summary
                </h2>
                <div
                  className="prose max-w-none text-sm leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-400 sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(project.detailedSummary),
                  }}
                />
              </section>
            )}

            {links.length > 0 && (
              <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-xl font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <ExternalLink className="h-5 w-5 text-blue-500" />
                  Project Links
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {links.map((link: any, index: number) => (
                    <a
                      key={`${link.url}-${index}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open project link: ${link.title}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition hover:border-blue-300 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-900"
                    >
                      <span>{link.title}</span>
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
              <h2 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
                Project Information
              </h2>
              <div className="space-y-4 text-sm">
                {duration && (
                  <div className="flex gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Duration
                      </p>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{duration}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </p>
                    <p className="font-semibold capitalize text-slate-700 dark:text-slate-300">
                      {project.status}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
