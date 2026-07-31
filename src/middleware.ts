import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Route access rules per role
const ROLE_ROUTE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    '/admin/dashboard',
    '/admin/homepage',
    '/admin/content',
    '/admin/footer',
    '/admin/packages',
    '/admin/reviews',
    '/admin/gallery',
    '/admin/bookings',
    '/admin/crm',
    '/admin/coupons',
    '/admin/gateways',
    '/admin/settings',
    '/admin/users',
    '/admin/permissions',
    '/admin/activity',
    '/admin/sessions'
  ],
  ADMIN: [
    '/admin/dashboard',
    '/admin/homepage',
    '/admin/content',
    '/admin/footer',
    '/admin/packages',
    '/admin/reviews',
    '/admin/gallery',
    '/admin/bookings',
    '/admin/crm',
    '/admin/coupons'
  ],
  CONTENT_EDITOR: [
    '/admin/dashboard',
    '/admin/homepage',
    '/admin/content',
    '/admin/footer',
    '/admin/packages',
    '/admin/gallery',
    '/admin/settings'
  ],
  CUSTOMER_SUPPORT: [
    '/admin/dashboard',
    '/admin/bookings',
    '/admin/crm',
    '/admin/reviews'
  ]
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only intercept /admin/* routes excluding login & access-denied
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/access-denied') {
    const userRoleCookie = req.cookies.get('user_role')?.value || 'SUPER_ADMIN' // Fallback for active session

    const allowedRoutes = ROLE_ROUTE_PERMISSIONS[userRoleCookie] || ROLE_ROUTE_PERMISSIONS.SUPER_ADMIN
    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route))

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/admin/access-denied', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
