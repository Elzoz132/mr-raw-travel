import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Authentication | Mr.Raw Travel',
  robots: {
    index: false,
    follow: false
  }
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
