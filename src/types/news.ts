export interface INewsItem {
  _id: string
  title: string
  content: string
  date: Date
  imageUrl?: string
  externalLink?: string
  createdAt: Date
  updatedAt: Date
}
