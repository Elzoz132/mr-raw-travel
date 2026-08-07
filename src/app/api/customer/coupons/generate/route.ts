import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { redeemPointsForCoupon } from '@/lib/loyalty'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const userSession = cookieStore.get('user_session')?.value

    if (!userSession) {
      return NextResponse.json({ success: false, error: 'يجب تسجيل الدخول لاستبدال النقاط.' }, { status: 401 })
    }

    const sessionData = JSON.parse(userSession)
    const userEmail = (sessionData.email || '').toLowerCase().trim()

    const body = await req.json()
    const pointsToRedeem = Number(body.pointsToRedeem) || 1000

    const user = await prisma.user.findFirst({
      where: { email: { equals: userEmail, mode: 'insensitive' } }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود.' }, { status: 404 })
    }

    const result = await redeemPointsForCoupon(user.id, pointsToRedeem)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      couponCode: result.couponCode,
      discountPercent: result.discountPercent,
      message: `تم إنشاء كوبون خصم ${result.discountPercent}% بنجاح! الكود: ${result.couponCode}`
    })

  } catch (err: any) {
    console.error('Error generating loyalty coupon:', err)
    return NextResponse.json({ success: false, error: 'حدث خطأ في السيرفر أثناء إنشاء الكوبون.' }, { status: 500 })
  }
}
