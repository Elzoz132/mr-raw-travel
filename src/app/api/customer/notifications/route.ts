import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userSession = cookieStore.get('user_session')?.value

    if (!userSession) {
      return NextResponse.json({ success: true, notifications: [], unreadCount: 0 })
    }

    const sessionData = JSON.parse(userSession)
    const userEmail = (sessionData.email || '').toLowerCase().trim()

    const notifications = await prisma.notification.findMany({
      where: {
        userEmail: { equals: userEmail, mode: 'insensitive' }
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    })

    const unreadCount = notifications.filter(n => !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })
  } catch (err: any) {
    console.error('Error fetching notifications:', err)
    return NextResponse.json({ success: false, notifications: [], unreadCount: 0 })
  }
}

export async function PATCH() {
  try {
    const cookieStore = await cookies()
    const userSession = cookieStore.get('user_session')?.value

    if (!userSession) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    const sessionData = JSON.parse(userSession)
    const userEmail = (sessionData.email || '').toLowerCase().trim()

    await prisma.notification.updateMany({
      where: {
        userEmail: { equals: userEmail, mode: 'insensitive' },
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error marking notifications read:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
