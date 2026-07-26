import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, coupons })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, type, value, maxUses } = body

    if (!code || !value) {
      return NextResponse.json({ success: false, error: 'Code and value are required.' }, { status: 400 })
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type: type || 'PERCENTAGE',
        value: parseFloat(value),
        maxUses: parseInt(maxUses || 100, 10),
        isActive: true
      }
    })

    return NextResponse.json({ success: true, coupon: newCoupon })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required.' }, { status: 400 })
    }

    await prisma.coupon.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
