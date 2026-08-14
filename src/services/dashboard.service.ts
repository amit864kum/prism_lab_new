import { countMembers } from '@/repositories/member.repository'
import { countPublications } from '@/repositories/publication.repository'
import { countResearchAreas } from '@/repositories/research-area.repository'
import { countProjects } from '@/repositories/project.repository'
import { countSponsors } from '@/repositories/sponsor.repository'
import { countGalleryImages } from '@/repositories/gallery.repository'
import { countNewsItems } from '@/repositories/news.repository'

export async function getDashboardStatistics() {
  const [
    totalMembers,
    currentMembers,
    alumniMembers,
    completedMembers,
    phdScholars,
    mastersStudents,
    undergraduates,
    totalPublications,
    journalArticles,
    conferencePapers,
    researchAreas,
    projects,
    ongoingProjects,
    completedProjects,
    sponsors,
    galleryImages,
    newsItems,
  ] = await Promise.all([
    countMembers(),
    countMembers({ status: 'current' }),
    countMembers({ status: 'alumni' }),
    countMembers({ status: 'completed' }),
    countMembers({ role: 'PhD Scholar' }),
    countMembers({ role: 'Masters Student' }),
    countMembers({ role: 'Undergraduate' }),
    countPublications(),
    countPublications('journal'),
    countPublications('conference'),
    countResearchAreas(),
    countProjects(),
    countProjects('ongoing'),
    countProjects('completed'),
    countSponsors(),
    countGalleryImages(),
    countNewsItems(),
  ])

  return {
    members: {
      total: totalMembers,
      current: currentMembers,
      alumni: alumniMembers,
      completed: completedMembers,
      byRole: { phdScholars, mastersStudents, undergraduates },
    },
    publications: { total: totalPublications, byType: { journalArticles, conferencePapers } },
    research: {
      areas: researchAreas,
      projects: { total: projects, ongoing: ongoingProjects, completed: completedProjects },
    },
    content: { sponsors, galleryImages, newsItems },
  }
}
