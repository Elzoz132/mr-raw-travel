import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, withDbRetry } from '@/lib/db'
import { evaluatePasswordStrength, hashPassword, generateCryptoToken, logAuthActivity } from '@/lib/auth-helpers'
import { sendEmail } from '@/lib/email/resend'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
  termsAccepted: z.boolean().refine((val) => val === true, 'You must accept Terms and Privacy Policy')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { firstName, lastName, fullName, email, phone, country, nationality, password } = parsed.data
    const cleanEmail = email.toLowerCase().trim()

    // 1. Password Strength Validation
    const strength = evaluatePasswordStrength(password)
    if (strength.score < 2) {
      return NextResponse.json({
        success: false,
        error: `Password is too weak. ${strength.suggestions.join('. ')}`
      }, { status: 400 })
    }

    // 2. Check if user already exists
    const existingUser = await withDbRetry(() => prisma.user.findUnique({ where: { email: cleanEmail } }))
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email address already exists. Please login instead.'
      }, { status: 400 })
    }

    // 3. Hash Password & Create Unverified User
    const hashedPassword = await hashPassword(password)
    const newUser = await withDbRetry(() =>
      prisma.user.create({
        data: {
          firstName,
          lastName,
          name: fullName,
          email: cleanEmail,
          password: hashedPassword,
          phone,
          country,
          nationality,
          status: 'UNVERIFIED',
          emailVerified: null,
          role: 'CUSTOMER'
        }
      })
    )

    // 4. Create Crypto Verification Token (24 Hours Expiry)
    const rawToken = generateCryptoToken()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'
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

    // 5. Send Verification Email via Resend Engine
    const origin = req.headers.get('origin') || process.env.AUTH_URL || 'https://mrrawtravel.com'
    const verifyUrl = `${origin}/auth/verify?token=${rawToken}`

    await sendEmail({
      to: cleanEmail,
      templateKey: 'VERIFY_EMAIL',
      props: {
        name: firstName || fullName,
        verifyUrl
      }
    })

    // 6. Log Activity
    await logAuthActivity({
      userId: newUser.id,
      userName: fullName,
      userRole: 'CUSTOMER',
      action: 'REGISTER_PENDING_VERIFICATION',
      details: `User registered with email ${cleanEmail}. Verification email dispatched.`,
      req
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! A verification email has been sent to your inbox. Please verify your email before logging in.'
    })
  } catch (error: any) {
    console.error('Error in /api/auth/register:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
