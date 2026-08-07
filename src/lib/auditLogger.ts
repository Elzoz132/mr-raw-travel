import { prisma } from '@/lib/db'

export interface LogEventParams {
  userId?: string | null
  userName?: string | null
  userRole?: string | null
  action: string // e.g. LOGIN, LOGOUT, BOOKING_CREATED, BOOKING_CANCELLED, PAYMENT_APPROVED, TRIP_CREATED, TRIP_DELETED, PRICE_CHANGED, SETTINGS_CHANGED, ROLE_CHANGED
  resource?: string // e.g. TRIPS, PACKAGES, BOOKINGS, USERS, SETTINGS
  details?: string | object
  req?: Request | null
}

export function extractClientIp(req?: Request | null): string {
  if (!req) return '127.0.0.1'
  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp
  const xForwardedFor = req.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return '127.0.0.1'
}

export async function logAuditEvent(params: LogEventParams): Promise<void> {
  try {
    const ipAddress = extractClientIp(params.req)
    const userAgent = params.req ? (params.req.headers.get('user-agent') || 'Unknown') : 'System'
    const detailsStr = typeof params.details === 'object' ? JSON.stringify(params.details) : (params.details || '')

    await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || 'System',
        userRole: params.userRole || 'GUEST',
        action: params.action,
        resource: params.resource || 'GENERAL',
        details: detailsStr,
        ipAddress,
        browser: userAgent.slice(0, 200)
      }
    })
  } catch (err) {
    console.error('Audit log creation non-fatal error:', err)
  }
}
