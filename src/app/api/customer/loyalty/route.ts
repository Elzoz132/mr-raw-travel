import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userSession = cookieStore.get('user_session')?.value

    if (!userSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized user.' }, { status: 401 })
    }

    const sessionData = JSON.parse(userSession)
    const userEmail = (sessionData.email || '').toLowerCase().trim()

    const user = await prisma.user.findFirst({
      where: { email: { equals: userEmail, mode: 'insensitive' } },
      include: {
        loyaltyPoints: true,
        loyaltyTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        success: true,
        pointsBalance: 0,
        lifetimePoints: 0,
        transactions: []
      })
    }

    return NextResponse.json({
      success: true,
      pointsBalance: user.loyaltyPoints?.pointsBalance || 0,
      lifetimePoints: user.loyaltyPoints?.lifetimePoints || 0,
      transactions: user.loyaltyTransactions || []
    })
  } catch (err: any) {
    console.error('Error fetching loyalty status:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch loyalty details.' }, { status: 500 })
  }
}
