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

    return NextResponse.json(
      { success: true, categories },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (error: any) {
    console.error('Error fetching categories API:', error)
    return NextResponse.json(
      { success: false, categories: [], error: error.message },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}
