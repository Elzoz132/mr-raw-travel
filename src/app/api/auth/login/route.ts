import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // Check if logging in as Master Admin
    if ((cleanEmail === 'admin@mrrawtravel.com' || cleanEmail === 'admin') && password === 'admin123') {
      const cookieStore = await cookies()
      cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })

      cookieStore.set('user_session', JSON.stringify({ name: 'Mr.Raw Admin', email: 'admin@mrrawtravel.com', role: 'ADMIN' }), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })

      cookieStore.set('user_role', 'ADMIN', {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })

      return NextResponse.json({
        success: true,
        user: { name: 'Mr.Raw Executive Admin', email: 'admin@mrrawtravel.com', role: 'ADMIN' },
        redirect: '/admin/dashboard'
      })
    }

    // Check database user
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 })
    }

    const cookieStore = await cookies()
    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'

    if (isAdmin) {
      cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
    }

    cookieStore.set('user_session', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    cookieStore.set('user_role', user.role || 'CUSTOMER', {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirect: isAdmin ? '/admin/dashboard' : '/customer'
    })
  } catch (err: any) {
    console.error('Error during auth login:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
