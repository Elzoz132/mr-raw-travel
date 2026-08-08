import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { TripDetailClientView } from '@/components/trip/TripDetailClientView'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'

export const dynamic = 'force-dynamic'

interface TripDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TripDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const trip = await prisma.trip.findFirst({
      where: {
        OR: [{ slug }, { seoSlug: slug }]
      }
    })

    if (!trip) return { title: 'Trip Not Found | Mr.Raw Travel' }

    const canonicalUrl = trip.canonicalUrl || `https://mrrawtravel.com/trips/${trip.slug}`
    const title = trip.seoTitle || `${trip.titleAr || trip.titleEn} | Mr.Raw Travel الغردقة`
    const description = (
      trip.seoDescription ||
      trip.descAr ||
      trip.descEn ||
      `احجز رحلة ${trip.titleAr || trip.titleEn} في الغردقة والبحر الأحمر بأفضل الأسعار مع Mr.Raw Travel.`
    ).slice(0, 160)

    const keywords = trip.seoKeywords
      ? trip.seoKeywords.split(',').map((k) => k.trim())
      : [
          trip.titleAr,
          trip.titleEn,
          'رحلات الغردقة',
          'سنوركلينج الغردقة',
          'رحلات البحر الأحمر',
          'Hurghada excursions',
          'Mr.Raw Travel'
        ]

    const ogImage = trip.ogImage || trip.coverImage

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'ar-EG': `${canonicalUrl}?lang=ar`,
          'en-US': `${canonicalUrl}?lang=en`,
          'de-DE': `${canonicalUrl}?lang=de`
        }
      },
      robots: {
        index: trip.isIndexed !== false,
        follow: true
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Mr.Raw Travel',
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: trip.titleEn }] : [],
        type: 'article'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImage ? [ogImage] : []
      }
    }
  } catch (e) {
    return { title: 'Mr.Raw Travel Hurghada' }
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { slug } = await params
  let trip: any = null

  try {
    trip = await prisma.trip.findFirst({
      where: {
        OR: [{ slug }, { seoSlug: slug }]
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        packages: { where: { status: 'ACTIVE' }, orderBy: { order: 'asc' } },
        reviews: { where: { status: 'APPROVED' }, orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }] },
        category: true,
        schedules: { where: { status: 'OPEN' }, orderBy: { date: 'asc' } }
      }
    })
  } catch (err) {
    console.error('Error loading trip details page:', err)
  }

  if (!trip) {
    notFound()
  }

  const tripCanonical = trip.canonicalUrl || `https://mrrawtravel.com/trips/${trip.slug}`

  // Schema.org TouristTrip & Product Offer
  const tripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.titleEn || trip.titleAr,
    description: trip.descEn || trip.descAr,
    image: trip.coverImage,
    url: tripCanonical,
    touristType: ['Tourism', 'Adventure', 'Family', 'VIP'],
    offers: {
      '@type': 'Offer',
      price: trip.priceAdultUsd,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: tripCanonical,
      seller: {
        '@type': 'Organization',
        name: 'Mr.Raw Travel',
        url: 'https://mrrawtravel.com'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: trip.rating || 4.9,
      reviewCount: trip.reviewCount || 120,
      bestRating: 5,
      worstRating: 1
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
      />
      <JsonLd
        type="Product"
        data={{
          title: trip.titleEn,
          description: trip.descEn,
          image: trip.coverImage,
          location: trip.location,
          priceUsd: trip.priceAdultUsd,
          rating: trip.rating,
          reviewCount: trip.reviewCount,
          url: `https://mrrawtravel.com/trips/${trip.slug}`
        }}
      />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Breadcrumbs
          items={[
            { name: 'الرحلات والتجارب السياحية', url: 'https://mrrawtravel.com/trips' },
            { name: trip.titleAr || trip.titleEn, url: tripCanonical }
          ]}
        />
      </div>
      <TripDetailClientView trip={trip} />
    </>
  )
}
