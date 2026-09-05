import AdminLayout from '@/components/admin/AdminLayout'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await getCurrentUser())) redirect('/admin/login')
  return <AdminLayout>{children}</AdminLayout>
}
