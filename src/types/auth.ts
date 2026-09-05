export interface IAdmin {
  _id: string
  email: string
  passwordHash: string
  name: string
  sessionVersion: number
  createdAt: Date
  updatedAt: Date
}

export interface JWTPayload {
  userId: string
  email: string
  sessionVersion: number
  [key: string]: unknown
}
