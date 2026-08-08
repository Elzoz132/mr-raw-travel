import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { HeroSection } from '@/components/home/HeroSection'
import { PopularTrips, TripCardData } from '@/components/home/PopularTrips'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { SpecialOffers } from '@/components/home/SpecialOffers'
import { MasonryGallery } from '@/components/home/MasonryGallery'
import { HurghadaWeatherWidget } from '@/components/home/HurghadaWeatherWidget'
import { Testimonials } from '@/components/home/Testimonials'
import { FAQSection } from '@/components/home/FAQSection'
import { JsonLd } from '@/components/seo/JsonLd'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mr.Raw Travel | رحلات سياحية في الغردقة والبحر الأحمر',
  description: 'اكتشف أفضل الرحلات السياحية في الغردقة والبحر الأحمر مع Mr.Raw Travel. رحلات بحرية، سنوركلينج، سفاري، رحلات خاصة، يخت، وسبيد بوت مع إمكانية الحجز أونلاين.',
  alternates: {
    canonical: 'https://mrrawtravel.com',
    languages: {
      'ar-EG': 'https://mrrawtravel.com',
      'en-US': 'https://mrrawtravel.com',
      'de-DE': 'https://mrrawtravel.com'
    }
  },
  openGraph: {
    title: 'Mr.Raw Travel | رحلات سياحية في الغردقة والبحر الأحمر',
    description: 'اكتشف أفضل الرحلات السياحية في الغردقة والبحر الأحمر مع Mr.Raw Travel. رحلات بحرية، سنوركلينج، سفاري، ورحلات خاصة.',
    url: 'https://mrrawtravel.com',
    images: [{ url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80' }]
  }
}

export default async function HomePage() {
  let trips: TripCardData[] = []

  try {
    const dbTrips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' }
    })

    trips = dbTrips.map((t: any) => ({
      id: t.id,
      slug: t.slug,
      titleEn: t.titleEn,
      titleAr: t.titleAr,
      titleDe: t.titleDe,
      descEn: t.descEn,
      descAr: t.descAr,
      descDe: t.descDe,
      coverImage: t.coverImage,
      priceAdultUsd: t.priceAdultUsd,
      priceAdultEur: t.priceAdultEur,
      priceAdultEgp: t.priceAdultEgp,
      duration: t.duration,
      location: t.location,
      rating: t.rating,
      reviewCount: t.reviewCount,
      maxSeats: t.maxSeats,
      bookedSeats: t.bookedSeats,
      discountPercent: t.discountPercent,
      isFeatured: t.isFeatured,
      isSpecialOffer: t.isSpecialOffer
    }))
  } catch (error) {
    console.error('Error fetching trips from DB:', error)
  }

  // Schema.org Organization + WebSite
  const orgSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://mrrawtravel.com/#organization',
        name: 'Mr.Raw Travel',
        alternateName: 'مستر رو ترافيل',
        url: 'https://mrrawtravel.com',
        logo: 'https://mrrawtravel.com/logo.png',
        sameAs: [
          'https://www.facebook.com/share/1apfrxKfvg/?mibextid=wwXIfr',
          'https://www.instagram.com/mr_raw_travel?igsh=bnB0YnFlOGlnN2g2',
          'https://www.tiktok.com/@mr.raw_travel?_r=1&_t=ZS-98WNhVwMfXY'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+201022392428',
          contactType: 'customer service',
          areaServed: ['EG', 'DE', 'GB', 'US'],
          availableLanguage: ['Arabic', 'English', 'German']
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://mrrawtravel.com/#website',
        url: 'https://mrrawtravel.com',
        name: 'Mr.Raw Travel',
        publisher: { '@id': 'https://mrrawtravel.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://mrrawtravel.com/trips?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <JsonLd
        type="Product"
        data={{
          title: 'Mr.Raw Travel Hurghada Excursions',
          description: 'Premier tourism platform in Hurghada, Egypt for boat trips, snorkeling, and quad safaris.',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
          priceUsd: 45,
          rating: 4.95,
          reviewCount: 450,
          url: 'https://mrrawtravel.com'
        }}
      />
      <HeroSection />
      <HurghadaWeatherWidget />
      {trips.length > 0 && <PopularTrips trips={trips} />}
      <CategoryGrid />
      <SpecialOffers />
      <MasonryGallery />
      <Testimonials />
      <FAQSection />
    </>
  )
}
