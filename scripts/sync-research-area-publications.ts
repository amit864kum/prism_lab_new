import 'dotenv/config'
import { connectDB } from '@/lib/mongodb'
import Publication from '@/models/Publication'
import ResearchArea from '@/models/ResearchArea'

async function main() {
  await connectDB()

  const publications = await Publication.find({
    researchAreas: { $exists: true, $ne: [] },
  })

  for (const publication of publications) {
    await ResearchArea.updateMany(
      { _id: { $in: (publication.researchAreas || []).map((id) => id.toString()) } },
      { $addToSet: { publications: publication._id } }
    )
  }

  const researchAreas = await ResearchArea.find({
    publications: { $exists: true, $ne: [] },
  })

  for (const researchArea of researchAreas) {
    await Publication.updateMany(
      { _id: { $in: (researchArea.publications || []).map((id) => id.toString()) } },
      { $addToSet: { researchAreas: researchArea._id } }
    )
  }

  console.log('Research area publication references synced successfully.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Research area publication sync failed:', error)
    process.exit(1)
  })
