import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { PopularTrips } from '@/components/home/PopularTrips'
import { CustomPackageBuilder } from '@/components/trip/CustomPackageBuilder'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'دليل رحلات الغردقة والبحر الأحمر | Mr.Raw Travel',
  description: 'احجز رحلات سياحية وبحرية في الغردقة مع Mr.Raw Travel. سنوركلينج، Orange Bay، رحلات يخت، سفاري الصحراء، ورحلات خاصة بأسعار ممتازة.',
  alternates: {
    canonical: 'https://mrrawtravel.com/trips',
    languages: {
      'ar-EG': 'https://mrrawtravel.com/trips',
      'en-US': 'https://mrrawtravel.com/trips',
      'de-DE': 'https://mrrawtravel.com/trips'
    }
  },
  openGraph: {
    title: 'دليل رحلات الغردقة والبحر الأحمر | Mr.Raw Travel',
    description: 'تصفح جميع رحلات الغردقة البحرية والسفاري واليخوت مع Mr.Raw Travel.',
    url: 'https://mrrawtravel.com/trips',
    images: [{ url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80' }]
  }
}

interface TripsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function TripsCatalogPage({ searchParams }: TripsPageProps) {
  const { category } = await searchParams

  let trips: any[] = []

  try {
    const whereCondition: any = {}
    if (category && category !== 'all') {
      whereCondition.category = { slug: category }
    }

    trips = await prisma.trip.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    })
  } catch (err) {
    console.error('Error fetching catalog trips:', err)
  }

  const mappedTrips = trips.map((t) => ({
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

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: 'الرحلات والتجارب السياحية', url: 'https://mrrawtravel.com/trips' }]} />

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          EXPLORE ALL RED SEA EXCURSIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          رحلات وباقات مستر رو ترافيل الحصرية
        </h1>
        <p className="text-sm text-slate-300">
          تصفح كافة رحلات السنوركلينج، اليخت الخاص، رحلات جزيرة Orange Bay، وسفاري الصحراء بالأسعار التنافسية.
        </p>
      </div>

      {/* Catalog Grid */}
      <PopularTrips trips={mappedTrips} />

      {/* CUSTOM PACKAGE BUILDER SECTION */}
      <CustomPackageBuilder />

    </div>
  )
}
