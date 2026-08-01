import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get(ADMIN_COOKIE_NAME)
    const userSession = cookieStore.get('user_session')
    const userRole = cookieStore.get('user_role')?.value

    if (adminSession?.value === 'authenticated') {
      return NextResponse.json(
        {
          authenticated: true,
          user: { id: 'admin-master', name: 'Executive Admin', email: 'admin@mrrawtravel.com', role: 'ADMIN' }
        },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      )
    }

    if (userSession?.value) {
      try {
        const u = JSON.parse(userSession.value)
        return NextResponse.json(
          {
            authenticated: true,
            user: {
              ...u,
              role: u.role || userRole || 'CUSTOMER'
            }
          },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
        )
      } catch (e) {
        // ignore parse error
      }
    }

    return NextResponse.json(
      { authenticated: false, user: null },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    )
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    )
  }
}
