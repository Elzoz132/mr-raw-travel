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
    '/admin/addons',
    '/admin/trips',
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
    '/admin/sessions',
    '/admin/communication'
  ],
  ADMIN: [
    '/admin/dashboard',
    '/admin/homepage',
    '/admin/content',
    '/admin/footer',
    '/admin/packages',
    '/admin/addons',
    '/admin/trips',
    '/admin/reviews',
    '/admin/gallery',
    '/admin/bookings',
    '/admin/crm',
    '/admin/coupons',
    '/admin/gateways',
    '/admin/settings',
    '/admin/users',
    '/admin/communication'
  ],
  CONTENT_EDITOR: [
    '/admin/dashboard',
    '/admin/homepage',
    '/admin/content',
    '/admin/footer',
    '/admin/packages',
    '/admin/addons',
    '/admin/trips',
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

  // 1. Customer Dashboard Protection
  if (pathname.startsWith('/customer')) {
    const userSession = req.cookies.get('user_session')?.value
    if (!userSession) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  // 2. Admin Portal & Sub-routes RBAC Protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/access-denied') {
    const adminSession = req.cookies.get('mrraw_admin_session')?.value
    const userRoleCookie = req.cookies.get('user_role')?.value

    if (!adminSession && (!userRoleCookie || userRoleCookie === 'CUSTOMER')) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (adminSession === 'authenticated' || userRoleCookie === 'SUPER_ADMIN' || userRoleCookie === 'ADMIN') {
      return NextResponse.next()
    }

    const effectiveRole = userRoleCookie && ROLE_ROUTE_PERMISSIONS[userRoleCookie] ? userRoleCookie : 'SUPER_ADMIN'
    const allowedRoutes = ROLE_ROUTE_PERMISSIONS[effectiveRole] || ROLE_ROUTE_PERMISSIONS.SUPER_ADMIN
    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route))

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/admin/access-denied', req.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*']
}
