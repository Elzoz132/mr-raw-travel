import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const cookieStore = await cookies()
    try { cookieStore.delete(ADMIN_COOKIE_NAME) } catch {}
    try { cookieStore.delete('user_session') } catch {}
    try { cookieStore.delete('user_role') } catch {}

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 })
    response.cookies.set('user_session', '', { path: '/', maxAge: 0 })
    response.cookies.set('user_role', '', { path: '/', maxAge: 0 })

    return response
  } catch (err: any) {
    return NextResponse.json({ success: true })
  }
}
