'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useStore'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { TripBookingWidget } from '@/components/trip/TripBookingWidget'
import { PackageComparison, PackageData } from '@/components/trip/PackageComparison'
import { VerifiedReviewModal } from '@/components/trip/VerifiedReviewModal'
import { 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  ShieldCheck,
  MessageSquarePlus,
  BadgeCheck
} from 'lucide-react'

interface TripDetailClientViewProps {
  trip: {
    id: string
    slug: string
    titleEn: string
    titleAr: string
    titleDe: string
    descEn: string
    descAr: string
    descDe: string
    priceAdultUsd: number
    priceChildUsd: number
    priceAdultEur: number
    priceChildEur: number
    priceAdultEgp: number
    priceChildEgp: number
    priceAdultGbp?: number
    priceChildGbp?: number
    duration: string
    pickupTime: string
    location: string
    maxSeats: number
    bookedSeats: number
    rating: number
    reviewCount: number
    coverImage: string
    includedEn: string
    includedAr: string
    includedDe: string
    excludedEn: string
    excludedAr: string
    excludedDe: string
    itineraryEn: string
    itineraryAr: string
    itineraryDe: string
    category?: { nameEn: string; nameAr: string; nameDe: string } | null
    images: Array<{ id: string; url: string; caption?: string | null }>
    packages?: PackageData[]
    reviews: Array<{
      id: string
      author: string
      country: string
      rating: number
      title?: string | null
      comment: string
      isVerified?: boolean
      packageName?: string | null
      travelDate?: string | Date | null
      adminReply?: string | null
    }>
  }
}

export const TripDetailClientView: React.FC<TripDetailClientViewProps> = ({ trip }) => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'
  const isGerman = language === 'de'

  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
    trip.packages && trip.packages.length > 0 ? trip.packages[0] : null
  )

  const [isReviewModalOpen, setReviewModalOpen] = useState(false)

  const title = isArabic ? trip.titleAr : isGerman ? trip.titleDe : trip.titleEn
  const desc = isArabic ? trip.descAr : isGerman ? trip.descDe : trip.descEn
  const catName = isArabic ? trip.category?.nameAr : isGerman ? trip.category?.nameDe : trip.category?.nameEn

  const includedStr = isArabic ? trip.includedAr : isGerman ? trip.includedDe : trip.includedEn
  const excludedStr = isArabic ? trip.excludedAr : isGerman ? trip.excludedDe : trip.excludedEn
  const itineraryStr = isArabic ? trip.itineraryAr : isGerman ? trip.itineraryDe : trip.itineraryEn

  const includedList: string[] = JSON.parse(includedStr || '[]')
  const excludedList: string[] = JSON.parse(excludedStr || '[]')
  const itineraryList: { time: string; title: string; desc: string }[] = JSON.parse(itineraryStr || '[]')

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-[#D4AF37]">{isArabic ? 'الرئيسية' : 'Home'}</Link>
        <ChevronRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
        <Link href="/trips" className="hover:text-[#D4AF37]">{isArabic ? 'الرحلات' : 'Excursions'}</Link>
        <ChevronRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
        <span className="text-white font-semibold truncate max-w-md">{title}</span>
      </div>

      {/* Title Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider">
            {catName || (isArabic ? 'رحلة VIP' : 'VIP Excursion')}
          </span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-white">
              {isArabic ? trip.rating.toLocaleString('ar-EG') : trip.rating}
            </span>
            <span className="text-slate-400">
              ({isArabic ? trip.reviewCount.toLocaleString('ar-EG') : trip.reviewCount} {isArabic ? 'تقييم' : 'Reviews'})
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            {isArabic ? 'الغردقة، مصر' : trip.location}
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h1>
      </div>

      {/* Hero Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <div className="md:col-span-2 relative h-full">
          <img
            src={trip.coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          {trip.images.slice(0, 2).map((img, i) => (
            <div key={i} className="relative h-full overflow-hidden">
              <img
                src={img.url}
                alt={img.caption || title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
          {trip.images.length < 2 && (
            <div className="relative h-full bg-[#0F172A] flex items-center justify-center text-slate-500 text-xs">
              {isArabic ? 'صور إضافية قريباً' : 'More Photos Coming Soon'}
            </div>
          )}
        </div>
      </div>

      {/* TRIP PACKAGES COMPARISON SECTION */}
      {trip.packages && trip.packages.length > 0 && (
        <PackageComparison
          packages={trip.packages}
          selectedPackageId={selectedPackage?.id || null}
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
        />
      )}

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column: Details, Itinerary, Included */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview */}
          <div className="glass-panel rounded-3xl p-8 space-y-4">
            <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
              {isArabic ? 'تفاصيل ومعلومات الرحلة' : 'Excursion Overview'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5 text-xs">
              <div>
                <span className="text-slate-400 block">{isArabic ? 'مدة الرحلة' : 'Duration'}</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedPackage?.duration || trip.duration}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{isArabic ? 'موعد التحرك' : 'Pickup Time'}</span>
                <span className="font-bold text-white">{trip.pickupTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isArabic ? 'أقصى عدد ركاب' : 'Max Seats'}</span>
                <span className="font-bold text-white">
                  {isArabic ? `${(selectedPackage?.capacity || trip.maxSeats).toLocaleString('ar-EG')} مسافر` : `${selectedPackage?.capacity || trip.maxSeats} Travelers`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{isArabic ? 'اللغات المتاحة' : 'Languages'}</span>
                <span className="font-bold text-white">العربية، English, Deutsch</span>
              </div>
            </div>
          </div>

          {/* Itinerary Timeline */}
          {itineraryList.length > 0 && (
            <div className="glass-panel rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                {isArabic ? 'جدول ومراحل الرحلة' : 'Itinerary & Schedule'}
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#D4AF37]/30">
                {itineraryList.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
                    <div>
                      <span className="text-xs font-bold text-[#D4AF37] block mb-0.5">
                        {item.time}
                      </span>
                      <h4 className="text-base font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included / Excluded Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Included */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {isArabic ? 'السعر يشمل' : "What's Included"}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {includedList.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Excluded */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                {isArabic ? 'السعر لا يشمل' : "What's Excluded"}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {excludedList.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Reviews Section */}
          <div className="glass-panel rounded-3xl p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                {isArabic ? `تقييمات المسافرين الموثقة (${trip.reviews.length.toLocaleString('ar-EG')})` : `Verified Guest Reviews (${trip.reviews.length})`}
              </h3>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl gold-gradient-btn text-xs font-bold text-[#0B0F17] flex items-center gap-1.5 self-start sm:self-auto"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{isArabic ? 'أضف تقييم موثق' : 'Write Verified Review'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {trip.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rev.author}</span>
                      <span className="text-xs text-slate-400">({rev.country})</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        {isArabic ? 'عميل موثق' : 'Verified Guest'}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-white ml-1">
                        {isArabic ? rev.rating.toLocaleString('ar-EG') : rev.rating}
                      </span>
                    </div>
                  </div>

                  {rev.title && (
                    <h5 className="text-xs font-bold text-[#D4AF37]">{rev.title}</h5>
                  )}

                  <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>

                  {rev.adminReply && (
                    <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs text-slate-200 space-y-1">
                      <span className="font-bold text-[#D4AF37] block">
                        {isArabic ? 'رد إدارة مستر راو:' : 'Mr.Raw Operations Management Response:'}
                      </span>
                      <p>{rev.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-1 lg:sticky lg:top-28">
          <TripBookingWidget trip={trip} selectedPackage={selectedPackage} />
        </div>

      </div>

      {/* Verified Review Submission Modal */}
      <VerifiedReviewModal
        tripId={trip.id}
        tripTitle={title}
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

    </div>
  )
}

