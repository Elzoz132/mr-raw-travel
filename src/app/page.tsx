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

  return (
    <>
      <JsonLd
        type="TouristAttraction"
        data={{
          title: 'Mr.Raw Travel Hurghada Excursions',
          description: 'Premier luxury tourism platform in Hurghada, Egypt.',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
          priceUsd: 45,
          rating: 4.95,
          reviewCount: 450
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
