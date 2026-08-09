import Link from 'next/link'
import { getHomepageContent } from '@/services/public-content.service'
import { appLogger } from '@/lib/logger'

import ResearchHero from '@/components/home/ResearchHero'
import SponsorsMarquee from '@/components/home/SponsorsMarquee'
import GalleryPreview from '@/components/home/GalleryPreview'
import MembersCarousel from '@/components/home/MembersCarousel'
import SafeImage from '@/components/ui/SafeImage'
import { formatDate, truncate } from '@/lib/utils'
import { sanitizeHTML } from '@/lib/sanitize'
import { ArrowRight, Compass, Briefcase, BookOpen, Calendar, Mail, User } from 'lucide-react'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let about: any = null
  let news: any[] = []
  let areas: any[] = []
  let piProfile: any = null
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
    piProfile = content.piProfile
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
    <div className="space-y-20 pb-20">
      {/* 1. Premium Hero */}
      <ResearchHero stats={heroStats} />

      {/* 2. About + News & Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* About Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
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
                href="/people/current-members"
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
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {area.title}
                  </h3>
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

     {/* Principal Investigator */}
<section className="relative bg-white py-8 sm:py-10 overflow-hidden">

  {/* subtle background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_28%)]" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section heading */}
    <div className="mb-10 flex items-center gap-4">
      <div className="h-[2px] w-14 bg-blue-700" />
      <span className="text-sm font-bold uppercase tracking-[0.24em] text-blue-700">
        Principal Investigator
      </span>
    </div>

    {/* Main Wrapper */}
    <div className="relative">

      {/* Main Card */}
      <div className="relative rounded-[36px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.08)] overflow-hidden">

<div className="grid lg:grid-cols-[320px_1fr] items-start">
          {/* LEFT SIDE */}
          <div className="relative flex justify-center lg:justify-start">

            {/* image overlap */}
            <div className="relative z-20 mx-auto lg:absolute lg:-top-18 lg:left-10 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_30px_60px_rgba(15,23,42,0.14)] w-[280px] sm:w-[320px]">

              {piProfile?.imageUrl ? (
                <SafeImage
                  src={piProfile.imageUrl}
                  alt={piProfile.name}
                  className="h-[350px] w-full object-cover object-top"
                  fallback={
                    <div className="flex h-[420px] items-center justify-center bg-slate-100">
                      <User className="h-24 w-24 text-slate-300" />
                    </div>
                  }
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-slate-100">
                  <User className="h-24 w-24 text-slate-300" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="px-8 pb-8 pt-8 lg:pl-[120px] lg:pr-12 lg:py-10">

            {/* label */}
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Faculty Profile
            </div>

            {/* Name */}
            <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {piProfile?.name || 'Dr. Satendra Kumar'}
            </h2>

            {/* designation */}
            <div className="mt-5">
              <p className="text-xl font-semibold text-slate-900">
                {piProfile?.designation || 'Assistant Professor'}
              </p>

              <p className="mt-1 text-slate-600">
                Department of Computer Science & Engineering
              </p>

              <p className="text-slate-600">
                Indian Institute of Technology Patna
              </p>
            </div>

            {/* Bio */}
            <div className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-600">

              {piProfile?.biography ? (
                <div
                  className="line-clamp-5"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(piProfile.biography),
                  }}
                />
              ) : (
                <p>
                  Leading interdisciplinary research in intelligent
                  systems, blockchain-enabled frameworks,
                  mechanism design, network economics,
                  game theory, IoT systems, and machine learning
                  with emphasis on scalable real-world impact.
                </p>
              )}
            </div>

            {/* Research domains */}
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
                Research Interests
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  'Blockchain',
                  'Mechanism Design',
                  'IoT',
                  'Machine Learning',
                  'Game Theory',
                  'Network Economics',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

              {/* Email */}
              {piProfile?.emails?.[0] && (
                <a
                  href={`mailto:${piProfile.emails[0]}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
                >
                  <Mail className="h-4 w-4" />
                  {piProfile.emails[0]}
                </a>
              )}

              {/* Button */}
              <Link
                href="/people/principal-investigator"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                View Full Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* 5. Projects Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Featured Projects
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-450 font-medium">
            Explore active and completed lab research projects sponsored by prominent organizations.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-slate-500 italic py-10">No projects listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project: any) => (
              <div
                key={project._id}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition p-6 flex gap-4 items-start group"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${project.status === 'ongoing'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                        : 'bg-green-105 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                        }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div
                    className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed prose dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(project.description) }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-4">
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
            href="/people/current-members"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition shadow-md shadow-blue-500/10"
          >
            Meet the Full Team
          </Link>
        </div>
      </section>

      {/* 7. Sponsors Marquee */}
      {sponsors.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Supported by & Collaborating with
            </h3>
          </div>
          <SponsorsMarquee
            sponsors={sponsors.map((s: any) => ({
              name: s.name,
              logoUrl: s.logoUrl,
            }))}
          />
        </section>
      )}

      {/* 8. Gallery Carousel Preview */}
      {galleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Lab Gallery & Activities
            </h2>
            <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-450 font-medium">
              Snapshots of group discussions, research showcases, workshops, and lab milestones.
            </p>
          </div>

          <GalleryPreview
            images={galleryImages.map((img: any) => ({
              imageUrl: img.imageUrl,
              caption: img.caption,
              category: img.category,
            }))}
          />

          <div className="text-center pt-4">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-300 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg transition"
            >
              Browse Gallery Archive
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
