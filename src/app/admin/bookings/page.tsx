import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { AdminBookingsClient } from '@/components/admin/AdminBookingsClient'

export const revalidate = 0

export default async function AdminBookingsPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  let bookings: any[] = []

  try {
    bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: { trip: true, receipts: true }
    })
  } catch (err) {
    console.error('Error fetching admin bookings:', err)
  }

  return <AdminBookingsClient bookings={bookings} />
}
