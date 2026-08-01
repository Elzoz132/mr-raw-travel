import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { TripDetailClientView } from '@/components/trip/TripDetailClientView'
import { JsonLd } from '@/components/seo/JsonLd'

export const dynamic = 'force-dynamic'

interface TripDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TripDetailPageProps) {
  try {
    const { slug } = await params
    const trip = await prisma.trip.findUnique({ where: { slug } })
    if (!trip) return { title: 'Trip Not Found | Mr.Raw Travel' }

    const desc = trip.descEn || trip.descAr || trip.titleEn || 'Mr.Raw Luxury Excursion'
    return {
      title: `${trip.titleEn || trip.titleAr} | Mr.Raw Travel Hurghada`,
      description: desc.slice(0, 160),
      openGraph: {
        title: trip.titleEn || trip.titleAr,
        description: desc,
        images: trip.coverImage ? [trip.coverImage] : [],
      },
    }
  } catch (e) {
    return { title: 'Mr.Raw Travel Hurghada' }
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { slug } = await params
  let trip: any = null

  try {
    trip = await prisma.trip.findUnique({
      where: { slug },
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

  return (
    <>
      <JsonLd
        type="TouristAttraction"
        data={{
          title: trip.titleEn,
          description: trip.descEn,
          image: trip.coverImage,
          location: trip.location,
          priceUsd: trip.priceAdultUsd,
          rating: trip.rating,
          reviewCount: trip.reviewCount
        }}
      />
      <TripDetailClientView trip={trip} />
    </>
  )
}
