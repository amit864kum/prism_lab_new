import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Member from '@/models/Member'
import Publication from '@/models/Publication'
import ResearchArea from '@/models/ResearchArea'
import Project from '@/models/Project'
import Sponsor from '@/models/Sponsor'
import GalleryImage from '@/models/GalleryImage'
import NewsItem from '@/models/NewsItem'
import HeroSlide from '@/models/HeroSlide'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get counts for all entities
    const [
      totalMembers,
      currentMembers,
      alumniMembers,
      phdScholars,
      mastersStudents,
      undergraduates,
      totalPublications,
      journalArticles,
      conferencePapers,
      workshopPapers,
      researchAreas,
      projects,
      ongoingProjects,
      completedProjects,
      sponsors,
      galleryImages,
      newsItems,
      heroSlides,
    ] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ status: 'current' }),
      Member.countDocuments({ status: 'alumni' }),
      Member.countDocuments({ role: 'PhD Scholar' }),
      Member.countDocuments({ role: 'Masters Student' }),
      Member.countDocuments({ role: 'Undergraduate' }),
      Publication.countDocuments(),
      Publication.countDocuments({ type: 'Journal Article' }),
      Publication.countDocuments({ type: 'Conference Paper' }),
      Publication.countDocuments({ type: 'Workshop Paper' }),
      ResearchArea.countDocuments(),
      Project.countDocuments(),
      Project.countDocuments({ status: 'ongoing' }),
      Project.countDocuments({ status: 'completed' }),
      Sponsor.countDocuments(),
      GalleryImage.countDocuments(),
      NewsItem.countDocuments(),
      HeroSlide.countDocuments(),
    ])

    return NextResponse.json({
      members: {
        total: totalMembers,
        current: currentMembers,
        alumni: alumniMembers,
        byRole: {
          phdScholars,
          mastersStudents,
          undergraduates,
        },
      },
      publications: {
        total: totalPublications,
        byType: {
          journalArticles,
          conferencePapers,
          workshopPapers,
        },
      },
      research: {
        areas: researchAreas,
        projects: {
          total: projects,
          ongoing: ongoingProjects,
          completed: completedProjects,
        },
      },
      content: {
        sponsors,
        galleryImages,
        newsItems,
        heroSlides,
      },
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
