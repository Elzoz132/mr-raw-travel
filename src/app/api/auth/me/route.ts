import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get(ADMIN_COOKIE_NAME)
    const userSession = cookieStore.get('user_session')

    if (adminSession?.value === 'authenticated') {
      return NextResponse.json({
        authenticated: true,
        user: { name: 'Executive Admin', email: 'admin@mrrawtravel.com', role: 'ADMIN' }
      })
    }

    if (userSession?.value) {
      try {
        const u = JSON.parse(userSession.value)
        return NextResponse.json({
          authenticated: true,
          user: u
        })
      } catch (e) {
        // ignore parse error
      }
    }

    return NextResponse.json({ authenticated: false, user: null })
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, user: null })
  }
}
