import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { AdminAddonsClient } from '@/components/admin/AdminAddonsClient'

export const revalidate = 0

export default async function AdminAddonsPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  return <AdminAddonsClient />
}
