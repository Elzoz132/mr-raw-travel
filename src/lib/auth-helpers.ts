import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma, withDbRetry } from '@/lib/db'

/** Password Strength Interface */
export interface PasswordStrength {
  score: number // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong'
  color: string
  suggestions: string[]
}

/** Evaluate Password Strength */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  let score = 0
  const suggestions: string[] = []

  if (!password) {
    return { score: 0, label: 'Weak', color: '#EF4444', suggestions: ['Enter a password'] }
  }

  if (password.length >= 8) score += 1
  else suggestions.push('At least 8 characters')

  if (/[A-Z]/.test(password)) score += 1
  else suggestions.push('Include uppercase letter')

  if (/[0-9]/.test(password)) score += 1
  else suggestions.push('Include number')

  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else suggestions.push('Include special character (!@#$%^&*)')

  let label: PasswordStrength['label'] = 'Weak'
  let color = '#EF4444'

  if (score === 1) {
    label = 'Weak'
    color = '#EF4444'
  } else if (score === 2) {
    label = 'Fair'
    color = '#F59E0B'
  } else if (score === 3) {
    label = 'Good'
    color = '#3B82F6'
  } else if (score >= 4) {
    label = password.length >= 12 ? 'Very Strong' : 'Strong'
    color = '#10B981'
  }

  return { score, label, color, suggestions }
}

/** Hash password using bcryptjs with cost factor 12 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

/** Verify password hash */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/** Generate secure 32-byte hex crypto token */
export function generateCryptoToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/** Immutable Security Activity Logger */
export async function logAuthActivity(data: {
  userId?: string
  userName?: string
  userRole?: string
  action: string
  details?: string
  req?: Request
}) {
  let ipAddress = '127.0.0.1'
  let userAgent = 'Unknown Browser'
  let browser = 'Unknown'
  let os = 'Unknown'
  let device = 'Desktop'

  if (data.req) {
    ipAddress = data.req.headers.get('x-forwarded-for') || data.req.headers.get('x-real-ip') || '127.0.0.1'
    userAgent = data.req.headers.get('user-agent') || 'Unknown Browser'

    if (userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android')) {
      device = 'Mobile'
    } else if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
      device = 'Tablet'
    }

    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Macintosh')) os = 'macOS'
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'
    else if (userAgent.includes('Android')) os = 'Android'
  }

  try {
    await withDbRetry(() =>
      prisma.activityLog.create({
        data: {
          userId: data.userId,
          userName: data.userName || 'Guest User',
          userRole: data.userRole || 'CUSTOMER',
          action: data.action,
          details: data.details,
          ipAddress,
          browser,
          os,
          device,
        }
      })
    )
  } catch (e) {
    console.error('Failed to write activity log:', e)
  }
}
