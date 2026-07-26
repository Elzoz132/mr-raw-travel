import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { AdminCrmClient } from '@/components/admin/AdminCrmClient'

export const revalidate = 0

export default async function AdminCrmPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  let customers: any[] = []

  try {
    customers = await prisma.customerProfile.findMany({
      orderBy: { totalSpendUsd: 'desc' },
      include: { user: true }
    })
  } catch (err) {
    console.error('Error fetching CRM profiles:', err)
  }

  return <AdminCrmClient customers={customers} />
}
