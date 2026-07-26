import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { AdminTripsClient } from '@/components/admin/AdminTripsClient'

export const revalidate = 0

export default async function AdminTripsPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  let trips: any[] = []
  try {
    trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (err) {
    console.error('Error fetching admin trips:', err)
  }

  return <AdminTripsClient initialTrips={trips} />
}
