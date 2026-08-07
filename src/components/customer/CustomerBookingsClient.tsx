'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useStore'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock3, 
  QrCode, 
  Download, 
  MessageSquare, 
  Upload, 
  RefreshCw, 
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react'
import { uploadMedia } from '@/lib/cloudinary'

interface BookingItem {
  id: string
  bookingNumber: string
  tripDate: string
  adults: number
  children: number
  totalPrice: number
  currency: string
  paymentMethod: string
  paymentStatus: string
  bookingStatus: string
  qrToken: string
  pickupLocation: string
  hotelName: string
  rejectionReason?: string
  cancellationReason?: string
  trip?: {
    id: string
    titleEn: string
    titleAr: string
    coverImage: string
    location: string
  }
  package?: {
    nameEn: string
    nameAr: string
  }
  receipts?: { imageUrl: string; status: string }[]
}

export const CustomerBookingsClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'PENDING' | 'CANCELLED'>('ALL')
  
  // Modals
  const [selectedQr, setSelectedQr] = useState<string | null>(null)
  const [reuploadingBookingId, setReuploadingBookingId] = useState<string | null>(null)
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [reuploadMsg, setReuploadMsg] = useState('')

  const fetchUserBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserBookings()
  }, [])

  const handleReceiptReupload = async (e: React.ChangeEvent<HTMLInputElement>, bookingId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingReceipt(true)
    setReuploadMsg('')

    try {
      // Upload media
      const mediaRes = await uploadMedia(file)
      
      // Post to receipt re-upload API
      const res = await fetch(`/api/customer/bookings/${bookingId}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptUrl: mediaRes.url })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل رفع الإيصال الجديد.')
      }

      setReuploadMsg(data.message)
      setReuploadingBookingId(null)
      await fetchUserBookings()
    } catch (err: any) {
      alert(err.message || 'حدث خطأ في رفع الإيصال.')
    } finally {
      setUploadingReceipt(false)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'UPCOMING') return b.bookingStatus === 'CONFIRMED' && new Date(b.tripDate) >= new Date()
    if (activeFilter === 'COMPLETED') return b.bookingStatus === 'COMPLETED' || (b.bookingStatus === 'CONFIRMED' && new Date(b.tripDate) < new Date())
    if (activeFilter === 'PENDING') return b.bookingStatus === 'PENDING' || b.paymentStatus === 'WAITING_REVIEW' || b.paymentStatus === 'PENDING'
    if (activeFilter === 'CANCELLED') return b.bookingStatus === 'CANCELLED' || b.paymentStatus === 'REJECTED'
    return true
  })

  const getStatusBadge = (bookingStatus: string, paymentStatus: string) => {
    if (bookingStatus === 'CANCELLED') {
      return (
        <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5" />
          <span>{isArabic ? 'ملغي' : 'Cancelled'}</span>
        </span>
      )
    }
    if (paymentStatus === 'REJECTED') {
      return (
        <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isArabic ? 'مرفوض الإيصال' : 'Payment Rejected'}</span>
        </span>
      )
    }
    if (paymentStatus === 'WAITING_REVIEW') {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1">
          <Clock3 className="w-3.5 h-3.5" />
          <span>{isArabic ? 'قيد مراجعة الدفع' : 'Payment Under Review'}</span>
        </span>
      )
    }
    if (bookingStatus === 'CONFIRMED' || paymentStatus === 'PAID') {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isArabic ? 'مؤكد 100%' : 'Confirmed'}</span>
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-400 text-xs font-bold flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" />
        <span>{isArabic ? 'قيد الانتظار' : 'Pending'}</span>
      </span>
    )
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
            {isArabic ? 'لوحة التحكم والمتابعة الملكية' : 'CUSTOMER DASHBOARD'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'رحلاتي وحجوزاتي التلقائية' : 'My Trips & Bookings'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'تظهر جميع رحلاتك وحجوزاتك السابقة والقادمة تلقائياً هنا بمجرد تسجيل دخولك.'
              : 'All your booked excursions appear here automatically once signed in.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customer/rewards"
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0F17] text-xs font-bold transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isArabic ? 'جوائزي ونقاط الولاء' : 'My Rewards'}</span>
          </Link>
          <Link
            href="/trips"
            className="px-4 py-2.5 rounded-xl gold-gradient-btn text-[#0B0F17] text-xs font-black transition flex items-center gap-2"
          >
            <span>{isArabic ? '+ حجز رحلة جديدة' : '+ Book New Excursion'}</span>
          </Link>
        </div>
      </div>

      {reuploadMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{reuploadMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 text-xs font-bold">
        <span className="text-slate-500 flex items-center gap-1 pr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>{isArabic ? 'تصفية:' : 'Filter:'}</span>
        </span>
        {[
          { key: 'ALL', labelAr: 'جميع الرحلات', labelEn: 'All Bookings' },
          { key: 'UPCOMING', labelAr: 'الرحلات القادمة', labelEn: 'Upcoming' },
          { key: 'PENDING', labelAr: 'قيد المراجعة والدفع', labelEn: 'Pending & Review' },
          { key: 'COMPLETED', labelAr: 'الرحلات المكتملة', labelEn: 'Completed' },
          { key: 'CANCELLED', labelAr: 'الملغاة والمرفوضة', labelEn: 'Cancelled & Rejected' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeFilter === tab.key
                ? 'bg-[#D4AF37] text-[#0B0F17] font-extrabold shadow-lg'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {isArabic ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">جاري تحميل رحلاتك...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-16 text-center glass-panel rounded-3xl border border-white/10 space-y-4">
          <span className="text-5xl block">⛵</span>
          <h3 className="text-lg font-bold text-white">
            {isArabic ? 'لا يوجد رحلات في هذا القسم حالياً' : 'No bookings found in this category'}
          </h3>
          <p className="text-xs text-slate-400">
            {isArabic ? 'اختر رحلتك القادمة واستمتع بأفضل المعالم والرحلات البحرية في الغردقة!' : 'Explore our top tours in Hurghada!'}
          </p>
          <Link href="/trips" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17]">
            <span>{isArabic ? 'استكشف وحجز رحلتك الأولى الآن' : 'Explore Excursions'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const tripTitle = b.trip ? (isArabic ? b.trip.titleAr : b.trip.titleEn) : 'Mr.Raw Excursion'
            const packageName = b.package ? (isArabic ? b.package.nameAr : b.package.nameEn) : ''
            const coverImage = b.trip?.coverImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'

            const isRejected = b.paymentStatus === 'REJECTED'

            return (
              <div key={b.id} className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/40 transition-all space-y-4">
                
                {/* Rejection Alert Header if rejected */}
                {isRejected && b.rejectionReason && (
                  <div className="bg-rose-500/20 border-b border-rose-500/40 p-4 text-xs text-rose-300 font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      <span>{isArabic ? `سبب رفض الإيصال: (${b.rejectionReason})` : `Receipt Rejected: ${b.rejectionReason}`}</span>
                    </div>
                    
                    <label className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs cursor-pointer hover:bg-rose-600 transition inline-flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingReceipt && reuploadingBookingId === b.id ? 'جاري الرفع...' : 'رفع إيصال جديد معدل'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => { setReuploadingBookingId(b.id); handleReceiptReupload(e, b.id) }}
                        disabled={uploadingReceipt}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                <div className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Trip Image & Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden border border-white/15 flex-shrink-0 bg-black/40 relative">
                      <img src={coverImage} alt={tripTitle} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(b.bookingStatus, b.paymentStatus)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span className="text-[#D4AF37] font-bold">#{b.bookingNumber}</span>
                        <span>•</span>
                        <span>{new Date(b.tripDate).toLocaleDateString('ar-EG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white line-clamp-1">{tripTitle}</h3>
                      {packageName && (
                        <span className="inline-block text-xs text-[#D4AF37] font-bold">
                          باقة: {packageName}
                        </span>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{b.adults} بالغين {b.children > 0 ? `+ ${b.children} أطفال` : ''}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{b.hotelName}</span>
                        </span>
                        <span className="font-bold text-emerald-400">
                          {b.totalPrice} {b.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="w-full lg:w-auto flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    
                    {/* QR Code Button */}
                    <button
                      onClick={() => setSelectedQr(b.qrToken)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <QrCode className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isArabic ? 'رمز QR' : 'QR Code'}</span>
                    </button>

                    {/* Invoice Download */}
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37] text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isArabic ? 'الفاتورة PDF' : 'Invoice'}</span>
                    </button>

                    {/* WhatsApp Support */}
                    <a
                      href={`https://wa.me/201022392428?text=${encodeURIComponent(`مرحباً، أستفسر عن حجز رقم ${b.bookingNumber} للرحلة (${tripTitle})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-black text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                    </a>

                    {/* Re-book Trip */}
                    <Link
                      href={`/trips/${b.trip?.id || ''}`}
                      className="px-3.5 py-2 rounded-xl gold-gradient-btn text-[#0B0F17] text-xs font-extrabold flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'إعادة الحجز' : 'Re-book'}</span>
                    </Link>

                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* QR Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl border border-[#D4AF37]/50 max-w-sm w-full text-center space-y-6">
            <h3 className="text-lg font-bold text-white">رمز الدخول السريع QR Code</h3>
            <div className="p-6 bg-white rounded-2xl inline-block shadow-2xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedQr)}`}
                alt="Booking QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-xs text-slate-300 font-mono">{selectedQr}</p>
            <button
              onClick={() => setSelectedQr(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
