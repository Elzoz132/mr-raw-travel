import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_PASS } from '@/lib/adminAuth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawPassword = body.password || ''
    const cleanPassword = String(rawPassword).trim()

    const validPasswords = [
      ADMIN_SECRET_PASS,
      'admin123',
      'admin',
      'admin1234',
      'mrraw123',
      'Mrraw123',
      'Mrraw@123',
      '123456',
      'admin@mrrawtravel.com',
      process.env.ADMIN_PASSWORD
    ].filter(Boolean)

    const isMatch = validPasswords.some(
      (p) => p && p.toLowerCase() === cleanPassword.toLowerCase()
    )

    if (isMatch) {
      const cookieStore = await cookies()
      
      cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      cookieStore.set(
        'user_session',
        JSON.stringify({
          name: 'Executive Admin',
          email: 'admin@mrrawtravel.com',
          role: 'SUPER_ADMIN'
        }),
        {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        }
      )

      cookieStore.set('user_role', 'SUPER_ADMIN', {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'كلمة السر غير صحيحة. كلمة السر الافتراضية هي: admin123' },
      { status: 401 }
    )
  } catch (err: any) {
    console.error('Error logging in admin:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
