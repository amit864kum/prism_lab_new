import type { MemberFilters } from '@/repositories/member.repository'
import {
  countCurrentPhdMembers,
  getMemberBySlugOrId,
  listCurrentMemberSitemapEntries,
  listMembers,
} from '@/repositories/member.repository'
import {
  countPublications,
  listPublications,
} from '@/repositories/publication.repository'
import {
  countResearchAreas,
  getResearchAreaBySlug,
  listResearchAreaSlugs,
  listResearchAreas,
} from '@/repositories/research-area.repository'
import { countProjects, getProjectBySlug, listProjects } from '@/repositories/project.repository'
import { getAboutSection } from '@/repositories/about.repository'
import { listNewsItems } from '@/repositories/news.repository'
import { listSponsors } from '@/repositories/sponsor.repository'
import { listGalleryImages } from '@/repositories/gallery.repository'
import { getFooter } from '@/repositories/footer.repository'

export const getPublicGalleryImages = listGalleryImages
export const getPublicProjects = listProjects
export const getPublicProjectBySlug = getProjectBySlug
export const getPublicMember = getMemberBySlugOrId
export const getPublicResearchArea = getResearchAreaBySlug

export function getPublicMembers(
  filters: MemberFilters,
  options: { sort?: Record<string, 1 | -1>; limit?: number } = {}
) {
  return listMembers(filters, options)
}

export async function getPublicMemberProfile(
  value: string,
  publicationOptions: {
    select?: string
    sort?: Record<string, 1 | -1>
  } = {}
) {
  const member = await getMemberBySlugOrId(value)
  if (!member) return { member: null, publications: [] }

  // A member profile is the complete publication record for that author:
  // include both global lab publications and profile-only publications.
  // The global Publications page remains isolated through its profileOnly:false filter.
  const publications = await listPublications(
    { authorId: member._id.toString() },
    {
      populate: true,
      authorSelect: 'name slug role',
      select: publicationOptions.select,
      sort: publicationOptions.sort,
    }
  )
  return { member, publications }
}

export function getPublicationsPageData() {
  return listPublications({ profileOnly: false }, { populate: true, authorSelect: 'name slug role' })
}

export async function getResearchAreaPageData(slug: string) {
  const area = await getResearchAreaBySlug(slug, true)
  if (!area) return { area: null, publications: [] }

  const explicit = Array.isArray((area as any).publications)
    ? (area as any).publications.filter(
        (publication: any) => publication?.title && publication.profileOnly !== true
      )
    : []
  const related = await listPublications(
    { researchAreaId: area._id.toString(), profileOnly: false },
    { populate: true, authorSelect: 'name slug role' }
  )

  const publicationMap = new Map<string, any>()
  for (const publication of [...explicit, ...related]) {
    publicationMap.set(publication._id.toString(), publication)
  }
  const publications = Array.from(publicationMap.values()).sort(
    (left, right) =>
      (left.displayOrder || 9999) - (right.displayOrder || 9999) || right.year - left.year
  )
  return { area, publications }
}

export async function getSitemapContent() {
  return Promise.all([listResearchAreaSlugs(), listCurrentMemberSitemapEntries()])
}

export async function getHomepageContent() {
  const [
    about,
    news,
    areas,
    projects,
    members,
    sponsors,
    galleryImages,
    totalPublications,
    totalResearchAreas,
    activeScholars,
    ongoingProjects,
    footer,
  ] = await Promise.all([
    getAboutSection(),
    listNewsItems(6),
    listResearchAreas(6),
    listProjects({ order: 1 }, 6),
    listMembers(
      { status: 'current', roleContains: 'ph' },
      { sort: { displayOrder: 1, yearJoined: -1, name: 1 }, limit: 4 }
    ),
    listSponsors(),
    listGalleryImages(),
    countPublications(),
    countResearchAreas(),
    countCurrentPhdMembers(),
    countProjects('ongoing'),
    getFooter(),
  ])

  return {
    about,
    news,
    areas,
    projects,
    members,
    sponsors,
    galleryImages,
    heroStats: {
      publications: footer?.heroPublicationsCount ?? totalPublications,
      researchAreas: footer?.heroResearchAreasCount ?? totalResearchAreas,
      scholars: footer?.heroScholarsCount ?? activeScholars,
      projects: footer?.heroProjectsCount ?? ongoingProjects,
    },
  }
}
