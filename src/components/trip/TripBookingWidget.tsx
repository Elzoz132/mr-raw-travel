'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Calendar, Users, ShieldCheck, Zap, Heart } from 'lucide-react'

interface TripBookingWidgetProps {
  trip: {
    id: string
    titleEn: string
    titleAr?: string
    coverImage: string
    priceAdultUsd: number
    priceChildUsd: number
    priceAdultEur: number
    priceChildEur: number
    priceAdultEgp: number
    priceChildEgp: number
    priceAdultGbp?: number
    priceChildGbp?: number
    maxSeats: number
    bookedSeats: number
    schedules?: Array<{ id: string; date: Date; availableSeats: number }>
  }
}

export const TripBookingWidget: React.FC<TripBookingWidgetProps> = ({ trip }) => {
  const router = useRouter()
  const { currency, setCurrency, language, updateBookingDraft, wishlist, toggleWishlist } = useAppStore()
  const isArabic = language === 'ar'

  const [date, setDate] = useState(() =>
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  )
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  // Calculate prices based on selected currency
  const getPrices = () => {
    switch (currency) {
      case 'EUR':
        return { adult: trip.priceAdultEur, child: trip.priceChildEur }
      case 'GBP':
        return { adult: trip.priceAdultGbp || Math.round(trip.priceAdultUsd * 0.78), child: trip.priceChildGbp || Math.round(trip.priceChildUsd * 0.78) }
      case 'EGP':
        return { adult: trip.priceAdultEgp, child: trip.priceChildEgp }
      case 'USD':
      default:
        return { adult: trip.priceAdultUsd, child: trip.priceChildUsd }
    }
  }

  const prices = getPrices()
  const totalPrice = adults * prices.adult + children * prices.child
  const seatsLeft = trip.maxSeats - trip.bookedSeats
  const isWishlisted = wishlist.includes(trip.id)

  const handleProceedToBooking = () => {
    updateBookingDraft({
      tripId: trip.id,
      tripTitle: isArabic ? (trip.titleAr || trip.titleEn) : trip.titleEn,
      tripCover: trip.coverImage,
      priceAdultUsd: trip.priceAdultUsd,
      priceChildUsd: trip.priceChildUsd,
      priceAdultEur: trip.priceAdultEur,
      priceChildEur: trip.priceChildEur,
      priceAdultEgp: trip.priceAdultEgp,
      priceChildEgp: trip.priceChildEgp,
      tripDate: date,
      adults,
      children,
    })
    router.push('/booking')
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6">
      
      {/* Price Header & Currency Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-xs text-slate-400 font-medium block">
            {isArabic ? 'السعر يبدأ من' : 'Price From'}
          </span>
          <div className="text-3xl font-extrabold gold-gradient-text">
            {formatCurrencyPrice(prices.adult, currency, language)}
            <span className="text-xs text-slate-400 font-normal ml-1">
              / {isArabic ? 'للشخص' : 'person'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          {(['USD', 'EUR', 'GBP', 'EGP'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                currency === c
                  ? 'bg-[#D4AF37] text-[#0B0F17]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
          {isArabic ? 'اختر تاريخ المغادرة' : 'Select Departure Date'}
        </label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-[#D4AF37]"
        />
        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {isArabic
            ? `متبقي ${seatsLeft.toLocaleString('ar-EG')} مقعد لهذا اليوم`
            : `${seatsLeft} Seats Available for Selected Date`}
        </span>
      </div>

      {/* Adults Counter */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <span className="text-xs font-bold text-white block">
            {isArabic ? 'البالغين (12 سنة فما فوق)' : 'Adults (Age 12+)'}
          </span>
          <span className="text-[10px] text-slate-400">
            {formatCurrencyPrice(prices.adult, currency, language)} {isArabic ? 'لكل شخص' : 'each'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdults(Math.max(1, adults - 1))}
            className="w-8 h-8 rounded-xl bg-white/10 text-white font-bold hover:bg-[#D4AF37] hover:text-[#0B0F17]"
          >
            -
          </button>
          <span className="text-sm font-bold text-white w-4 text-center">
            {isArabic ? adults.toLocaleString('ar-EG') : adults}
          </span>
          <button
            onClick={() => setAdults(adults + 1)}
            className="w-8 h-8 rounded-xl bg-white/10 text-white font-bold hover:bg-[#D4AF37] hover:text-[#0B0F17]"
          >
            +
          </button>
        </div>
      </div>

      {/* Children Counter */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <span className="text-xs font-bold text-white block">
            {isArabic ? 'الأطفال (3-11 سنة)' : 'Children (Age 3-11)'}
          </span>
          <span className="text-[10px] text-slate-400">
            {formatCurrencyPrice(prices.child, currency, language)} {isArabic ? 'لكل شخص' : 'each'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setChildren(Math.max(0, children - 1))}
            className="w-8 h-8 rounded-xl bg-white/10 text-white font-bold hover:bg-[#D4AF37] hover:text-[#0B0F17]"
          >
            -
          </button>
          <span className="text-sm font-bold text-white w-4 text-center">
            {isArabic ? children.toLocaleString('ar-EG') : children}
          </span>
          <button
            onClick={() => setChildren(children + 1)}
            className="w-8 h-8 rounded-xl bg-white/10 text-white font-bold hover:bg-[#D4AF37] hover:text-[#0B0F17]"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal Display */}
      <div className="pt-2 flex items-center justify-between border-t border-white/10">
        <span className="text-xs font-bold text-slate-300">
          {isArabic ? 'المبلغ الإجمالي المستحق:' : 'Total Price Due:'}
        </span>
        <span className="text-2xl font-black text-[#D4AF37]">
          {formatCurrencyPrice(totalPrice, currency, language)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <LuxuryButton
          onClick={handleProceedToBooking}
          variant="gold"
          size="lg"
          className="w-full font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          {isArabic ? 'احجز الآن في دقيقتين' : 'Instant 2-Min Booking'}
        </LuxuryButton>

        <button
          onClick={() => toggleWishlist(trip.id)}
          className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            isWishlisted
              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
              : 'bg-white/5 border-white/10 text-slate-300 hover:border-[#D4AF37]/40'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          {isWishlisted
            ? isArabic
              ? 'محفوظ في المفضلة'
              : 'Saved in Wishlist'
            : isArabic
            ? 'أضف للمفضلة'
            : 'Add to Wishlist'}
        </button>
      </div>

      {/* Safety Guarantee */}
      <div className="pt-2 text-center space-y-1">
        <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          {isArabic ? 'إلغاء مجاني حتى 24 ساعة قبل الرحلة' : 'Free Cancellation up to 24 hours'}
        </span>
        <span className="text-[10px] text-slate-400 block">
          {isArabic
            ? 'تأكيد فوري للفوچر عبر البريد والواتساب'
            : 'Instant Email & WhatsApp Voucher Confirmation'}
        </span>
      </div>

    </div>
  )
}
