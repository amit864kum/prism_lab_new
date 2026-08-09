import NewsItem from '@/models/NewsItem'
import { connectDB } from '@/lib/mongodb'
import type { NewsItemInput } from '@/validators/news'

export async function listNewsItems(limit?: number, skip?: number) {
  await connectDB()
  let query = NewsItem.find().sort({ date: -1 })
  if (skip !== undefined) query = query.skip(skip)
  if (limit !== undefined) query = query.limit(limit)
  return query.lean()
}

export async function getNewsItemById(id: string) {
  await connectDB()
  return NewsItem.findById(id).lean()
}

export async function createNewsItem(data: NewsItemInput) {
  await connectDB()
  const created = await NewsItem.create(data)
  return created.toObject()
}

export async function updateNewsItem(id: string, data: NewsItemInput) {
  await connectDB()
  return NewsItem.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  }).lean()
}

export async function deleteNewsItem(id: string) {
  await connectDB()
  return NewsItem.findByIdAndDelete(id).lean()
}

export async function countNewsItems() {
  await connectDB()
  return NewsItem.countDocuments()
}
