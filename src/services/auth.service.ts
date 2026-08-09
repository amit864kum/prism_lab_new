import { findAdminByEmail, findSafeAdminById } from '@/repositories/admin.repository'
import { verifyPassword } from '@/lib/auth-node'
import { createToken, removeAuthCookie, setAuthCookie } from '@/lib/auth'
import { recordActivity } from '@/services/activity.service'

function toAdminResponse(admin: { _id: unknown; email: string; name: string }) {
  return { id: String(admin._id), email: admin.email, name: admin.name }
}

export async function establishAdminSession(email: string, password: string) {
  const admin = await findAdminByEmail(email)
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) return null

  const token = await createToken({ userId: admin._id.toString(), email: admin.email })
  await setAuthCookie(token)
  await recordActivity('LOGIN', 'Admin', admin.email)
  return toAdminResponse(admin)
}

export async function getAdminProfile(id: string) {
  const admin = await findSafeAdminById(id)
  return admin ? toAdminResponse(admin) : null
}

export async function endAdminSession(email: string) {
  await removeAuthCookie()
  await recordActivity('LOGOUT', 'Admin', email)
}
