import { connectDB } from '@/lib/mongodb'
import PIProfile from '@/models/PIProfile'
import Publication from '@/models/Publication'
import Member from '@/models/Member'
import PrincipalInvestigatorClient from '@/components/public/PrincipalInvestigatorClient'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

export default async function PrincipalInvestigatorPage() {
  await connectDB()

  const piProfile = await PIProfile.findOne().lean()
  
  // Fetch publications and populate authors
  const publications = await Publication.find()
    .sort({ year: -1, createdAt: -1 })
    .populate({
      path: 'authors',
      model: Member,
      select: 'name slug role',
    })
    .lean()

  // Serialize Mongoose ObjectIds for client component
  const serializedProfile = piProfile
    ? {
        ...piProfile,
        _id: piProfile._id.toString(),
        education: piProfile.education.map((edu: any) => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
        })),
        createdAt: piProfile.createdAt.toISOString(),
        updatedAt: piProfile.updatedAt.toISOString(),
      }
    : null

  const serializedPublications = publications.map((pub: any) => ({
    _id: pub._id.toString(),
    title: pub.title,
    slug: pub.slug,
    type: pub.type,
    authors: pub.authors.map((author: any) => ({
      _id: author._id.toString(),
      name: author.name,
      slug: author.slug,
      role: author.role,
    })),
    year: pub.year,
    venue: pub.venue || '',
    abstract: pub.abstract || '',
    pdfUrl: pub.pdfUrl || '',
    externalUrl: pub.externalUrl || '',
    tags: pub.tags || [],
  }))

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Principal Investigator
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Explore the research vision, curriculum vitæ, and academic activities of the Prism Lab director.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <PrincipalInvestigatorClient
          profile={serializedProfile}
          publications={serializedPublications}
        />
      </div>
    </div>
  )
}
