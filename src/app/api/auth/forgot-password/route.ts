import { NextResponse } from 'next/server'
import { prisma, withDbRetry } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateCryptoToken, logAuthActivity } from '@/lib/auth-helpers'
import { sendEmail } from '@/lib/email/resend'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'

    // Rate Limiting: max 3 attempts per 1 hour
    const rateCheck = checkRateLimit(`forgot-pass:${cleanEmail}:${ipAddress}`, { limit: 3, windowMs: 60 * 60 * 1000 })
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: 'Too many password reset attempts. Please wait 1 hour before trying again.'
      }, { status: 429 })
    }

    const user = await withDbRetry(() => prisma.user.findUnique({ where: { email: cleanEmail } }))

    // Standardized response to prevent email enumeration
    const genericResponse = NextResponse.json({
      success: true,
      message: 'If an account exists with this email address, a password reset link has been sent to your inbox.'
    })

    if (!user) {
      return genericResponse
    }

    // Invalidate existing reset tokens for this email
    await withDbRetry(() =>
      prisma.passwordResetToken.deleteMany({
        where: { email: cleanEmail }
      })
    )

    // Generate 1-hour Reset Token
    const rawToken = generateCryptoToken()
    const expires = new Date(Date.now() + 60 * 60 * 1000)
    const userAgent = req.headers.get('user-agent') || 'Unknown'

    await withDbRetry(() =>
      prisma.passwordResetToken.create({
        data: {
          email: cleanEmail,
          token: rawToken,
          expires,
          ipAddress,
          userAgent,
          device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
        }
      })
    )

    // Dispatch Email via Resend Engine
    const origin = req.headers.get('origin') || process.env.AUTH_URL || 'https://mrrawtravel.com'
    const resetUrl = `${origin}/auth/reset-password?token=${rawToken}`

    await sendEmail({
      to: cleanEmail,
      templateKey: 'RESET_PASSWORD',
      props: {
        name: user.firstName || user.name || 'Valued Guest',
        resetUrl
      }
    })

    await logAuthActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: user.role,
      action: 'FORGOT_PASSWORD_REQUEST',
      details: `Password reset token requested and dispatched to ${cleanEmail}`,
      req
    })

    return genericResponse
  } catch (error: any) {
    console.error('Error in /api/auth/forgot-password:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
