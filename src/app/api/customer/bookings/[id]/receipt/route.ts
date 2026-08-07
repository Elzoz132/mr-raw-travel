import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { createInAppNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const userSession = cookieStore.get('user_session')?.value

    if (!userSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const receiptUrl = body.receiptUrl

    if (!receiptUrl) {
      return NextResponse.json({ success: false, error: 'يرجى اختيار وتزويد صورة إيصال التحويل.' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: 'الحجز غير موجود.' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      // Create PaymentReceipt record
      await tx.paymentReceipt.create({
        data: {
          bookingId: id,
          imageUrl: receiptUrl,
          status: 'PENDING'
        }
      })

      // Update booking payment status back to WAITING_REVIEW
      await tx.booking.update({
        where: { id },
        data: {
          paymentStatus: 'WAITING_REVIEW',
          rejectionReason: null
        }
      })
    })

    await createInAppNotification({
      userId: booking.userId,
      userEmail: booking.leadEmail,
      title: '📤 تم استلام إيصال التحويل المعدل',
      message: `تم رفع إيصال الدفع الجديد لحجزك رقم #${booking.bookingNumber} بنجاح، وهو الآن قيد المراجعة الفورية من فريق الإدارة.`,
      type: 'INFO',
      link: '/customer/bookings'
    })

    return NextResponse.json({
      success: true,
      message: 'تم إعادة رفع إيصال الدفع بنجاح وهو الآن قيد مراجعة الإدارة.'
    })

  } catch (err: any) {
    console.error('Error re-uploading receipt:', err)
    return NextResponse.json({ success: false, error: 'فشل في رفع إيصال الدفع الجديد.' }, { status: 500 })
  }
}
