import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { AdminCouponsClient } from '@/components/admin/AdminCouponsClient'

export const revalidate = 0

export default async function AdminCouponsPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  let coupons: any[] = []
  try {
    coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (err) {
    console.error('Error fetching coupons:', err)
  }

  return <AdminCouponsClient initialCoupons={coupons} />
}
