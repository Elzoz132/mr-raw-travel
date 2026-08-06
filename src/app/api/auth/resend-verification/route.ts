import { NextResponse } from 'next/server'
import { prisma, withDbRetry } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateCryptoToken, logAuthActivity } from '@/lib/auth-helpers'
import { sendEmail } from '@/lib/email/resend'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'

    // Rate limit check: max 3 resends per 1 hour window
    const rateCheck = checkRateLimit(`resend-verify:${cleanEmail}:${ipAddress}`, { limit: 3, windowMs: 60 * 60 * 1000 })
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: 'Too many verification email requests. Please wait 1 hour before requesting another email.'
      }, { status: 429 })
    }

    const user = await withDbRetry(() => prisma.user.findUnique({ where: { email: cleanEmail } }))

    if (!user) {
      // Security practice: Return general success to avoid email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email address, a new verification link has been sent.'
      })
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: false,
        error: 'This email address is already verified. Please proceed to login.'
      }, { status: 400 })
    }

    // Invalidate old tokens
    await withDbRetry(() =>
      prisma.verificationToken.deleteMany({
        where: { identifier: cleanEmail }
      })
    )

    // Generate new Crypto Token (24 Hours Expiry)
    const rawToken = generateCryptoToken()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const userAgent = req.headers.get('user-agent') || 'Unknown'

    await withDbRetry(() =>
      prisma.verificationToken.create({
        data: {
          identifier: cleanEmail,
          token: rawToken,
          expires,
          ipAddress,
          userAgent,
          device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
        }
      })
    )

    // Dispatch Email via Resend
    const origin = req.headers.get('origin') || process.env.AUTH_URL || 'https://mrrawtravel.com'
    const verifyUrl = `${origin}/auth/verify?token=${rawToken}`

    await sendEmail({
      to: cleanEmail,
      templateKey: 'VERIFY_EMAIL',
      props: {
        name: user.firstName || user.name || 'Guest User',
        verifyUrl
      }
    })

    await logAuthActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: user.role,
      action: 'RESEND_VERIFICATION_DISPATCH',
      details: `New verification token generated and dispatched for ${cleanEmail}`,
      req
    })

    return NextResponse.json({
      success: true,
      message: 'A new verification link has been sent to your email address.'
    })
  } catch (error: any) {
    console.error('Error in /api/auth/resend-verification:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
