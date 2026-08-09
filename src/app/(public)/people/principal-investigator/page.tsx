import { getPublicPIProfile } from '@/services/public-content.service'
import PrincipalInvestigatorClient from '@/components/members/PrincipalInvestigatorClient'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

function serializePoints(item: any) {
  const points = Array.isArray(item.points)
    ? item.points
    : [{ text: item.description || item.content || '', link: '' }]

  return points
    .map((point: any) => ({
      text: point.text || '',
      link: point.link || '',
    }))
    .filter((point: any) => point.text.trim().length > 0)
}

function serializePointSection(items: any[] = [], metaKey?: 'duration' | 'year' | 'date') {
  return items.map((item: any) => ({
    title: item.title || '',
    points: serializePoints(item),
    ...(metaKey ? { [metaKey]: item[metaKey] || '' } : {}),
  }))
}

function serializeStringList(value: any, legacyValue?: any) {
  const values = Array.isArray(value) ? value : []
  if (typeof legacyValue === 'string' && legacyValue.trim()) {
    values.push(legacyValue)
  }

  return Array.from(
    new Set(
      values
        .filter((item: any) => typeof item === 'string')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0)
    )
  )
}

function serializePIPublications(items: any[] = []) {
  return items
    .map((item: any, index: number) => ({
      authors: item.authors || '',
      title: item.title || '',
      doiLink: item.doiLink || '',
      journalName: item.journalName || '',
      conferenceName: item.conferenceName || '',
      bookTitle: item.bookTitle || '',
      publisher: item.publisher || '',
      patentNumber: item.patentNumber || '',
      year: item.year || null,
      displayOrder: item.displayOrder || index + 1,
    }))
    .filter((item: any) => item.authors && item.title && item.year)
    .sort((a: any, b: any) => (a.displayOrder || 9999) - (b.displayOrder || 9999) || b.year - a.year)
}

export default async function PrincipalInvestigatorPage() {
  const piProfile = await getPublicPIProfile()

  // Serialize Mongoose ObjectIds for client component
  const serializedProfile = piProfile
    ? {
        ...piProfile,
        _id: piProfile._id.toString(),
        emails: serializeStringList((piProfile as any).emails, (piProfile as any).email),
        phoneNumbers: serializeStringList((piProfile as any).phoneNumbers, (piProfile as any).phoneNumber),
        education: (piProfile.education || []).map((edu: any) => ({
          degree: edu.degree,
          year: edu.year,
          thesis_title: edu.thesis_title || '',
          specialization: edu.specialization || '',
          supervisor: edu.supervisor || '',
          department: edu.department || '',
          institute: edu.institute || edu.institution || '',
          university: edu.university || '',
          grade: edu.grade || '',
        })),
        teaching: serializePointSection(piProfile.teaching || [], 'duration'),
        activities: serializePointSection(piProfile.activities || [], 'year'),
        achievements: serializePointSection(piProfile.achievements || [], 'date'),
        miscellaneous: serializePointSection(piProfile.miscellaneous || []),
        journalPublications: serializePIPublications((piProfile as any).journalPublications || []),
        conferencePublications: serializePIPublications((piProfile as any).conferencePublications || []),
        bookChapters: serializePIPublications((piProfile as any).bookChapters || []),
        patents: serializePIPublications((piProfile as any).patents || []),
        createdAt: piProfile.createdAt.toISOString(),
        updatedAt: piProfile.updatedAt.toISOString(),
      }
    : null

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
        />
      </div>
    </div>
  )
}
