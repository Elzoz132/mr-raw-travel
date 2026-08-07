import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'
import { awardLoyaltyPointsForBooking } from '@/lib/loyalty'
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

    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 })
    }

    // 1. Update Booking and Payment Receipt status
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: {
          paymentStatus: 'PAID',
          bookingStatus: 'CONFIRMED',
          rejectionReason: null
        }
      })

      await tx.paymentReceipt.updateMany({
        where: { bookingId: id },
        data: { status: 'APPROVED' }
      })
    })

    // 2. Award Loyalty Points
    const pointsAwarded = await awardLoyaltyPointsForBooking(id)

    // 3. Send Notification & Email to customer
    await createInAppNotification({
      userId: booking.userId,
      userEmail: booking.leadEmail,
      title: '✅ تم تأكيد الدفع وقبول حجزك بنجاح!',
      message: `تم اعتماد إيصال الدفع لحجزك رقم #${booking.bookingNumber} بنجاح! حجزك الآن مؤكد رسمياً، وتم إضافة ${pointsAwarded} نقطة ولاء إلى رصيدك. نتمنى لك رحلة ممتعة معنا!`,
      type: 'PAYMENT_APPROVED',
      link: '/customer/bookings'
    })

    // 4. Log Audit Event
    await logAuditEvent({
      action: 'PAYMENT_APPROVED',
      resource: 'BOOKINGS',
      details: { bookingNumber: booking.bookingNumber, pointsAwarded },
      req
    })

    return NextResponse.json({
      success: true,
      message: 'تم قبول وتأكيد الدفع وإضافة نقاط الولاء للعميل بنجاح!',
      pointsAwarded
    })

  } catch (err: any) {
    console.error('Error approving payment:', err)
    return NextResponse.json({ success: false, error: 'Failed to approve payment.' }, { status: 500 })
  }
}
