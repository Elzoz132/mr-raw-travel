import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const addons = await prisma.tripAddon.findMany({
      orderBy: { priceEgp: 'asc' }
    })
    return NextResponse.json({ success: true, addons })
  } catch (error: any) {
    console.error('Error fetching public addons:', error)
    return NextResponse.json({ success: true, addons: [] })
  }
}
