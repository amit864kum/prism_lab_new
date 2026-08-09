import Admin from '@/models/Admin'
import { connectDB } from '@/lib/mongodb'

export async function findAdminByEmail(email: string) {
  await connectDB()
  return Admin.findOne({ email }).lean()
}

export async function findSafeAdminById(id: string) {
  await connectDB()
  return Admin.findById(id).select('-passwordHash').lean()
}
