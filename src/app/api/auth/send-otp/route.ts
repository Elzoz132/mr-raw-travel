import { NextResponse } from 'next/server'
import { generateConfirmationToken, sendVerificationEmail } from '@/lib/emailOtp'

export async function POST(req: Request) {
  try {
    const { email, name, password, phone, country } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال بريد إلكتروني صحيح.' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const token = generateConfirmationToken({ email: cleanEmail, name, password, phone, country })

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://mr-raw-travel.vercel.app'
    const confirmUrl = `${origin}/api/auth/confirm-email?token=${token}`

    const result = await sendVerificationEmail({ email: cleanEmail, name: name || 'Traveler', confirmUrl })

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: result.message,
      confirmUrl: confirmUrl // Provided so user can also click directly if testing without SMTP
    })
  } catch (error: any) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json({ success: false, error: error.message || 'فشل إرسال رابط التفعيل' }, { status: 500 })
  }
}
