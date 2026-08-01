import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const addons = await prisma.tripAddon.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, addons })
  } catch (error: any) {
    console.error('Error fetching admin addons:', error)
    return NextResponse.json({ success: true, addons: [] })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      nameEn,
      nameAr,
      nameDe,
      descEn,
      descAr,
      category = 'GENERAL',
      priceEgp = 0,
      priceUsd = 0,
      priceEur = 0,
      icon = 'Sparkles',
      isCustomable = true,
      isAddon = true
    } = body

    if (!nameAr || !priceEgp) {
      return NextResponse.json({ error: 'Arabic name and price in EGP are required' }, { status: 400 })
    }

    const created = await prisma.tripAddon.create({
      data: {
        nameEn: nameEn || nameAr,
        nameAr,
        nameDe: nameDe || nameAr,
        descEn,
        descAr,
        category,
        priceEgp: Number(priceEgp),
        priceUsd: Number(priceUsd) || Math.round(Number(priceEgp) / 48),
        priceEur: Number(priceEur) || Math.round(Number(priceEgp) / 52),
        icon,
        isCustomable: Boolean(isCustomable),
        isAddon: Boolean(isAddon)
      }
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, addon: created })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create addon' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Addon ID is required' }, { status: 400 })
    }

    const updated = await prisma.tripAddon.update({
      where: { id },
      data: {
        ...(data.nameEn && { nameEn: data.nameEn }),
        ...(data.nameAr && { nameAr: data.nameAr }),
        ...(data.nameDe && { nameDe: data.nameDe }),
        ...(data.category && { category: data.category }),
        ...(data.priceEgp !== undefined && { priceEgp: Number(data.priceEgp) }),
        ...(data.priceUsd !== undefined && { priceUsd: Number(data.priceUsd) }),
        ...(data.priceEur !== undefined && { priceEur: Number(data.priceEur) }),
        ...(data.icon && { icon: data.icon }),
        ...(data.isCustomable !== undefined && { isCustomable: Boolean(data.isCustomable) }),
        ...(data.isAddon !== undefined && { isAddon: Boolean(data.isAddon) })
      }
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, addon: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update addon' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Addon ID is required' }, { status: 400 })
    }

    await prisma.tripAddon.delete({ where: { id } })
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete addon' }, { status: 500 })
  }
}
