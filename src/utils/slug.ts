import type { Model } from 'mongoose'

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generateUniqueSlug(
  title: string,
  model: Model<unknown>,
  excludeId?: string
): Promise<string> {
  const baseSlug = createSlug(title)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const query: Record<string, unknown> = { slug }
    if (excludeId) query._id = { $ne: excludeId }

    if ((await model.countDocuments(query)) === 0) return slug

    counter += 1
    slug = `${baseSlug}-${counter}`
  }
}
