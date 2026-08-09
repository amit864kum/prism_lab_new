import 'dotenv/config'
import { connectDB } from '@/lib/mongodb'
import Publication from '@/models/Publication'
import {
  LEGACY_PUBLICATION_TYPE_MAP,
  PUBLICATION_TYPES,
  normalizePublicationType,
} from '@/lib/publication-types'

async function main() {
  await connectDB()

  for (const type of PUBLICATION_TYPES) {
    const matchingTypes = Object.entries(LEGACY_PUBLICATION_TYPE_MAP)
      .filter(([, normalizedType]) => normalizedType === type)
      .map(([legacyType]) => legacyType)

    // Query the raw collection because this migration must read legacy values
    // that intentionally fall outside the current Mongoose enum.
    const publications = await Publication.collection.find({
      type: { $in: Array.from(new Set([type, ...matchingTypes])) },
    }).sort({ displayOrder: 1, year: -1, createdAt: 1 }).toArray()

    let order = 1
    for (const publication of publications) {
      const normalizedType = normalizePublicationType(publication.type)
      if (normalizedType !== type) continue

      await Publication.collection.updateOne(
        { _id: publication._id },
        { $set: { type: normalizedType, displayOrder: publication.displayOrder || order } }
      )
      order += 1
    }
  }

  console.log('Publication display orders migrated successfully.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Publication display order migration failed:', error)
    process.exit(1)
  })
