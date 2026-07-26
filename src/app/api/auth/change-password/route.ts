import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json()
    const cookieStore = await cookies()
    const userSession = cookieStore.get('user_session')

    if (!userSession?.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const userData = JSON.parse(userSession.value)
    if (!userData.email) {
      return NextResponse.json({ success: false, error: 'Invalid user session.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 })
    }

    if (user.password && user.password !== currentPassword) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword }
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully!' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
