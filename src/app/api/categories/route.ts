import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.tripCategory.findMany({
      include: {
        _count: {
          select: { trips: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, categories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
