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

  // Fallback if empty DB
  if (trips.length === 0) {
    trips = [
      {
        id: '1',
        slug: 'giftun-island-vip-snorkeling',
        titleEn: 'Giftun Island Paradise & VIP Snorkeling Cruise',
        titleAr: 'رحلة جزيرة جفتون الفاخرة والسنوركلنج الملكي',
        titleDe: 'Paradiesinsel Giftun & VIP Schnorchelausflug',
        descEn: 'Sail aboard our premium motor yacht to Giftun Island (Orange Bay / Paradise Beach). Enjoy two guided snorkeling stops at pristine coral reefs, a gourmet seafood lunch buffet, soft drinks, and watersports.',
        descAr: 'أبحر على متن يختنا الفاخر إلى جزيرة جفتون (أورنج باي / بارادايس). استمتع بوقفتين سنوركلنج عند أجمل الشعاب المرجانية، وبوفيه مأكولات بحرية ومشويات فاخر.',
        descDe: 'Segeln Sie mit unserer Premium-Yacht zur Insel Giftun. Genießen Sie zwei geführte Schnorchelstopps an unberührten Riffen und Meeresfrüchte Buffet.',
        coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        priceAdultUsd: 45,
        priceAdultEur: 42,
        priceAdultEgp: 2200,
        duration: '8 Hours',
        location: 'Giftun Island, Hurghada',
        rating: 4.95,
        reviewCount: 148,
        maxSeats: 35,
        bookedSeats: 12
      },
      {
        id: '2',
        slug: 'mega-desert-safari-quad-bedouin-dinner',
        titleEn: 'Mega Desert Safari: Quad Bike, Camel Ride & Bedouin Show',
        titleAr: 'سفاري الصحراء الشامل: البيتش باجي وركوب الجمال والعشاء البدوي',
        titleDe: 'Mega Wüstensafari: Quad, Kamelritt & Beduinenshow',
        descEn: 'Experience the ultimate Hurghada desert adventure! Drive quad bikes across high sand dunes, ride camels, visit Bedouin village, and enjoy an oriental show with BBQ dinner.',
        descAr: 'خض مغامرة الصحراء الإفريقية المثيرة! قيادة البيتش باجي الرباعي فوق الكثبان الرملية، وسبايدر باجي، وزيارة القرية البدوية، وركوب الجمال.',
        descDe: 'Erleben Sie das ultimative Wüstenabenteuer! Fahren Sie Quads über goldene Dünen, besuchen Sie ein Beduinendorf und genießen Sie eine orientalische Show.',
        coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        priceAdultUsd: 35,
        priceAdultEur: 32,
        priceAdultEgp: 1700,
        duration: '6 Hours',
        location: 'Hurghada Desert',
        rating: 4.92,
        reviewCount: 215,
        maxSeats: 40,
        bookedSeats: 18
      },
      {
        id: '3',
        slug: 'luxor-valley-of-the-kings-vip-day-tour',
        titleEn: 'Historical Luxor & Valley of the Kings Private VIP Tour',
        titleAr: 'رحلة الأقصر ووادي الملوك الملكية بسيارات فاخرة',
        titleDe: 'Historisches Luxor & Tal der Könige VIP Ausflug',
        descEn: 'Travel in luxury air-conditioned comfort to Karnak Temple, Hatshepsut Temple, Colossi of Memnon, sail the Nile by felucca, and inside Tutankhamun royal tombs in Valley of the Kings.',
        descAr: 'سافر في منتهى الراحة إلى أكبر متحف مفتوح في العالم. اكتشف معبد الكرنك ومعبد حتشبسوت وتمثالي ممنون وركوب الفلوكة في النيل ودخول مقابر وادي الملوك.',
        descDe: 'Reisen Sie im luxuriösen VIP-Bus nach Luxor. Entdecken Sie den Karnak-Tempel, das Tal der Könige und den Hatschepsut-Tempel.',
        coverImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
        priceAdultUsd: 85,
        priceAdultEur: 79,
        priceAdultEgp: 4200,
        duration: '14 Hours',
        location: 'Luxor, Egypt',
        rating: 4.98,
        reviewCount: 96,
        maxSeats: 16,
        bookedSeats: 8
      }
    ]
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
      <PopularTrips trips={trips} />
      <CategoryGrid />
      <SpecialOffers />
      <MasonryGallery />
      <Testimonials />
      <FAQSection />
    </>
  )
}
