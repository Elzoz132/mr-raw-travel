import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export const ADMIN_COOKIE_NAME = 'mrraw_admin_session'
export const ADMIN_SECRET_PASS = 'admin123'
const SETTINGS_KEY = 'admin_panel_passwords'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  return session?.value === 'authenticated'
}

export async function getAdminPasswords(): Promise<string[]> {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: SETTINGS_KEY }
    })

    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error fetching admin passwords setting:', err)
  }

  return [ADMIN_SECRET_PASS, 'MrRaw2026!VIP', 'admin']
}

export async function saveAdminPasswords(passwords: string[]) {
  const uniquePasswords = Array.from(new Set(passwords.filter(Boolean)))
  if (uniquePasswords.length === 0) {
    uniquePasswords.push(ADMIN_SECRET_PASS)
  }

  await prisma.settings.upsert({
    where: { key: SETTINGS_KEY },
    update: { value: JSON.stringify(uniquePasswords) },
    create: { key: SETTINGS_KEY, value: JSON.stringify(uniquePasswords) }
  })

  return uniquePasswords
}
