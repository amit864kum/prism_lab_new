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

export async function findAdminSessionIdentityById(id: string) {
  await connectDB()
  return Admin.findById(id).select('_id email sessionVersion').lean()
}

export async function incrementAdminSessionVersion(id: string) {
  await connectDB()
  return Admin.findByIdAndUpdate(
    id,
    { $inc: { sessionVersion: 1 } },
    { returnDocument: 'after', runValidators: true }
  ).select('_id sessionVersion').lean()
}
