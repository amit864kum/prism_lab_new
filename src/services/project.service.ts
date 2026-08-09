import type { ProjectInput } from '@/validators/project'
import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  projectSlugExists,
  updateProject,
} from '@/repositories/project.repository'
import {
  prepareUploadForPersistence,
  removeStoredFile,
  replaceStoredFile,
  rollbackPreparedUpload,
} from '@/services/storage.service'

export const getProjects = listProjects
export const getProject = getProjectById

export async function addProject(data: ProjectInput) {
  if (await projectSlugExists(data.slug)) return { conflict: true as const, project: null }
  const upload = await prepareUploadForPersistence(data.imageUrl, 'projects')
  try {
    return {
      conflict: false as const,
      project: await createProject({ ...data, imageUrl: upload.url }),
    }
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function editProject(id: string, data: ProjectInput) {
  if (await projectSlugExists(data.slug, id)) return { conflict: true as const, project: null }
  const current = await getProjectById(id)
  if (!current) return { conflict: false as const, project: null }
  const upload = await prepareUploadForPersistence(data.imageUrl, 'projects')
  try {
    const project = await updateProject(id, { ...data, imageUrl: upload.url })
    await replaceStoredFile(current.imageUrl, upload.url)
    return { conflict: false as const, project }
  } catch (error) {
    await rollbackPreparedUpload(upload)
    throw error
  }
}

export async function removeProject(id: string) {
  const current = await getProjectById(id)
  if (!current) return null
  const deleted = await deleteProject(id)
  if (deleted) await removeStoredFile(current.imageUrl)
  return deleted
}
