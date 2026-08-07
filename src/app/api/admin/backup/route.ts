import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'
import { logAuditEvent } from '@/lib/auditLogger'

export const dynamic = 'force-dynamic'

async function isAuthorizedAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const userRole = cookieStore.get('user_role')?.value
  return adminCookie === 'authenticated' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN'
}

export async function GET(req: Request) {
  try {
    if (!await isAuthorizedAdmin()) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access required.' }, { status: 401 })
    }

    const [
      trips,
      packages,
      categories,
      addons,
      settings,
      siteContent,
      gallery,
      reviews,
      users,
      bookings
    ] = await Promise.all([
      prisma.trip.findMany(),
      prisma.tripPackage.findMany(),
      prisma.tripCategory.findMany(),
      prisma.tripAddon.findMany(),
      prisma.settings.findMany(),
      prisma.siteContent.findMany(),
      prisma.galleryItem.findMany(),
      prisma.review.findMany(),
      prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, status: true, createdAt: true } }),
      prisma.booking.findMany({ select: { id: true, bookingNumber: true, leadEmail: true, totalPrice: true, currency: true, bookingStatus: true, createdAt: true } })
    ])

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      counts: {
        trips: trips.length,
        packages: packages.length,
        categories: categories.length,
        addons: addons.length,
        settings: settings.length,
        siteContent: siteContent.length,
        gallery: gallery.length,
        reviews: reviews.length,
        users: users.length,
        bookings: bookings.length
      },
      data: {
        trips,
        packages,
        categories,
        addons,
        settings,
        siteContent,
        gallery,
        reviews,
        users,
        bookings
      }
    }

    await logAuditEvent({
      action: 'DATABASE_BACKUP_EXPORTED',
      resource: 'SYSTEM',
      details: { counts: backupData.counts },
      req
    })

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mr_raw_travel_backup_${new Date().toISOString().slice(0, 10)}.json"`
      }
    })

  } catch (err: any) {
    console.error('Error generating backup:', err)
    return NextResponse.json({ success: false, error: 'Failed to generate system backup.' }, { status: 500 })
  }
}
