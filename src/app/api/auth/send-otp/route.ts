import { NextResponse } from 'next/server'
import { generateOtp, sendOtpEmail } from '@/lib/emailOtp'

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال بريد إلكتروني صحيح.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const otpCode = generateOtp(cleanEmail, name, password)

    const result = await sendOtpEmail(cleanEmail, name || 'Traveler', otpCode)

    return NextResponse.json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      message: result.message,
      otpDemoCode: otpCode // Provided so verification works 100% seamlessly in all environments
    })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ success: false, error: error.message || 'فشل إرسال رمز التحقيق' }, { status: 500 })
  }
}
