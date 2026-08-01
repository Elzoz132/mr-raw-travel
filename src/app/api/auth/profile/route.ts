import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('user_session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const user = await prisma.user.findUnique({
      where: { id: session.id || session.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsApp: true,
        country: true,
        nationality: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('user_session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const body = await req.json()
    const { name, phone, whatsApp, country, nationality, avatar, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({
      where: { id: session.id }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Handle Password Change if requested
    if (newPassword) {
      if (user.password && user.password !== 'oauth_google_secured' && currentPassword !== user.password) {
        return NextResponse.json({ success: false, error: 'كلمة السر الحالية غير صحيحة.' }, { status: 400 })
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(whatsApp !== undefined && { whatsApp }),
        ...(country !== undefined && { country }),
        ...(nationality !== undefined && { nationality }),
        ...(avatar !== undefined && { avatar }),
        ...(newPassword && { password: newPassword })
      }
    })

    // Update Session Cookie
    cookieStore.set('user_session', JSON.stringify({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar
    }), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات حسابك بنجاح!',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        whatsApp: updated.whatsApp,
        country: updated.country,
        nationality: updated.nationality,
        avatar: updated.avatar,
        role: updated.role
      }
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'فشل تحديث البيانات' }, { status: 500 })
  }
}
