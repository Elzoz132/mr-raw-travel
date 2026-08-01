import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone, isGoogleAuth } = body

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // Check existing
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (user && !isGoogleAuth) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists. Please log in.' }, { status: 400 })
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || (isGoogleAuth ? cleanEmail.split('@')[0] : 'Traveler'),
          email: cleanEmail,
          password: password || 'oauth_google_secured',
          phone: phone || null,
          role: 'CUSTOMER'
        }
      })

      // Create CRM Customer profile
      await prisma.customerProfile.create({
        data: {
          userId: user.id,
          segment: 'STANDARD',
          tags: JSON.stringify(['New Customer', isGoogleAuth ? 'Google Auth' : 'Direct Signup'])
        }
      })
    }

    const cookieStore = await cookies()
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
      redirect: '/customer'
    })
  } catch (err: any) {
    console.error('Error during auth signup:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
