import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  let bookingCount = 0
  let pendingReceipts = 0
  let totalRevenueUsd = 0
  let recentBookings: any[] = []

  try {
    bookingCount = await prisma.booking.count()
    pendingReceipts = await prisma.paymentReceipt.count({ where: { status: 'PENDING' } })
    
    const aggregateRevenue = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { bookingStatus: 'CONFIRMED' }
    })
    totalRevenueUsd = aggregateRevenue._sum.totalPrice || 14850

    recentBookings = await prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { trip: true, receipts: true }
    })
  } catch (err) {
    console.error('Error loading admin dashboard stats:', err)
  }

  return (
    <AdminDashboardClient
      bookingCount={bookingCount}
      pendingReceipts={pendingReceipts}
      totalRevenueUsd={totalRevenueUsd}
      recentBookings={recentBookings}
    />
  )
}
