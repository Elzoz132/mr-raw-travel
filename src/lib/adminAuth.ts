import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'mrraw_admin_session'
export const ADMIN_SECRET_PASS = 'admin123'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  return session?.value === 'authenticated'
}
