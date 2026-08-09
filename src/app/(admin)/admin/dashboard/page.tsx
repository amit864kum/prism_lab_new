import Link from 'next/link'
import {
  BookOpen,
  Briefcase,
  Code2,
  Compass,
  FileText,
  Image,
  Images,
  Newspaper,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react'

const DASHBOARD_ITEMS = [
 
  {
    title: 'About Section',
    description: 'Edit the public lab introduction and academic overview.',
    href: '/admin/about',
    icon: FileText,
  },
  {
    title: 'News Items',
    description: 'Publish announcements, activities, and lab updates.',
    href: '/admin/news',
    icon: Newspaper,
  },
  {
    title: 'Research Areas',
    description: 'Manage core research domains and linked publications.',
    href: '/admin/research-areas',
    icon: Compass,
  },
  {
    title: 'Projects',
    description: 'Maintain funded projects, summaries, objectives, and links.',
    href: '/admin/projects',
    icon: Briefcase,
  },
  {
    title: 'Sponsors',
    description: 'Manage sponsor logos and collaboration records.',
    href: '/admin/sponsors',
    icon: ShieldCheck,
  },
  {
    title: 'Gallery',
    description: 'Curate lab photographs, events, and research snapshots.',
    href: '/admin/gallery',
    icon: Images,
  },
  {
    title: 'PI Profile',
    description: 'Edit principal investigator profile and academic sections.',
    href: '/admin/pi-profile',
    icon: User,
  },
  {
    title: 'Members',
    description: 'Manage research scholars, students, alumni, and interns.',
    href: '/admin/members',
    icon: Users,
  },
  {
    title: 'Publications',
    description: 'Maintain journals, conferences, datasets, patents, and talks.',
    href: '/admin/publications',
    icon: BookOpen,
  },
  {
    title: 'Developer',
    description: 'Control footer identity, contact details, and hero stat overrides.',
    href: '/admin/developer',
    icon: Code2,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#020814] px-6 py-10 text-white shadow-2xl shadow-slate-950/10 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_34%,rgba(14,165,233,0.25),transparent_32%),linear-gradient(120deg,#020713,#051a31_54%,#020711)]" />
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(to_right,rgba(125,211,252,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,0.18)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="relative max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-px w-8 bg-cyan-300" />
            PRISM Admin Console
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Academic Research Administration
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
            Manage the public PRISM Lab website content, research records, member profiles, publications,
            and institutional settings from one secure workspace.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Content Management</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Select a module to update the corresponding public website section.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DASHBOARD_ITEMS.map((item) => (
            <DashboardCard key={item.href} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  icon: any
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-black tracking-tight text-slate-950 group-hover:text-blue-700">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{description}</p>
    </Link>
  )
}
