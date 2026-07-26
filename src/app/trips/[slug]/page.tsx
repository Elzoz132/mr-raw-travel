import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { TripDetailClientView } from '@/components/trip/TripDetailClientView'
import { JsonLd } from '@/components/seo/JsonLd'

interface TripDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TripDetailPageProps) {
  const { slug } = await params
  const trip = await prisma.trip.findUnique({ where: { slug } })
  if (!trip) return { title: 'Trip Not Found | Mr.Raw Travel' }

  return {
    title: `${trip.titleEn} | Mr.Raw Travel Hurghada`,
    description: trip.descEn.slice(0, 160),
    openGraph: {
      title: trip.titleEn,
      description: trip.descEn,
      images: [trip.coverImage],
    },
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { slug } = await params
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      reviews: { orderBy: { createdAt: 'desc' } },
      category: true,
      schedules: { where: { status: 'OPEN' }, orderBy: { date: 'asc' } }
    }
  })

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
