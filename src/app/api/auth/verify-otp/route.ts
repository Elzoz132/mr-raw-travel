import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma, withDbRetry } from '@/lib/db'
import { verifyOtpCode } from '@/lib/emailOtp'

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json()

    if (!email || !otpCode) {
      return NextResponse.json({ success: false, error: 'البريد ورمز التحقيق مطلوبان.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const verification = verifyOtpCode(cleanEmail, otpCode)

    if (!verification.valid) {
      return NextResponse.json({ success: false, error: verification.error || 'رمز التحقيق غير صحيح.' }, { status: 400 })
    }

    // Find or create database user with retry handler
    let user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { email: cleanEmail }
      })
    )

    if (!user) {
      user = await withDbRetry(() =>
        prisma.user.create({
          data: {
            name: verification.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            password: verification.password || 'authenticated_otp_user',
            role: 'CUSTOMER',
            country: 'Egypt'
          }
        })
      )

      try {
        await withDbRetry(() =>
          prisma.customerProfile.create({
            data: {
              userId: user!.id,
              segment: 'STANDARD',
              tags: JSON.stringify(['Gmail Verified', 'OTP Auth'])
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

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirect: '/customer',
      message: 'تم تفعيل وتأكيد حسابك بنجاح! جاري التوجيه...'
    })
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ success: false, error: error.message || 'فشل التحقق من الرمز' }, { status: 500 })
  }
}
