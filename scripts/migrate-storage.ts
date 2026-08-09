import 'dotenv/config'
import { constants } from 'fs'
import { copyFile, mkdir, readdir, stat } from 'fs/promises'
import { dirname, join, relative, resolve, sep } from 'path'
import { connectDB } from '@/lib/mongodb'
import AboutSection from '@/models/AboutSection'
import Footer from '@/models/Footer'
import GalleryImage from '@/models/GalleryImage'
import HeroSlide from '@/models/HeroSlide'
import Member from '@/models/Member'
import NewsItem from '@/models/NewsItem'
import PIProfile from '@/models/PIProfile'
import Project from '@/models/Project'
import Publication from '@/models/Publication'
import ResearchArea from '@/models/ResearchArea'
import Sponsor from '@/models/Sponsor'

const legacyRoot = resolve(process.cwd(), 'public', 'uploads')
// Keep migration output aligned with the runtime storage location. Production
// releases set UPLOADS_ROOT to a durable directory outside the release tree.
const storageRoot = process.env.UPLOADS_ROOT
  ? resolve(process.env.UPLOADS_ROOT)
  : resolve(process.cwd(), 'uploads')
const apply = process.argv.includes('--apply')
const checkOrphans = process.argv.includes('--check-orphans')
const staleTemporaryAgeMs = 24 * 60 * 60 * 1000

async function walk(directory: string): Promise<string[]> {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error: any) {
    if (error?.code === 'ENOENT') return []
    throw error
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walk(path) : [path]
    })
  )
  return files.flat()
}

function relativeUploadUrl(filePath: string) {
  return `/uploads/${relative(legacyRoot, filePath).split(sep).join('/')}`
}

function collectUploadUrls(value: unknown, urls: Set<string>) {
  if (typeof value === 'string') {
    const matches = value.match(/\/uploads\/[A-Za-z0-9._/-]+/g) || []
    for (const match of matches) urls.add(match)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUploadUrls(item, urls)
    return
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectUploadUrls(item, urls)
  }
}

async function referencedUploadUrls() {
  await connectDB()
  const models: any[] = [
    AboutSection,
    Footer,
    GalleryImage,
    HeroSlide,
    Member,
    NewsItem,
    PIProfile,
    Project,
    Publication,
    ResearchArea,
    Sponsor,
  ]
  const documents = await Promise.all(models.map((model) => model.find({}).lean()))
  const urls = new Set<string>()
  collectUploadUrls(documents, urls)
  return urls
}

async function main() {
  console.log(`Runtime upload root: ${storageRoot}`)
  const legacyFiles = (await walk(legacyRoot)).filter((file) => !file.endsWith('.gitkeep'))
  let copied = 0
  let existing = 0

  for (const source of legacyFiles) {
    const destination = join(storageRoot, relative(legacyRoot, source))
    try {
      const [sourceInfo, destinationInfo] = await Promise.all([stat(source), stat(destination)])
      if (sourceInfo.size !== destinationInfo.size) {
        console.warn(`CONFLICT ${relative(legacyRoot, source)} (different file sizes)`)
      }
      existing += 1
      continue
    } catch (error: any) {
      if (error?.code !== 'ENOENT') throw error
    }

    console.log(`${apply ? 'COPY' : 'WOULD COPY'} ${relative(legacyRoot, source)}`)
    if (apply) {
      await mkdir(dirname(destination), { recursive: true })
      await copyFile(source, destination, constants.COPYFILE_EXCL)
      copied += 1
    }
  }

  console.log(`Legacy files: ${legacyFiles.length}; existing: ${existing}; ${apply ? 'copied' : 'to copy'}: ${apply ? copied : legacyFiles.length - existing}`)

  if (checkOrphans) {
    const referenced = await referencedUploadUrls()
    const allFiles = [
      ...(await walk(legacyRoot)),
      ...(await walk(storageRoot)),
    ].filter((file) => !file.endsWith('.gitkeep') && !file.includes(`${sep}temp${sep}`))
    const urls = new Set(allFiles.map((file) =>
      file.startsWith(legacyRoot)
        ? relativeUploadUrl(file)
        : `/uploads/${relative(storageRoot, file).split(sep).join('/')}`
    ))
    const orphans = Array.from(urls).filter((url) => !referenced.has(url)).sort()
    console.log(`Referenced URLs: ${referenced.size}; orphan candidates: ${orphans.length}`)
    for (const orphan of orphans) console.log(`ORPHAN CANDIDATE ${orphan}`)

    const temporaryFiles = await walk(join(storageRoot, 'temp'))
    const staleTemporaryFiles: string[] = []
    for (const file of temporaryFiles) {
      const details = await stat(file)
      if (Date.now() - details.mtimeMs >= staleTemporaryAgeMs) {
        staleTemporaryFiles.push(file)
      }
    }
    console.log(`Stale temporary-file candidates (24h+): ${staleTemporaryFiles.length}`)
    for (const file of staleTemporaryFiles) {
      console.log(`STALE TEMP CANDIDATE ${relative(storageRoot, file)}`)
    }
  }

  if (!apply) console.log('Dry run only. Re-run with --apply to copy; legacy files are never deleted.')
}

main().catch((error) => {
  console.error('Storage migration failed:', error)
  process.exitCode = 1
})
