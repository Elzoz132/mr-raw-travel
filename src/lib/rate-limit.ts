import { NextResponse } from 'next/server'

// Simple in-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  limit: number      // max requests
  windowMs: number   // window time in ms (e.g. 60000 = 1 min)
}

export function checkRateLimit(key: string, options: RateLimitOptions = { limit: 5, windowMs: 60000 }): { success: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + options.windowMs })
    return { success: true, remaining: options.limit - 1 }
  }

  if (record.count >= options.limit) {
    return { success: false, remaining: 0 }
  }

  record.count += 1
  rateLimitMap.set(key, record)
  return { success: true, remaining: options.limit - record.count }
}
