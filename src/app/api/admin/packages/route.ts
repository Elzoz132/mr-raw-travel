import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get('tripId')

    const where = tripId ? { tripId } : {}
    const packages = await prisma.tripPackage.findMany({
      where,
      include: { trip: { select: { id: true, titleEn: true, slug: true } } },
      orderBy: [{ tripId: 'asc' }, { order: 'asc' }]
    })

    return NextResponse.json({ success: true, packages })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch packages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      tripId,
      nameEn,
      nameAr,
      nameDe,
      descEn,
      descAr,
      descDe,
      priceAdultUsd = 0,
      priceChildUsd = 0,
      priceAdultEur = 0,
      priceChildEur = 0,
      priceAdultEgp = 0,
      priceChildEgp = 0,
      priceAdultGbp = 0,
      priceChildGbp = 0,
      oldPriceAdultUsd,
      oldPriceAdultEur,
      oldPriceAdultEgp,
      oldPriceAdultGbp,
      discountPercent = 0,
      currency = 'USD',
      includedEn,
      includedAr,
      includedDe,
      excludedEn,
      excludedAr,
      excludedDe,
      duration,
      availableDays,
      capacity = 20,
      photos,
      video,
      badge,
      isPopular = false,
      isRecommended = false,
      isBestSeller = false,
      order = 0,
      status = 'ACTIVE'
    } = body

    if (!tripId || !nameEn) {
      return NextResponse.json({ error: 'tripId and package nameEn are required' }, { status: 400 })
    }

    const created = await prisma.tripPackage.create({
      data: {
        tripId,
        nameEn,
        nameAr: nameAr || nameEn,
        nameDe: nameDe || nameEn,
        descEn,
        descAr,
        descDe,
        priceAdultUsd: Number(priceAdultUsd),
        priceChildUsd: Number(priceChildUsd),
        priceAdultEur: Number(priceAdultEur),
        priceChildEur: Number(priceChildEur),
        priceAdultEgp: Number(priceAdultEgp),
        priceChildEgp: Number(priceChildEgp),
        priceAdultGbp: Number(priceAdultGbp),
        priceChildGbp: Number(priceChildGbp),
        oldPriceAdultUsd: oldPriceAdultUsd ? Number(oldPriceAdultUsd) : null,
        oldPriceAdultEur: oldPriceAdultEur ? Number(oldPriceAdultEur) : null,
        oldPriceAdultEgp: oldPriceAdultEgp ? Number(oldPriceAdultEgp) : null,
        oldPriceAdultGbp: oldPriceAdultGbp ? Number(oldPriceAdultGbp) : null,
        discountPercent: Number(discountPercent),
        currency,
        includedEn: typeof includedEn === 'object' ? JSON.stringify(includedEn) : includedEn,
        includedAr: typeof includedAr === 'object' ? JSON.stringify(includedAr) : includedAr,
        includedDe: typeof includedDe === 'object' ? JSON.stringify(includedDe) : includedDe,
        excludedEn: typeof excludedEn === 'object' ? JSON.stringify(excludedEn) : excludedEn,
        excludedAr: typeof excludedAr === 'object' ? JSON.stringify(excludedAr) : excludedAr,
        excludedDe: typeof excludedDe === 'object' ? JSON.stringify(excludedDe) : excludedDe,
        duration,
        availableDays: typeof availableDays === 'object' ? JSON.stringify(availableDays) : availableDays,
        capacity: Number(capacity),
        photos: typeof photos === 'object' ? JSON.stringify(photos) : photos,
        video,
        badge,
        isPopular: Boolean(isPopular),
        isRecommended: Boolean(isRecommended),
        isBestSeller: Boolean(isBestSeller),
        order: Number(order),
        status
      }
    })

    return NextResponse.json({ success: true, package: created })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create package' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, action, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
    }

    if (action === 'duplicate') {
      const existing = await prisma.tripPackage.findUnique({ where: { id } })
      if (!existing) return NextResponse.json({ error: 'Package not found' }, { status: 404 })

      const duplicated = await prisma.tripPackage.create({
        data: {
          ...existing,
          id: undefined,
          nameEn: `${existing.nameEn} (Copy)`,
          nameAr: `${existing.nameAr} (نسخة)`,
          nameDe: `${existing.nameDe} (Kopie)`,
          createdAt: undefined,
          updatedAt: undefined
        }
      })
      return NextResponse.json({ success: true, package: duplicated })
    }

    const updated = await prisma.tripPackage.update({
      where: { id },
      data: {
        ...(data.nameEn && { nameEn: data.nameEn }),
        ...(data.nameAr && { nameAr: data.nameAr }),
        ...(data.nameDe && { nameDe: data.nameDe }),
        ...(data.descEn !== undefined && { descEn: data.descEn }),
        ...(data.descAr !== undefined && { descAr: data.descAr }),
        ...(data.descDe !== undefined && { descDe: data.descDe }),
        ...(data.priceAdultUsd !== undefined && { priceAdultUsd: Number(data.priceAdultUsd) }),
        ...(data.priceChildUsd !== undefined && { priceChildUsd: Number(data.priceChildUsd) }),
        ...(data.priceAdultEur !== undefined && { priceAdultEur: Number(data.priceAdultEur) }),
        ...(data.priceChildEur !== undefined && { priceChildEur: Number(data.priceChildEur) }),
        ...(data.priceAdultEgp !== undefined && { priceAdultEgp: Number(data.priceAdultEgp) }),
        ...(data.priceChildEgp !== undefined && { priceChildEgp: Number(data.priceChildEgp) }),
        ...(data.priceAdultGbp !== undefined && { priceAdultGbp: Number(data.priceAdultGbp) }),
        ...(data.priceChildGbp !== undefined && { priceChildGbp: Number(data.priceChildGbp) }),
        ...(data.discountPercent !== undefined && { discountPercent: Number(data.discountPercent) }),
        ...(data.includedEn !== undefined && { includedEn: typeof data.includedEn === 'object' ? JSON.stringify(data.includedEn) : data.includedEn }),
        ...(data.includedAr !== undefined && { includedAr: typeof data.includedAr === 'object' ? JSON.stringify(data.includedAr) : data.includedAr }),
        ...(data.includedDe !== undefined && { includedDe: typeof data.includedDe === 'object' ? JSON.stringify(data.includedDe) : data.includedDe }),
        ...(data.excludedEn !== undefined && { excludedEn: typeof data.excludedEn === 'object' ? JSON.stringify(data.excludedEn) : data.excludedEn }),
        ...(data.excludedAr !== undefined && { excludedAr: typeof data.excludedAr === 'object' ? JSON.stringify(data.excludedAr) : data.excludedAr }),
        ...(data.excludedDe !== undefined && { excludedDe: typeof data.excludedDe === 'object' ? JSON.stringify(data.excludedDe) : data.excludedDe }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.capacity !== undefined && { capacity: Number(data.capacity) }),
        ...(data.photos !== undefined && { photos: typeof data.photos === 'object' ? JSON.stringify(data.photos) : data.photos }),
        ...(data.video !== undefined && { video: data.video }),
        ...(data.badge !== undefined && { badge: data.badge }),
        ...(data.isPopular !== undefined && { isPopular: Boolean(data.isPopular) }),
        ...(data.isRecommended !== undefined && { isRecommended: Boolean(data.isRecommended) }),
        ...(data.isBestSeller !== undefined && { isBestSeller: Boolean(data.isBestSeller) }),
        ...(data.order !== undefined && { order: Number(data.order) }),
        ...(data.status !== undefined && { status: data.status })
      }
    })

    return NextResponse.json({ success: true, package: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
    }

    await prisma.tripPackage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete package' }, { status: 500 })
  }
}
