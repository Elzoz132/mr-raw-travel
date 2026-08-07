import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'
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
    const reason = body.reason || 'إيصال الدفع المرفق غير واضح أو المبلغ غير مكتمل.'

    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: {
          paymentStatus: 'REJECTED',
          bookingStatus: 'PENDING',
          rejectionReason: reason
        }
      })

      await tx.paymentReceipt.updateMany({
        where: { bookingId: id },
        data: { status: 'REJECTED', adminNotes: reason }
      })
    })

    // Send Notification & Email to customer with rejection reason
    await createInAppNotification({
      userId: booking.userId,
      userEmail: booking.leadEmail,
      title: '⚠️ إشعار عدم قبول إيصال الدفع',
      message: `عفواً، لم يتم قبول إيصال الدفع لحجزك رقم #${booking.bookingNumber}. السبب: (${reason}). يمكنك رفع إيصال جديد معدل من صفحة حجوزاتي دون الحاجة لإعادة الحجز.`,
      type: 'PAYMENT_REJECTED',
      link: '/customer/bookings'
    })

    await logAuditEvent({
      action: 'PAYMENT_REJECTED',
      resource: 'BOOKINGS',
      details: { bookingNumber: booking.bookingNumber, reason },
      req
    })

    return NextResponse.json({
      success: true,
      message: 'تم رفض الإيصال وإشعار العميل بسبب الرفض بنجاح.'
    })

  } catch (err: any) {
    console.error('Error rejecting payment:', err)
    return NextResponse.json({ success: false, error: 'Failed to reject payment.' }, { status: 500 })
  }
}
