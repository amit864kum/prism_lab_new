import Link from 'next/link'
import { getHomepageContent } from '@/services/public-content.service'
import { appLogger } from '@/lib/logger'

import ResearchHero from '@/components/home/ResearchHero'
import SponsorsMarquee from '@/components/home/SponsorsMarquee'
import GalleryPreview from '@/components/home/GalleryPreview'
import MembersCarousel from '@/components/home/MembersCarousel'
import { formatDate, truncate } from '@/lib/utils'
import { sanitizeHTML } from '@/lib/sanitize'
import { Compass, Briefcase, BookOpen, Calendar } from 'lucide-react'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let about: any = null
  let news: any[] = []
  let areas: any[] = []
  let projects: any[] = []
  let members: any[] = []
  let sponsors: any[] = []
  let galleryImages: any[] = []
  let heroStats = {
    publications: 0,
    researchAreas: 0,
    scholars: 0,
    projects: 0,
  }

  try {
    const content = await getHomepageContent()

    about = content.about
    news = content.news
    areas = content.areas
    projects = content.projects
    members = content.members
    sponsors = content.sponsors
    galleryImages = content.galleryImages
    heroStats = content.heroStats
  } catch (error) {
    appLogger.error('Homepage data fetch failed', { error })
  }

  const shouldAnimateNews = news.length > 1

  return (
    <div className="landing-page space-y-20 pb-20">
      {/* 1. Premium Hero */}
      <ResearchHero stats={heroStats} />

      {/* 2. About + News & Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* About Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="landing-heading-left text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                About the Laboratory
              </h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded" />
            </div>
            {about ? (
              <div
                className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(about.content) }}
              />
            ) : (
              <p className="text-slate-500 italic">
                The Prism Lab at IIT Patna focuses on advanced computing research, artificial intelligence, and software engineering systems.
              </p>
            )}
            <div className="pt-2">
              <Link
                href="/members"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Meet our research scholars &rarr;
              </Link>
            </div>
          </div>

          {/* News Sidebar Column */}
          <div id="news-events" className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between scroll-mt-28">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  News & Events
                </h3>
              </div>

              {news.length === 0 ? (
                <p className="text-sm text-slate-500 italic py-6">No news announcements posted yet.</p>
              ) : (
                <div className="relative h-72 sm:h-80 overflow-hidden group/news">
                  <div className={shouldAnimateNews ? 'animate-news-scroll' : ''}>
                    {[0, 1].slice(0, shouldAnimateNews ? 2 : 1).map((loopIndex) => (
                      <div
                        key={loopIndex}
                        className="space-y-6 pb-6"
                        aria-hidden={loopIndex > 0}
                      >
                        {news.map((item: any) => (
                          <article key={`${item._id}-${loopIndex}`} className="space-y-2 group">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                              {formatDate(item.date)}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {truncate(item.content.replace(/<[^>]*>/g, ''), 140)}
                            </p>
                          </article>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Research Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Core Research Domains
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-450 font-medium">
            Explore the specialized theoretical and applied computer science fields we investigate.
          </p>
        </div>

        {areas.length === 0 ? (
          <p className="text-center text-slate-500 italic py-10">No research areas published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area: any) => (
              <div
                key={area._id}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between p-6 group"
              >
                <div className="space-y-4">
                  <div className="research-domain-card-header flex flex-col items-start gap-4 md:flex-row md:items-center">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Compass className="h-6 w-6" />
                    </div>
                    <h3 className="research-domain-card-title font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {area.title}
                    </h3>
                  </div>
                  <p className="text-slate-550 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {area.description}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={`/research/areas/${area.slug}`}
                    className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Explore Domain Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/research/areas"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-300 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg transition"
          >
            All Research Areas
          </Link>
        </div>
      </section>

      {/* 4. Projects Preview */}
      <section className="featured-projects-section mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="featured-projects-heading text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Featured Projects
          </h2>
          <p className="featured-projects-intro mx-auto max-w-xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
            Explore active and completed lab research projects sponsored by prominent organizations.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-slate-500 italic py-10">No projects listed yet.</p>
        ) : (
          <div
            className={`grid grid-cols-1 gap-8 ${projects.length === 1
              ? 'mx-auto max-w-4xl'
              : 'md:grid-cols-2'
              }`}
          >
            {projects.map((project: any) => (
              <div
                key={project._id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_55px_rgba(37,99,235,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 sm:p-7"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="featured-project-card-title text-lg font-black leading-7 text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-xl">
                        {project.title}
                      </h3>
                      <span
                        className={`inline-flex w-fit flex-shrink-0 items-center rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${project.status === 'ongoing'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                          }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div
                      className="featured-project-card-copy prose mt-4 max-w-none text-sm leading-6 text-slate-600 prose-headings:my-0 prose-ol:my-0 prose-p:my-0 prose-ul:my-0 line-clamp-3 dark:prose-invert dark:text-slate-400"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(project.description) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-300 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg transition"
          >
            All Projects &rarr;
          </Link>
        </div>
      </section>

      {/* 6. Members Preview */}
      <section className="bg-slate-50 dark:bg-slate-900/10 py-16 border-y border-slate-150 dark:border-slate-850 space-y-10">
        <div className="text-center space-y-3 px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Our Research Team
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-450 font-medium">
            Meet our current Ph.D. research scholars actively contributing to cutting-edge research at PRISM Lab.
          </p>
        </div>

        {members.length === 0 ? (
          <p className="text-center text-slate-500 italic py-10 px-4">No members listed yet.</p>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8">
            <MembersCarousel
              members={members.map((m: any) => ({
                _id: m._id.toString(),
                slug: m.slug,
                name: m.name,
                role: m.role,
                imageUrl: m.imageUrl,
              }))}
            />
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/members"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition shadow-md shadow-blue-500/10"
          >
            Meet the Full Team
          </Link>
        </div>
      </section>

      {/* 7. Sponsors Marquee */}
      {sponsors.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-slate-50/70 py-12 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/50 sm:py-14">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-36 w-3/4 -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-3xl" />
            <div className="relative flex items-center justify-center gap-5 px-6">
              <span className="h-px max-w-28 flex-1 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
              <h2 className="text-center text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Our Sponsors
              </h2>
              <span className="h-px max-w-28 flex-1 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
            </div>
            <div className="relative mt-7">
              <SponsorsMarquee
                sponsors={sponsors.map((s: any) => ({
                  name: s.name,
                  logoUrl: s.logoUrl,
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* 8. Gallery Carousel Preview */}
      {galleryImages.length > 0 && (
        <section
          id="gallery"
          className="mx-auto max-w-7xl scroll-mt-28 space-y-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Gallery
            </h2>
          </div>

          <GalleryPreview
            images={galleryImages.map((img: any) => ({
              imageUrl: img.imageUrl,
              caption: img.caption,
              category: img.category,
            }))}
          />
        </section>
      )}
    </div>
  )
}
