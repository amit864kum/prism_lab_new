import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import HeroSlide from '@/models/HeroSlide'
import AboutSection from '@/models/AboutSection'
import NewsItem from '@/models/NewsItem'
import ResearchArea from '@/models/ResearchArea'
import PIProfile from '@/models/PIProfile'
import Project from '@/models/Project'
import Member from '@/models/Member'
import Sponsor from '@/models/Sponsor'
import GalleryImage from '@/models/GalleryImage'

import HeroCarousel from '@/components/public/HeroCarousel'
import SponsorsMarquee from '@/components/public/SponsorsMarquee'
import GalleryPreview from '@/components/public/GalleryPreview'
import MembersCarousel from '@/components/public/MembersCarousel'
import { formatDate, truncate } from '@/lib/utils'
import { Compass, Briefcase, BookOpen, Calendar, Mail, User } from 'lucide-react'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  await connectDB()

  // Fetch all homepage data concurrently
  const [
    slides,
    about,
    news,
    areas,
    piProfile,
    projects,
    members,
    sponsors,
    galleryImages,
  ] = await Promise.all([
    HeroSlide.find({ isActive: true }).sort({ order: 1 }).lean(),
    AboutSection.findOne().lean(),
    NewsItem.find().sort({ date: -1 }).limit(3).lean(),
    ResearchArea.find().sort({ order: 1 }).limit(6).lean(),
    PIProfile.findOne().lean(),
    Project.find().sort({ order: 1 }).limit(6).lean(),
    Member.find({ status: 'current' }).limit(8).lean(),
    Sponsor.find().sort({ order: 1 }).lean(),
    GalleryImage.find().sort({ uploadDate: -1 }).limit(6).lean(),
  ])

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Carousel */}
      <section>
        <HeroCarousel
          slides={slides.map((s: any) => ({
            imageUrl: s.imageUrl,
            title: s.title,
            subtitle: s.subtitle,
            ctaText: s.ctaText,
            ctaUrl: s.ctaUrl,
          }))}
        />
      </section>

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
                className="prose dark:prose-invert max-w-none text-slate-650 dark:text-slate-300 leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: about.content }}
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
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
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
                <div className="space-y-6">
                  {news.map((item: any) => (
                    <article key={item._id} className="space-y-2 group">
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

      {/* 4. Principal Investigator Spotlight */}
      <section className="bg-slate-50 dark:bg-slate-900/20 py-16 border-y border-slate-150 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* PI Image */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="h-72 w-72 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative">
                {piProfile?.imageUrl ? (
                  <img
                    src={piProfile.imageUrl}
                    alt={piProfile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-24 w-24 text-slate-300" />
                )}
              </div>
            </div>

            {/* PI Details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Lab Leadership
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {piProfile ? piProfile.name : 'Principal Investigator'}
                </h2>
                <p className="text-sm font-semibold text-slate-550 dark:text-slate-400">
                  {piProfile ? piProfile.title : 'IIT Patna Computer Science Faculty'}
                </p>
              </div>

              {piProfile?.bio ? (
                <div
                  className="text-slate-650 dark:text-slate-350 text-sm md:text-base leading-relaxed line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: piProfile.bio }}
                />
              ) : (
                <p className="text-slate-500 italic">
                  Leading the Prism Research Group in advanced computing architectures, AI research paradigms, and collaborative software projects.
                </p>
              )}

              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/people/principal-investigator"
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition"
                >
                  View Academic Profile
                </Link>
                {piProfile?.email && (
                  <a
                    href={`mailto:${piProfile.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-550 hover:text-blue-600 dark:text-slate-405 dark:hover:text-blue-400"
                  >
                    <Mail className="h-4.5 w-4.5" />
                    {piProfile.email}
                  </a>
                )}
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
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                        project.status === 'ongoing'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-green-105 text-green-800 dark:bg-green-950/30 dark:text-green-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/research/projects"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-slate-300 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg transition"
          >
            All Projects &rarr;
          </Link>
        </div>
      </section>

      {/* 6. Members Preview */}
      <section className="bg-slate-50 dark:bg-slate-900/10 py-16 border-y border-slate-150 dark:border-slate-850 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Our Research Team
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-450 font-medium">
            Meet the talented researchers, postgraduate scholars, and engineers pushing boundaries in the lab.
          </p>
        </div>

        {members.length === 0 ? (
          <p className="text-center text-slate-500 italic py-10">No members listed yet.</p>
        ) : (
          <MembersCarousel
            members={members.map((m: any) => ({
              _id: m._id.toString(),
              name: m.name,
              role: m.role,
              imageUrl: m.imageUrl,
            }))}
          />
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
