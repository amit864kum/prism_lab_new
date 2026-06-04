import { Model } from 'mongoose'

/**
 * Generates a URL-safe, unique slug for a document.
 * If a collision is found, it appends a numeric suffix.
 *
 * @param title Raw string to convert to slug
 * @param model Mongoose Model to check against for collisions
 * @param excludeId Optional ID to exclude from query (useful on updates)
 */
export async function generateUniqueSlug(
  title: string,
  model: Model<any>,
  excludeId?: string
): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  let slug = baseSlug
  let counter = 1
  let collision = true

  while (collision) {
    const query: any = { slug }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }

    const count = await model.countDocuments(query)
    if (count === 0) {
      collision = false
    } else {
      counter++
      slug = `${baseSlug}-${counter}`
    }
  }

  return slug
}
