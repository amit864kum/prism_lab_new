import { readFile } from 'fs/promises'
import { basename, resolve } from 'path'

const baseUrl = (process.env.BASE_URL || '').replace(/\/$/, '')
const email = process.env.STAGING_ADMIN_EMAIL || ''
const password = process.env.STAGING_ADMIN_PASSWORD || ''

if (process.env.STAGING_CONFIRM !== 'isolated-only') {
  throw new Error('Set STAGING_CONFIRM=isolated-only after verifying this is not production')
}
if (!baseUrl || !email || !password) {
  throw new Error('BASE_URL, STAGING_ADMIN_EMAIL, and STAGING_ADMIN_PASSWORD are required')
}
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseUrl) && process.env.ALLOW_REMOTE_STAGING !== 'yes') {
  throw new Error('Remote targets require ALLOW_REMOTE_STAGING=yes')
}

type JsonObject = Record<string, any>
type CleanupEntry = { path: string; label: string }

let cookie = ''
const cleanup: CleanupEntry[] = []

function idOf(value: any) {
  const id = value?._id
  if (!id) throw new Error('Response did not include an _id')
  return String(id)
}

async function request(
  path: string,
  options: { method?: string; body?: JsonObject; expected?: number[] } = {}
) {
  const method = options.method || 'GET'
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(method === 'GET' ? {} : { Origin: baseUrl }),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    redirect: 'manual',
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}
  const expected = options.expected || [200]
  if (!expected.includes(response.status)) {
    throw new Error(`${method} ${path} returned ${response.status}: ${text}`)
  }
  return { data, response }
}

async function upload(fixture: string, type: 'image' | 'pdf', subfolder: string) {
  const bytes = await readFile(resolve(process.cwd(), fixture))
  const mimeType = type === 'pdf' ? 'application/pdf' : fixture.endsWith('.jpg') || fixture.endsWith('.jpeg') ? 'image/jpeg' : 'image/png'
  const form = new FormData()
  form.set('file', new File([bytes], basename(fixture), { type: mimeType }))
  form.set('type', type)
  form.set('subfolder', subfolder)
  const response = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    headers: { Cookie: cookie, Origin: baseUrl },
    body: form,
  })
  const data = await response.json() as JsonObject
  if (!response.ok || typeof data.url !== 'string') {
    throw new Error(`Upload failed (${response.status}): ${JSON.stringify(data)}`)
  }
  return data.url as string
}

async function removeCreatedEntries() {
  for (const entry of cleanup.reverse()) {
    try {
      await request(entry.path, { method: 'DELETE' })
      console.log(`CLEANUP ${entry.label}`)
    } catch (error) {
      console.error(`CLEANUP FAILED ${entry.label}`, error)
    }
  }
}

async function main() {
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  const setCookie = login.response.headers.get('set-cookie')
  if (!setCookie) throw new Error('Login did not return an authentication cookie')
  cookie = setCookie.split(';', 1)[0]
  console.log('PASS admin login')

  await request('/api/about', {
    method: 'PUT',
    body: { content: '<p>Isolated staging rehearsal content</p>' },
  })
  await request('/api/footer', {
    method: 'PUT',
    body: {
      copyrightText: 'Staging copyright',
      developerName: 'Staging Operator',
      developerLink: 'https://example.org',
      prismLogoUrl: '/uploads/logos/1781176012722-0v9lgt.png',
      address: 'Isolated staging',
      contactNumber: '',
      email: '',
      googleMapsEmbedUrl: '',
      heroPublicationsCount: 1,
      heroResearchAreasCount: 1,
      heroScholarsCount: 1,
      heroProjectsCount: 1,
    },
  })
  const piPayload = {
    name: 'Staging Principal Investigator',
    title: 'Professor',
    bio: 'Isolated staging profile',
    imageUrl: '',
    emails: ['staging-pi@example.org'],
    officeLocation: 'Staging office',
    phoneNumbers: [],
    researchInterests: ['Staging systems'],
    education: [],
    teaching: [],
    activities: [],
    achievements: [],
    miscellaneous: [],
    journalPublications: [],
    conferencePublications: [],
    bookChapters: [],
    patents: [],
  }
  await request('/api/pi-profile', { method: 'POST', body: piPayload, expected: [200, 201] })
  await request('/api/pi-profile', {
    method: 'PUT',
    body: { ...piPayload, bio: 'Updated isolated staging profile' },
  })
  console.log('PASS singleton CMS create/update')

  const firstHeroUpload = await upload('public/images/prism-emblem.png', 'image', 'hero')
  const secondHeroUpload = await upload('public/images/prism-emblem.png', 'image', 'hero')
  const publicationUpload = await upload('tests/fixtures/safe-sample.pdf', 'pdf', 'publications')
  console.log('PASS image/PDF staging uploads')

  const heroPayload = {
    imageUrl: firstHeroUpload,
    title: 'Staging Hero',
    subtitle: 'Isolated rehearsal',
    ctaText: 'Learn more',
    ctaUrl: 'https://example.org',
    order: 1,
    isActive: true,
  }
  const hero = (await request('/api/hero-slides', { method: 'POST', body: heroPayload, expected: [201] })).data.slide
  const heroId = idOf(hero)
  cleanup.push({ path: `/api/hero-slides/${heroId}`, label: 'hero slide' })
  await request(`/api/hero-slides/${heroId}`, {
    method: 'PUT',
    body: { ...heroPayload, imageUrl: secondHeroUpload, title: 'Updated Staging Hero' },
  })
  await request(firstHeroUpload, { expected: [404] })
  console.log('PASS hero create/update and replaced-file cleanup')

  const researchPayload = {
    title: 'Staging Research Area',
    slug: 'staging-research-area',
    description: 'Isolated staging research',
    overview: 'Isolated staging research',
    imageUrl: '',
    order: 1,
    displayOrder: 1,
    publications: [],
  }
  const researchArea = (await request('/api/research-areas', { method: 'POST', body: researchPayload, expected: [201] })).data.researchArea
  const researchAreaId = idOf(researchArea)
  cleanup.push({ path: `/api/research-areas/${researchAreaId}`, label: 'research area' })
  await request(`/api/research-areas/${researchAreaId}`, {
    method: 'PUT',
    body: { ...researchPayload, title: 'Updated Staging Research Area' },
  })

  const sponsorPayload = {
    name: 'Staging Sponsor',
    logoUrl: '/uploads/logos/1781176012722-0v9lgt.png',
    websiteUrl: 'https://example.org',
    order: 1,
  }
  const sponsor = (await request('/api/sponsors', { method: 'POST', body: sponsorPayload, expected: [201] })).data.sponsor
  const sponsorId = idOf(sponsor)
  cleanup.push({ path: `/api/sponsors/${sponsorId}`, label: 'sponsor' })
  await request(`/api/sponsors/${sponsorId}`, { method: 'PUT', body: { ...sponsorPayload, name: 'Updated Staging Sponsor' } })

  const galleryPayload = {
    imageUrl: '/uploads/logos/1781176012722-0v9lgt.png',
    caption: 'Staging gallery image',
    category: 'Staging',
    uploadDate: new Date().toISOString(),
  }
  const gallery = (await request('/api/gallery', { method: 'POST', body: galleryPayload, expected: [201] })).data.image
  const galleryId = idOf(gallery)
  cleanup.push({ path: `/api/gallery/${galleryId}`, label: 'gallery image' })
  await request(`/api/gallery/${galleryId}`, { method: 'PUT', body: { ...galleryPayload, caption: 'Updated staging gallery image' } })

  const newsPayload = {
    title: 'Staging News',
    content: '<p>Isolated staging news</p>',
    date: new Date().toISOString(),
    imageUrl: '',
    externalLink: 'https://example.org',
  }
  const news = (await request('/api/news', { method: 'POST', body: newsPayload, expected: [201] })).data.newsItem
  const newsId = idOf(news)
  cleanup.push({ path: `/api/news/${newsId}`, label: 'news item' })
  await request(`/api/news/${newsId}`, { method: 'PUT', body: { ...newsPayload, title: 'Updated Staging News' } })

  const projectPayload = {
    title: 'Staging Project',
    slug: 'staging-project',
    description: 'Isolated staging project',
    objective: '',
    objectivePoints: [],
    projectAmount: '',
    sponsoredAgency: '',
    detailedSummary: '',
    links: [],
    status: 'ongoing',
    startDate: new Date().toISOString(),
    endDate: '',
    imageUrl: '',
  }
  const project = (await request('/api/projects', { method: 'POST', body: projectPayload, expected: [201] })).data.project
  const projectId = idOf(project)
  cleanup.push({ path: `/api/projects/${projectId}`, label: 'project' })
  await request(`/api/projects/${projectId}`, { method: 'PUT', body: { ...projectPayload, title: 'Updated Staging Project' } })

  const memberPayload = {
    name: 'Staging Member',
    slug: 'staging-member',
    role: 'PhD Scholar',
    status: 'current',
    yearJoined: 2026,
    imageUrl: '',
    bio: 'Isolated staging member',
    email: 'staging-member@example.org',
    linkedinUrl: '',
    googleScholarUrl: '',
    githubUrl: '',
    personalPortfolioWebsite: '',
    resumePdf: '',
    displayOrder: 1,
    publications: [],
  }
  const member = (await request('/api/members', { method: 'POST', body: memberPayload, expected: [201] })).data.member
  const memberId = idOf(member)
  cleanup.push({ path: `/api/members/${memberId}`, label: 'member' })
  await request(`/api/members/${memberId}`, { method: 'PUT', body: { ...memberPayload, bio: 'Updated isolated staging member' } })

  const publicationPayload = {
    title: 'Staging Publication',
    slug: 'staging-publication',
    type: 'conference',
    authors: [memberId],
    externalAuthors: [],
    researchAreas: [researchAreaId],
    year: 2026,
    venue: 'Staging Conference',
    journalName: '',
    doiLink: '',
    description: 'Isolated staging publication',
    datasetLink: '',
    location: '',
    talkType: '',
    date: '',
    displayOrder: 1,
    abstract: '',
    pdfUrl: publicationUpload,
    externalUrl: '',
    tags: ['staging'],
  }
  const publication = (await request('/api/publications', { method: 'POST', body: publicationPayload, expected: [201] })).data.publication
  const publicationId = idOf(publication)
  cleanup.push({ path: `/api/publications/${publicationId}`, label: 'publication' })
  await request(`/api/publications/${publicationId}`, {
    method: 'PUT',
    body: {
      ...publicationPayload,
      pdfUrl: publication.pdfUrl || '',
      title: 'Updated Staging Publication',
    },
  })

  const memberAfterPublication = (await request(`/api/members/${memberId}`)).data.member
  const linkedPublicationIds = (memberAfterPublication.publications || []).map((item: any) => idOf(item))
  if (!linkedPublicationIds.includes(publicationId)) {
    throw new Error('Member/publication relationship was not synchronized')
  }
  const researchPage = await fetch(`${baseUrl}/research/areas/staging-research-area`)
  const researchHtml = await researchPage.text()
  if (!researchPage.ok || !researchHtml.includes('Updated Staging Publication')) {
    throw new Error('Research-area/publication relationship was not visible publicly')
  }
  console.log('PASS domain CRUD and relationship synchronization')

  const homepage = await fetch(`${baseUrl}/`)
  const homepageHtml = await homepage.text()
  if (!homepage.ok || !homepageHtml.includes('Isolated staging rehearsal content')) {
    throw new Error('Updated CMS content was not immediately visible on the homepage')
  }
  console.log('PASS immediate public CMS visibility')

  await removeCreatedEntries()
  const deletedHeroFile = await fetch(`${baseUrl}${secondHeroUpload}`)
  const deletedPublicationFile = await fetch(`${baseUrl}${publicationUpload}`)
  if (deletedHeroFile.status !== 404 || deletedPublicationFile.status !== 404) {
    throw new Error('Managed upload deletion did not remove promoted files')
  }
  console.log('PASS delete workflows and managed-file cleanup')
}

main().catch(async (error) => {
  console.error(error)
  await removeCreatedEntries()
  process.exitCode = 1
})
