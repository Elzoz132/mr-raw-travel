import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Always cache Prisma instance globally to preserve connection pooling across serverless invocations
globalForPrisma.prisma = prisma

/**
 * Executes a database operation with exponential backoff retry logic to handle
 * transient serverless connection pool exhaustion (EMAXCONNSESSION / max clients reached).
 */
export async function withDbRetry<T>(queryFn: () => Promise<T>, retries = 3): Promise<T> {
  let attempt = 0
  while (attempt < retries) {
    try {
      return await queryFn()
    } catch (err: any) {
      attempt++
      const msg = String(err?.message || '')
      if (
        (msg.includes('max clients reached') ||
          msg.includes('EMAXCONNSESSION') ||
          msg.includes('Connection pool') ||
          msg.includes('Timed out')) &&
        attempt < retries
      ) {
        console.warn(`[Prisma DB Retry] Attempt ${attempt} failed due to pool limit. Retrying in ${200 * attempt}ms...`)
        await new Promise((r) => setTimeout(r, 200 * attempt))
        continue
      }
      throw err
    }
  }
  throw new Error('Database connection limit reached. Please try again.')
}
