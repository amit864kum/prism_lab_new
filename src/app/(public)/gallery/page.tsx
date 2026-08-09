import { getPublicGalleryImages } from '@/services/public-content.service'
import GalleryClient from '@/components/gallery/GalleryClient'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const images = await getPublicGalleryImages()

  // Serialize Mongoose ObjectIds and dates
  const serializedImages = images.map((img: any) => ({
    _id: img._id.toString(),
    imageUrl: img.imageUrl,
    caption: img.caption || '',
    category: img.category || 'All',
    uploadDate: img.uploadDate.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Title Header */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Lab Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Visual glimpses of research presentations, team brainstorming sessions, outdoor group workshops, and memorable milestones at IIT Patna.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <GalleryClient initialImages={serializedImages} />
      </div>
    </div>
  )
}
