import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'
import { deductLoyaltyPointsForCancellation } from '@/lib/loyalty'
import { createInAppNotification } from '@/lib/notifications'
import { logAuditEvent } from '@/lib/auditLogger'

export const dynamic = 'force-dynamic'

async function isAuthorizedAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const userRole = cookieStore.get('user_role')?.value
  return adminCookie === 'authenticated' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN'
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await isAuthorizedAdmin()) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access required.' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const reason = body.reason || 'تم إلغاء الحجز بناءً على طلب العميل أو بسبب الظروف الجوية.'

    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 })
    }

    // 1. Deduct any loyalty points previously awarded for this booking
    await deductLoyaltyPointsForCancellation(id)

    // 2. Update booking status
    await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: 'CANCELLED',
        cancellationReason: reason
      }
    })

    // 3. Send Notification & Email
    await createInAppNotification({
      userId: booking.userId,
      userEmail: booking.leadEmail,
      title: '🚫 تم إلغاء الحجز',
      message: `تم إلغاء حجزك رقم #${booking.bookingNumber}. السبب: (${reason}). إذا كان لديك أي استفسار يسعدنا تواصلك معنا عبر الواتساب.`,
      type: 'BOOKING_CANCELLED',
      link: '/customer/bookings'
    })

    await logAuditEvent({
      action: 'BOOKING_CANCELLED',
      resource: 'BOOKINGS',
      details: { bookingNumber: booking.bookingNumber, reason },
      req
    })

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء الحجز وخصم النقاط بنجاح.'
    })

  } catch (err: any) {
    console.error('Error cancelling booking:', err)
    return NextResponse.json({ success: false, error: 'Failed to cancel booking.' }, { status: 500 })
  }
}
