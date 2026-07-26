import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { SearchModal } from '@/components/layout/SearchModal'
import { Pixels } from '@/components/marketing/Pixels'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-arabic',
})

export const metadata: Metadata = {
  title: 'Mr.Raw Travel | Luxury Tourism & Excursions Hurghada',
  description: 'Book world-class VIP private yacht charters, Giftun paradise island sea trips, mega desert quad safaris, and historical Luxor day tours in Hurghada, Egypt.',
  keywords: 'Hurghada excursions, Giftun island, Orange Bay, Quad safari, Red Sea yacht rental, Luxor tour, Diving Hurghada, Mr.Raw Travel',
  openGraph: {
    title: 'Mr.Raw Travel - Luxury Hurghada Excursions',
    description: 'Premier international tourism booking platform in Hurghada, Egypt.',
    url: 'https://mrrawtravel.com',
    siteName: 'Mr.Raw Travel',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Mr.Raw Travel Hurghada',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmArabic.variable}`}>
      <body className="bg-[#0B0F17] text-white min-h-screen flex flex-col antialiased">
        <Pixels />
        <CustomCursor />
        <Navbar />
        <SearchModal />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
