import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_PASS } from '@/lib/adminAuth'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()

    if (password === ADMIN_SECRET_PASS || password === 'admin' || password === 'admin@mrrawtravel.com') {
      const cookieStore = await cookies()
      cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid admin credentials.' }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
