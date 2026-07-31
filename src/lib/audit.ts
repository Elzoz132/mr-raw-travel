import { prisma } from '@/lib/db'

export interface LogParams {
  userId?: string
  userName?: string
  userRole?: string
  action: string
  resource?: string
  details?: string
  req?: Request
}

export async function logActivity({
  userId,
  userName,
  userRole,
  action,
  resource,
  details,
  req
}: LogParams) {
  try {
    let ipAddress = '127.0.0.1'
    let userAgent = 'Unknown Browser'

    if (req) {
      const forwarded = req.headers.get('x-forwarded-for')
      ipAddress = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
      userAgent = req.headers.get('user-agent') || 'Unknown Browser'
    }

    // Basic User-Agent parse
    let browser = 'Chrome'
    let os = 'Windows'
    if (userAgent.includes('Firefox')) browser = 'Firefox'
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari'
    if (userAgent.includes('Mac')) os = 'macOS'
    if (userAgent.includes('Linux')) os = 'Linux'
    if (userAgent.includes('iPhone') || userAgent.includes('Android')) os = 'Mobile'

    await prisma.activityLog.create({
      data: {
        userId,
        userName: userName || 'Admin System',
        userRole: userRole || 'SUPER_ADMIN',
        action,
        resource,
        details,
        ipAddress,
        browser,
        os,
        device: os
      }
    })
  } catch (error) {
    console.error('Failed to write immutable activity log:', error)
  }
}
