import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const where = category && category !== 'ALL' ? { category } : {}

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }]
    })

    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch gallery items' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { titleEn, titleAr, titleDe, category = 'SEA', url, location = 'Hurghada', mediaType = 'IMAGE', order = 0, isFeatured = false, altTextEn, altTextAr, altTextDe } = body

    if (!url || !titleEn) {
      return NextResponse.json({ error: 'url and titleEn are required' }, { status: 400 })
    }

    const created = await prisma.galleryItem.create({
      data: {
        titleEn,
        titleAr: titleAr || titleEn,
        titleDe: titleDe || titleEn,
        category,
        url,
        location,
        mediaType,
        order: Number(order),
        isFeatured: Boolean(isFeatured),
        altTextEn,
        altTextAr,
        altTextDe
      }
    })

    return NextResponse.json({ success: true, item: created })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create gallery item' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 })
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(data.titleEn && { titleEn: data.titleEn }),
        ...(data.titleAr && { titleAr: data.titleAr }),
        ...(data.titleDe && { titleDe: data.titleDe }),
        ...(data.category && { category: data.category }),
        ...(data.url && { url: data.url }),
        ...(data.location && { location: data.location }),
        ...(data.mediaType && { mediaType: data.mediaType }),
        ...(data.order !== undefined && { order: Number(data.order) }),
        ...(data.isFeatured !== undefined && { isFeatured: Boolean(data.isFeatured) }),
        ...(data.altTextEn !== undefined && { altTextEn: data.altTextEn }),
        ...(data.altTextAr !== undefined && { altTextAr: data.altTextAr }),
        ...(data.altTextDe !== undefined && { altTextDe: data.altTextDe })
      }
    })

    return NextResponse.json({ success: true, item: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update gallery item' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 })
    }

    await prisma.galleryItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete gallery item' }, { status: 500 })
  }
}
