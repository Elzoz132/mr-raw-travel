import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('user_session')
    const adminSession = cookieStore.get(ADMIN_COOKIE_NAME)

    let email = 'admin@mrrawtravel.com'
    let session: any = null

    if (sessionCookie?.value) {
      try {
        session = JSON.parse(sessionCookie.value)
        email = session.email || email
      } catch {}
    } else if (adminSession?.value === 'authenticated') {
      email = 'admin@mrrawtravel.com'
    } else {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          session?.id ? { id: session.id } : undefined,
          email ? { email: email.toLowerCase() } : undefined
        ].filter(Boolean) as any
      }
    })

    if (!user && email) {
      user = await prisma.user.create({
        data: {
          name: session?.name || email.split('@')[0],
          email: email.toLowerCase(),
          password: 'authenticated_user',
          role: session?.role || 'CUSTOMER',
          country: 'Egypt'
        }
      })
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
    const adminSession = cookieStore.get(ADMIN_COOKIE_NAME)

    let session: any = null
    let email = 'admin@mrrawtravel.com'

    if (sessionCookie?.value) {
      try {
        session = JSON.parse(sessionCookie.value)
        email = session.email || email
      } catch {}
    } else if (adminSession?.value === 'authenticated') {
      email = 'admin@mrrawtravel.com'
    } else {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, whatsApp, country, nationality, avatar, currentPassword, newPassword } = body

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          session?.id ? { id: session.id } : undefined,
          email ? { email: email.toLowerCase() } : undefined
        ].filter(Boolean) as any
      }
    })

    if (!user && email) {
      user = await prisma.user.create({
        data: {
          name: name || session?.name || email.split('@')[0],
          email: email.toLowerCase(),
          password: newPassword || 'authenticated_user',
          role: session?.role || 'CUSTOMER',
          phone: phone || '',
          whatsApp: whatsApp || phone || '',
          country: country || 'Egypt',
          avatar: avatar || null
        }
      })
    } else if (user) {
      user = await prisma.user.update({
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
    }

    // Update Session Cookie
    cookieStore.set('user_session', JSON.stringify({
      id: user!.id,
      name: user!.name,
      email: user!.email,
      role: user!.role,
      avatar: user!.avatar
    }), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات حسابك بنجاح!',
      user
    })

  } catch (error: any) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ success: false, error: error.message || 'فشل تحديث البيانات' }, { status: 500 })
  }
}
