import { prisma } from '@/lib/db'
import { PopularTrips } from '@/components/home/PopularTrips'
import { JsonLd } from '@/components/seo/JsonLd'

export const revalidate = 60

interface TripsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function TripsCatalogPage({ searchParams }: TripsPageProps) {
  const { category } = await searchParams

  let trips: any[] = []

  try {
    const whereCondition: any = { isPublished: true }
    if (category && category !== 'all') {
      whereCondition.category = { slug: category }
    }

    trips = await prisma.trip.findMany({
      where: whereCondition,
      orderBy: { rating: 'desc' },
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
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          EXPLORE ALL RED SEA EXCURSIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Luxury Hurghada Excursions & Charters
        </h1>
        <p className="text-sm text-slate-300">
          Handcrafted private yacht cruises, Giftun paradise island sea trips, quad safari adventures, and historical day tours to Luxor.
        </p>
      </div>

      {/* Catalog Grid */}
      <PopularTrips trips={mappedTrips} />

    </div>
  )
}
