import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const section = searchParams.get('section')

    const where = section && section !== 'ALL' ? { section } : {}

    const items = await prisma.siteContent.findMany({
      where,
      orderBy: { key: 'asc' }
    })

    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch site content' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { key, section = 'GENERAL', textEn, textAr, textDe } = body

    if (!key) {
      return NextResponse.json({ error: 'Content key is required' }, { status: 400 })
    }

    const item = await prisma.siteContent.upsert({
      where: { key },
      update: { section, textEn, textAr, textDe },
      create: { key, section, textEn, textAr, textDe }
    })

    return NextResponse.json({ success: true, item })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save site content' }, { status: 500 })
  }
}
