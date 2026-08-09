export interface IHeroSlide {
  _id: string
  imageUrl: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
