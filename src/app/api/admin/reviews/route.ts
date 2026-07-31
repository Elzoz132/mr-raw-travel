import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where = status && status !== 'ALL' ? { status } : {}

    const reviews = await prisma.review.findMany({
      where,
      include: {
        trip: { select: { id: true, titleEn: true, titleAr: true, slug: true } },
        package: { select: { id: true, nameEn: true, nameAr: true } },
        booking: { select: { id: true, bookingNumber: true, tripDate: true } }
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
    })

    return NextResponse.json({ success: true, reviews })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, status, isPinned, isFeatured, adminReply } = body

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(isPinned !== undefined && { isPinned: Boolean(isPinned) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(adminReply !== undefined && { adminReply })
      }
    })

    // If review is approved, recalculate average rating on trip
    if (status === 'APPROVED') {
      const allApproved = await prisma.review.findMany({
        where: { tripId: updated.tripId, status: 'APPROVED' }
      })
      if (allApproved.length > 0) {
        const avg = allApproved.reduce((acc, r) => acc + r.rating, 0) / allApproved.length
        await prisma.trip.update({
          where: { id: updated.tripId },
          data: {
            rating: Number(avg.toFixed(2)),
            reviewCount: allApproved.length
          }
        })
      }
    }

    return NextResponse.json({ success: true, review: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 500 })
  }
}
