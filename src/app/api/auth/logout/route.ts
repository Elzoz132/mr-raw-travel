import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(ADMIN_COOKIE_NAME)
    cookieStore.delete('user_session')

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
