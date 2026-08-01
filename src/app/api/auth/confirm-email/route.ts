import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma, withDbRetry } from '@/lib/db'
import { verifyConfirmationToken } from '@/lib/emailOtp'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/?error=invalid_token', req.url))
    }

    const verification = verifyConfirmationToken(token)
    if (!verification.valid || !('data' in verification) || !verification.data) {
      return NextResponse.redirect(new URL('/?error=token_expired', req.url))
    }

    const { email, name, password, country } = verification.data

    // Find or create database user with retry handler
    let user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { email }
      })
    )

    if (!user) {
      user = await withDbRetry(() =>
        prisma.user.create({
          data: {
            name: name || email.split('@')[0],
            email,
            password: password || 'authenticated_confirmed_user',
            role: 'CUSTOMER',
            country: country || 'Egypt'
          }
        })
      )

      try {
        await withDbRetry(() =>
          prisma.customerProfile.create({
            data: {
              userId: user!.id,
              segment: 'STANDARD',
              tags: JSON.stringify(['Gmail Confirmed 👑', '1-Click Verified'])
            }
          })
        )
      } catch (e) {}
    }

    // Set user_session and user_role cookies
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

    // Redirect to customer dashboard with success banner
    return NextResponse.redirect(new URL('/customer?confirmed=true', req.url))
  } catch (error: any) {
    console.error('Error confirming email token:', error)
    return NextResponse.redirect(new URL('/?error=confirmation_failed', req.url))
  }
}
