import { connectDB } from '@/lib/mongodb'
import PIProfile from '@/models/PIProfile'
import Publication from '@/models/Publication'
import { normalizePublicationType } from '@/lib/publication-types'

function migratePoints(item: any) {
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

function migratePointSection(items: any[] = [], metaKey?: 'duration' | 'year' | 'date') {
  return items
    .map((item: any) => ({
      title: item.title || '',
      points: migratePoints(item),
      ...(metaKey ? { [metaKey]: item[metaKey] || undefined } : {}),
    }))
    .filter((item: any) => item.title.trim().length > 0 && item.points.length > 0)
}

function migrateStringList(value: any, legacyValue?: any) {
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

async function migratePIProfiles() {
  const profiles = await PIProfile.find()
  let updatedCount = 0

  for (const profile of profiles) {
    const education = (profile.education || []).map((item: any) => ({
      degree: item.degree,
      year: item.year,
      thesis_title: item.thesis_title || '',
      specialization: item.specialization || '',
      supervisor: item.supervisor || '',
      department: item.department || '',
      institute: item.institute || item.institution || '',
      university: item.university || '',
      grade: item.grade || '',
    }))

    profile.set({
      emails: migrateStringList((profile as any).emails, (profile as any).email),
      phoneNumbers: migrateStringList((profile as any).phoneNumbers, (profile as any).phoneNumber),
      education,
      teaching: migratePointSection((profile as any).teaching || [], 'duration'),
      activities: migratePointSection((profile as any).activities || [], 'year'),
      achievements: migratePointSection((profile as any).achievements || [], 'date'),
      miscellaneous: migratePointSection((profile as any).miscellaneous || []),
    })

    await profile.save()
    updatedCount += 1
  }

  return updatedCount
}

async function migratePublications() {
  const publications = await Publication.find()
  let updatedCount = 0

  for (const publication of publications) {
    const normalizedType = normalizePublicationType(publication.type)
    if (publication.type !== normalizedType) {
      publication.type = normalizedType
      await publication.save()
      updatedCount += 1
    }
  }

  return updatedCount
}

async function main() {
  await connectDB()

  const [profileCount, publicationCount] = await Promise.all([
    migratePIProfiles(),
    migratePublications(),
  ])

  console.log(`Migrated ${profileCount} PI profile(s).`)
  console.log(`Migrated ${publicationCount} publication type(s).`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
