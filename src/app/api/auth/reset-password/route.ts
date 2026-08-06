import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, withDbRetry } from '@/lib/db'
import { evaluatePasswordStrength, hashPassword, logAuthActivity } from '@/lib/auth-helpers'
import { sendEmail } from '@/lib/email/resend'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { token, password } = parsed.data

    // 1. Find Reset Token
    const dbToken = await withDbRetry(() =>
      prisma.passwordResetToken.findUnique({
        where: { token }
      })
    )

    if (!dbToken) {
      return NextResponse.json({ success: false, error: 'Invalid or expired password reset token.' }, { status: 400 })
    }

    if (dbToken.usedAt) {
      return NextResponse.json({ success: false, error: 'This password reset link has already been used.' }, { status: 400 })
    }

    if (new Date() > new Date(dbToken.expires)) {
      return NextResponse.json({ success: false, error: 'This password reset link has expired. Please request a new link.' }, { status: 400 })
    }

    // 2. Validate Password Strength
    const strength = evaluatePasswordStrength(password)
    if (strength.score < 2) {
      return NextResponse.json({
        success: false,
        error: `Password is too weak. ${strength.suggestions.join('. ')}`
      }, { status: 400 })
    }

    // 3. Find User
    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { email: dbToken.email }
      })
    )

    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 })
    }

    // 4. Update Password Hash with bcryptjs
    const hashedPassword = await hashPassword(password)
    await withDbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
    )

    // 5. Mark Token Used
    await withDbRetry(() =>
      prisma.passwordResetToken.update({
        where: { token },
        data: { usedAt: new Date() }
      })
    )

    // 6. Send Security Alert Email via Resend
    await sendEmail({
      to: user.email,
      templateKey: 'PASSWORD_CHANGED',
      props: {
        name: user.firstName || user.name || 'Valued Guest'
      }
    })

    // 7. Log Activity
    await logAuthActivity({
      userId: user.id,
      userName: user.name || user.email,
      userRole: user.role,
      action: 'PASSWORD_RESET_SUCCESS',
      details: `Password reset successfully completed for ${user.email}`,
      req
    })

    return NextResponse.json({
      success: true,
      message: 'Your password has been changed successfully! You can now log in with your new password.'
    })
  } catch (error: any) {
    console.error('Error in /api/auth/reset-password:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
