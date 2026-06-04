import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Prism Lab Admin</h1>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Content Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Hero Slides"
              description="Manage homepage carousel slides"
              href="/admin/hero-slides"
            />
            <DashboardCard
              title="About Section"
              description="Edit lab description"
              href="/admin/about"
            />
            <DashboardCard
              title="News Items"
              description="Manage news and updates"
              href="/admin/news"
            />
            <DashboardCard
              title="Research Areas"
              description="Manage research areas"
              href="/admin/research-areas"
            />
            <DashboardCard
              title="Projects"
              description="Manage lab projects"
              href="/admin/projects"
            />
            <DashboardCard
              title="Sponsors"
              description="Manage sponsors"
              href="/admin/sponsors"
            />
            <DashboardCard
              title="Gallery"
              description="Manage photo gallery"
              href="/admin/gallery"
            />
            <DashboardCard
              title="PI Profile"
              description="Edit PI information"
              href="/admin/pi-profile"
            />
            <DashboardCard
              title="Members"
              description="Manage lab members"
              href="/admin/members"
            />
            <DashboardCard
              title="Publications"
              description="Manage publications"
              href="/admin/publications"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  )
}
