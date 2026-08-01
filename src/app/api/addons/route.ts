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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
