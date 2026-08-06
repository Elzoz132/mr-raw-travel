import { NextResponse } from 'next/server'
import { prisma, withDbRetry } from '@/lib/db'
import { logAuthActivity } from '@/lib/auth-helpers'
import { sendEmail } from '@/lib/email/resend'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    // 1. Find Verification Token
    const dbToken = await withDbRetry(() =>
      prisma.verificationToken.findUnique({
        where: { token }
      })
    )

    if (!dbToken) {
      return NextResponse.json({ success: false, error: 'Invalid or missing verification token.' }, { status: 400 })
    }

    if (dbToken.usedAt) {
      return NextResponse.json({ success: false, error: 'This verification token has already been used.' }, { status: 400 })
    }

    if (new Date() > new Date(dbToken.expires)) {
      return NextResponse.json({ success: false, error: 'This verification link has expired. Please request a new link.' }, { status: 400 })
    }

    // 2. Find associated User
    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { email: dbToken.identifier }
      })
    )

    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 })
    }

    // 3. Mark User as Email Verified & Active
    const updatedUser = await withDbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          status: 'ACTIVE'
        }
      })
    )

    // 4. Mark Token as Used
    await withDbRetry(() =>
      prisma.verificationToken.update({
        where: { token },
        data: { usedAt: new Date() }
      })
    )

    // 5. Send Welcome Email via Resend
    await sendEmail({
      to: user.email,
      templateKey: 'WELCOME',
      props: {
        name: user.firstName || user.name || 'Valued Guest'
      }
    })

    // 6. Log Activity
    await logAuthActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: user.role,
      action: 'VERIFY_EMAIL_SUCCESS',
      details: `Email verified for ${user.email}`,
      req
    })

    // 7. Generate HTTP-Only Session Cookie
    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    })

    response.cookies.set('mr_raw_auth_token', JSON.stringify({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Error in /api/auth/verify:', error)
    return NextResponse.json({ success: false, error: error.message || 'Verification failed' }, { status: 500 })
  }
}
