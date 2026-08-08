import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { SearchModal } from '@/components/layout/SearchModal'
import { Pixels } from '@/components/marketing/Pixels'
import { FloatingWhatsAppWidget } from '@/components/common/FloatingWhatsAppWidget'
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider'
import { AmbientBackground } from '@/components/common/AmbientBackground'
import { ScrollProgressBar } from '@/components/common/ScrollProgressBar'
import { LuxurySplashLoader } from '@/components/common/LuxurySplashLoader'
import { PageTransition } from '@/components/common/PageTransition'
import { Analytics } from '@vercel/analytics/next'

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
  metadataBase: new URL('https://mrrawtravel.com'),
  title: {
    default: 'Mr.Raw Travel | رحلات سياحية في الغردقة والبحر الأحمر',
    template: '%s | Mr.Raw Travel'
  },
  description: 'اكتشف أفضل الرحلات السياحية في الغردقة والبحر الأحمر مع Mr.Raw Travel. رحلات بحرية، سنوركلينج، سفاري، وركوب يخت بأفضل الأسعار مع حجز مباشر أونلاين.',
  keywords: [
    'رحلات الغردقة',
    'رحلات في الغردقة',
    'رحلات سياحية في الغردقة',
    'رحلات بحرية الغردقة',
    'رحلات البحر الأحمر',
    'رحلات سنوركلينج الغردقة',
    'سفاري الغردقة',
    'رحلات يخت الغردقة',
    'رحلات Orange Bay',
    'حجز رحلات الغردقة',
    'Hurghada tours',
    'Hurghada excursions',
    'Hurghada boat trips',
    'Hurghada snorkeling trips',
    'Hurghada safari',
    'Orange Bay Hurghada',
    'Hurghada Ausflüge',
    'Mr.Raw Travel'
  ],
  alternates: {
    canonical: 'https://mrrawtravel.com',
    languages: {
      'ar-EG': 'https://mrrawtravel.com',
      'en-US': 'https://mrrawtravel.com',
      'de-DE': 'https://mrrawtravel.com'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Mr.Raw Travel | رحلات سياحية في الغردقة والبحر الأحمر',
    description: 'احجز أفضل الرحلات السياحية، الرحلات البحرية، السنوركلينج والسفاري في الغردقة مع Mr.Raw Travel مع تأكيد حجز فوري.',
    url: 'https://mrrawtravel.com',
    siteName: 'Mr.Raw Travel',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Mr.Raw Travel Hurghada Excursions',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr.Raw Travel | رحلات سياحية في الغردقة والبحر الأحمر',
    description: 'احجز رحلتك البحرية أو السفاري في الغردقة أونلاين مع Mr.Raw Travel.',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${ibmArabic.variable}`}>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body suppressHydrationWarning className="bg-[#0B0F17] text-white min-h-screen flex flex-col antialiased relative">
        <SmoothScrollProvider>
          <LuxurySplashLoader />
          <AmbientBackground />
          <ScrollProgressBar />
          <Pixels />
          <CustomCursor />
          <Navbar />
          <SearchModal />
          <main className="flex-1 relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <FloatingWhatsAppWidget />
          <Footer />
          <Analytics />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
