'use client'

import React from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { formatPrice } from '@/lib/utils'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Star, Clock, MapPin, Heart, ArrowRight } from 'lucide-react'

export interface TripCardData {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  titleDe: string
  descEn: string
  descAr: string
  descDe: string
  coverImage: string
  priceAdultUsd: number
  priceAdultEur: number
  priceAdultEgp: number
  duration: string
  location: string
  rating: number
  reviewCount: number
  maxSeats: number
  bookedSeats: number
  discountPercent?: number
  isFeatured?: boolean
  isSpecialOffer?: boolean
}

interface PopularTripsProps {
  trips: TripCardData[]
}

export const PopularTrips: React.FC<PopularTripsProps> = ({ trips }) => {
  const { currency, language, wishlist, toggleWishlist } = useAppStore()
  const t = dictionaries[language].popular
  const isArabic = language === 'ar'

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-2">
            {t.sectionBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        <Link href="/trips">
          <LuxuryButton variant="outline" size="sm" className="flex items-center gap-2">
            <span>{isArabic ? 'استكشف كل الرحلات' : 'Explore All Excursions'}</span>
            <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
          </LuxuryButton>
        </Link>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => {
          const title = isArabic ? trip.titleAr : language === 'de' ? trip.titleDe : trip.titleEn
          const desc = isArabic ? trip.descAr : language === 'de' ? trip.descDe : trip.descEn
          
          const price = currency === 'EUR' ? trip.priceAdultEur : currency === 'EGP' ? trip.priceAdultEgp : trip.priceAdultUsd
          const formattedPrice = formatPrice(price, currency, language)
          const isWishlisted = wishlist.includes(trip.id)
          const seatsLeft = trip.maxSeats - trip.bookedSeats
          const formattedSeatsLeft = isArabic ? seatsLeft.toLocaleString('ar-EG') : seatsLeft

          return (
            <div
              key={trip.id}
              className="glass-card rounded-3xl overflow-hidden flex flex-col group relative"
            >
              {/* Image & Overlay Badges */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={trip.coverImage}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/30" />

                {/* Seats Left Badge */}
                <div className="absolute top-4 left-4 bg-[#0B0F17]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{formattedSeatsLeft} {t.seatsLeft}</span>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(trip.id)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all ${
                    isWishlisted
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0F17]'
                      : 'bg-[#0B0F17]/60 border-white/10 text-white hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                {/* Price Badge */}
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0B0F17] font-black px-4 py-1.5 rounded-xl shadow-lg text-sm">
                  {formattedPrice} <span className="text-[10px] font-normal opacity-90">/ {t.perPerson}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {trip.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {isArabic ? 'الغردقة، مصر' : trip.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Rating & Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-bold text-white">
                      {isArabic ? trip.rating.toLocaleString('ar-EG') : trip.rating}
                    </span>
                    <span className="text-slate-500">
                      ({isArabic ? trip.reviewCount.toLocaleString('ar-EG') : trip.reviewCount})
                    </span>
                  </div>

                  <Link href={`/trips/${trip.slug}`}>
                    <LuxuryButton variant="gold" size="sm">
                      {t.viewDetails}
                    </LuxuryButton>
                  </Link>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
