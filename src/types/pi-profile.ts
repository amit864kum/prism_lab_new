export interface IProfilePoint {
  text: string
  link?: string
}

export interface IPIPublication {
  authors: string
  title: string
  doiLink?: string
  journalName?: string
  conferenceName?: string
  bookTitle?: string
  publisher?: string
  patentNumber?: string
  year: number
  displayOrder?: number
}

export interface IPIProfile {
  _id: string
  name: string
  title: string
  bio: string
  imageUrl?: string
  email?: string
  emails?: string[]
  officeLocation?: string
  phoneNumber?: string
  phoneNumbers?: string[]
  researchInterests: string[]
  education: Array<{
    degree: string
    year: number
    thesis_title?: string
    specialization?: string
    supervisor?: string
    department?: string
    institute: string
    university?: string
    grade?: string
  }>
  teaching: Array<{ title: string; points: IProfilePoint[]; duration?: string }>
  activities: Array<{ title: string; points: IProfilePoint[]; year?: number }>
  achievements: Array<{ title: string; points: IProfilePoint[]; date?: string }>
  miscellaneous: Array<{ title: string; points: IProfilePoint[] }>
  journalPublications: IPIPublication[]
  conferencePublications: IPIPublication[]
  bookChapters: IPIPublication[]
  patents: IPIPublication[]
  createdAt: Date
  updatedAt: Date
}
