import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()

  let dbStatus = 'HEALTHY'
  let dbLatencyMs = 0
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    dbLatencyMs = Date.now() - dbStart
  } catch (err: any) {
    dbStatus = 'UNHEALTHY: ' + (err.message || 'Connection failed')
  }

  let emailStatus = 'HEALTHY'
  if (!process.env.GMAIL_USER && !process.env.RESEND_API_KEY) {
    emailStatus = 'CONFIG_WARNING: Missing GMAIL_USER or RESEND_API_KEY'
  }

  let cloudinaryStatus = 'HEALTHY'
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    cloudinaryStatus = 'CONFIG_WARNING: Missing Cloudinary environment variables'
  }

  const isAllHealthy = dbStatus === 'HEALTHY'

  const responseBody = {
    status: isAllHealthy ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    responseTimeMs: Date.now() - startTime,
    services: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs
      },
      emailProvider: {
        status: emailStatus,
        resendConfigured: !!process.env.RESEND_API_KEY,
        gmailConfigured: !!process.env.GMAIL_USER
      },
      cloudinaryStorage: {
        status: cloudinaryStatus,
        configured: !!process.env.CLOUDINARY_CLOUD_NAME
      }
    }
  }

  return NextResponse.json(responseBody, { status: isAllHealthy ? 200 : 503 })
}
