import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid coupon code.' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() }
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive coupon code.' }, { status: 404 })
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: 'This promo coupon limit has been reached.' }, { status: 400 })
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ success: false, error: 'This coupon has expired.' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value
      }
    })
  } catch (err: any) {
    console.error('Error validating coupon:', err)
    return NextResponse.json({ success: false, error: 'Failed to validate promo code.' }, { status: 500 })
  }
}
