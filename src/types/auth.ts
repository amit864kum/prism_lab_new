export interface IAdmin {
  _id: string
  email: string
  passwordHash: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface JWTPayload {
  userId: string
  email: string
  [key: string]: unknown
}
