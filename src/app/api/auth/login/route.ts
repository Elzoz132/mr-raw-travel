import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma, withDbRetry } from '@/lib/db'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'
import { verifyPassword, logAuthActivity } from '@/lib/auth-helpers'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // 1. Executive Master Admin Fallback
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

      await logAuthActivity({
        userName: 'Mr.Raw Admin',
        userRole: 'ADMIN',
        action: 'MASTER_ADMIN_LOGIN',
        details: 'Executive Master Admin logged in via master credentials',
        req
      })

      return NextResponse.json({
        success: true,
        user: { name: 'Mr.Raw Executive Admin', email: 'admin@mrrawtravel.com', role: 'ADMIN' },
        redirect: '/admin/dashboard'
      })
    }

    // 2. Lookup user in DB
    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { email: cleanEmail }
      })
    )

    if (!user || !user.password) {
      await logAuthActivity({
        userName: cleanEmail,
        action: 'LOGIN_FAILED',
        details: `Failed login attempt for unknown email: ${cleanEmail}`,
        req
      })
      return NextResponse.json({ success: false, error: 'Invalid email address or password.' }, { status: 401 })
    }

    // 3. Verify Password (bcrypt or legacy plain text fallback)
    let isPasswordValid = false
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isPasswordValid = await verifyPassword(password, user.password)
    } else {
      isPasswordValid = user.password === password
    }

    if (!isPasswordValid) {
      await logAuthActivity({
        userId: user.id,
        userName: user.name || user.email,
        userRole: user.role,
        action: 'LOGIN_FAILED',
        details: `Failed password login attempt for user: ${cleanEmail}`,
        req
      })
      return NextResponse.json({ success: false, error: 'Invalid email address or password.' }, { status: 401 })
    }

    // 4. Verification Check for Customers
    if (!user.emailVerified && user.role === 'CUSTOMER') {
      await logAuthActivity({
        userId: user.id,
        userName: user.name || user.email,
        userRole: user.role,
        action: 'LOGIN_BLOCKED_UNVERIFIED',
        details: `Login blocked for unverified email: ${cleanEmail}`,
        req
      })

      return NextResponse.json({
        success: false,
        isUnverified: true,
        email: user.email,
        error: 'Your email address is not verified yet. Please check your inbox or click below to resend the verification email.'
      }, { status: 403 })
    }

    // 5. Successful Login Session setup
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

    // Update lastLoginAt
    await withDbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })
    )

    await logAuthActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: user.role,
      action: 'LOGIN_SUCCESS',
      details: `User ${cleanEmail} logged in successfully`,
      req
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirect: isAdmin ? '/admin/dashboard' : '/customer'
    })
  } catch (err: any) {
    console.error('Error during auth login:', err)
    return NextResponse.json({ success: false, error: err.message || 'Internal server error' }, { status: 500 })
  }
}
