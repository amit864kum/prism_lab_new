import Project from '@/models/Project'
import { connectDB } from '@/lib/mongodb'
import type { ProjectInput } from '@/validators/project'

export async function listProjects(
  sort: Record<string, 1 | -1> = { createdAt: -1 },
  limit?: number,
  skip?: number
) {
  await connectDB()
  let query = Project.find().sort(sort)
  if (skip !== undefined) query = query.skip(skip)
  if (limit !== undefined) query = query.limit(limit)
  return query.lean()
}

export async function getProjectById(id: string) {
  await connectDB()
  return Project.findById(id).lean()
}

export async function getProjectBySlug(slug: string) {
  await connectDB()
  return Project.findOne({ slug }).lean()
}

export async function projectSlugExists(slug: string, excludedId?: string) {
  await connectDB()
  const filter = excludedId ? { slug, _id: { $ne: excludedId } } : { slug }
  return Boolean(await Project.exists(filter))
}

export async function createProject(data: ProjectInput) {
  await connectDB()
  const created = await Project.create(data)
  return created.toObject()
}

export async function updateProject(id: string, data: ProjectInput) {
  await connectDB()
  return Project.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}

export async function deleteProject(id: string) {
  await connectDB()
  return Project.findByIdAndDelete(id).lean()
}

export async function countProjects(status?: 'ongoing' | 'completed') {
  await connectDB()
  return Project.countDocuments(status ? { status } : {})
}
