'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useStore'
import { PrintableVoucherModal } from '@/components/common/PrintableVoucherModal'
import { CustomerProfileSettings } from '@/components/customer/CustomerProfileSettings'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Download,
  Star,
  User,
  CreditCard,
  Heart,
  Tag,
  Bell,
  CheckCircle,
  QrCode,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Copy,
  Trash2
} from 'lucide-react'

export const CustomerDashboardClient: React.FC = () => {
  const { language, wishlist, toggleWishlist } = useAppStore()
  const isArabic = language === 'ar'
  const user = (useAppStore as any)().user || { name: 'VIP Traveler', email: 'customer@mrrawtravel.com' }

  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'reviews' | 'wishlist' | 'vouchers'>('bookings')
  const [bookings, setBookings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [savedTrips, setSavedTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null)
  const [copiedPromo, setCopiedPromo] = useState(false)

  useEffect(() => {
    // Fetch Customer Bookings & Reviews
    Promise.all([
      fetch('/api/bookings').then((res) => res.json()).catch(() => ({ bookings: [] })),
      fetch('/api/reviews').then((res) => res.json()).catch(() => ({ reviews: [] })),
      fetch('/api/admin/trips').then((res) => res.json()).catch(() => ({ trips: [] }))
    ]).then(([bData, rData, tData]) => {
      if (bData.bookings) setBookings(bData.bookings)
      if (rData.reviews) setReviews(rData.reviews)
      if (tData.trips) setSavedTrips(tData.trips.filter((t: any) => wishlist.includes(t.id)))
      setLoading(false)
    })
  }, [wishlist])

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  const totalTripsCount = bookings.length

  const handleCopyPromo = () => {
    navigator.clipboard.writeText('MRRAW-VIP10')
    setCopiedPromo(true)
    setTimeout(() => setCopiedPromo(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gold-gradient-btn flex items-center justify-center text-[#0B0F17] font-black text-2xl shadow-xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'VIP'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>👑 Verified VIP Traveler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isArabic ? `أهلاً بك، ${user?.name || 'المسافر الملكي'}` : `Welcome back, ${user?.name || 'VIP Traveler'}`}
            </h1>
            <p className="text-xs text-slate-300">
              {user?.email || 'customer@mrrawtravel.com'}
            </p>
          </div>
        </div>

        {/* Quick Stats & VIP Loyalty Badge */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs">
          <div className="text-center px-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{isArabic ? 'إجمالي الرحلات' : 'Total Trips'}</span>
            <span className="text-2xl font-black text-[#D4AF37]">{totalTripsCount}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center px-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{isArabic ? 'نقاط الولاء الملكية' : 'Loyalty Points'}</span>
            <span className="text-2xl font-black text-emerald-400">1,250 PTS</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/10 border border-[#D4AF37]/40 text-right space-y-1">
            <span className="text-[10px] font-bold text-[#D4AF37] block">👑 كود خصمك الملكي التلقائي (10% OFF)</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-white bg-black/50 px-2 py-0.5 rounded border border-[#D4AF37]/40">MRRAW-VIP10</span>
              <button
                onClick={handleCopyPromo}
                className="p-1 rounded bg-[#D4AF37] text-[#0B0F17] hover:bg-white transition text-[10px] font-bold flex items-center gap-1"
                title="نسخ كود الخصم"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedPromo ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto glass-panel p-2 rounded-2xl border border-white/10 text-xs font-bold">
        {[
          { key: 'bookings', labelEn: 'My Bookings', labelAr: 'حجوزاتي', icon: Calendar },
          { key: 'vouchers', labelEn: 'Trip Vouchers', labelAr: 'فواتير وتذاكر الرحلات', icon: QrCode },
          { key: 'wishlist', labelEn: 'Saved Excursions', labelAr: 'المفضلة والرحلات المحفوظة', icon: Heart },
          { key: 'profile', labelEn: 'Account Profile', labelAr: 'البيانات الشخصية', icon: User }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#D4AF37] text-[#0B0F17] shadow-lg font-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#D4AF37]" />
            <span>{isArabic ? 'سجل الحجوزات القادمة والسابقة' : 'Excursion Booking History'}</span>
          </h3>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-white/10">
              <p className="text-xs text-slate-400">You have no upcoming or past excursion bookings yet.</p>
              <a href="/trips" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17]">
                <span>Explore Excursions</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px]">
                      CONFIRMATION #{b.bookingNumber || b.id.slice(0, 8)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      {b.status || 'CONFIRMED'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{b.tripTitle || 'Hurghada Red Sea VIP Trip'}</h4>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Date: <strong>{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'Upcoming'}</strong></span>
                    <span>Guests: <strong>{b.adults} Adults, {b.children} Children</strong></span>
                    <span>Total: <strong className="text-[#D4AF37]">${b.totalAmount}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVoucher(b)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0B0F17] font-bold text-xs transition flex items-center gap-2 self-start md:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Voucher PDF</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#D4AF37]" />
            <span>{isArabic ? 'تذاكر وفواتير الرحلات المعتمدة' : 'Official Trip Ticket Vouchers'}</span>
          </h3>

          {bookings.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-white/10">
              <p className="text-xs text-slate-400">لا يوجد تذاكر رحلات متاحة حالياً. قم بحجز رحلتك الأولى لاستخراج الفوچر فوراً.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="glass-panel rounded-2xl p-5 border border-[#D4AF37]/30 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px]">
                    OFFICIAL VOUCHER #{b.bookingNumber || b.id.slice(0, 8)}
                  </span>
                  <h4 className="text-base font-bold text-white">{b.tripTitle || 'VIP Hurghada Trip'}</h4>
                  <p className="text-slate-400 text-[11px]">قدّم رمز الـ QR للسائق عند الاستقبال من الفندق.</p>
                </div>
                <button
                  onClick={() => setSelectedVoucher(b)}
                  className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17] flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>عرض وطباعة التذكرة PDF</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Wishlist Saved Trips Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>{isArabic ? 'رحلاتك المفضلة والمحفوظة' : 'My Saved Wishlist Excursions'}</span>
          </h3>

          {wishlist.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-white/10">
              <p className="text-xs text-slate-400">لم تقم بحفظ أي رحلات في المفضلة بعد. اضغط على رمز القلب (❤️) على أي رحلة لحفظها هنا.</p>
              <a href="/trips" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17]">
                <span>تصفح كل الرحلات</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((tripId) => {
                const tripData = savedTrips.find((t) => t.id === tripId) || {
                  id: tripId,
                  titleAr: 'رحلة بحرية فاخرة الغردقة',
                  titleEn: 'Hurghada Luxury Excursion',
                  coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
                  priceAdultEgp: 2200,
                  priceAdultUsd: 45
                }
                return (
                  <div key={tripId} className="glass-panel rounded-2xl overflow-hidden border border-white/10 space-y-3 p-4 flex flex-col justify-between">
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <img src={tripData.coverImage} alt={tripData.titleAr} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleWishlist(tripId)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white shadow-lg"
                        title="إزالة من المفضلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{isArabic ? tripData.titleAr : tripData.titleEn}</h4>
                      <span className="text-[#D4AF37] font-black text-xs block mt-1">
                        {tripData.priceAdultEgp ? `${tripData.priceAdultEgp} ج.م` : `$${tripData.priceAdultUsd}`} / شخص
                      </span>
                    </div>

                    <a
                      href={`/trips/${tripData.slug || tripId}`}
                      className="w-full py-2 rounded-xl gold-gradient-btn text-center text-xs font-black text-[#0B0F17] block"
                    >
                      تفاصيل وحجز الرحلة
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <CustomerProfileSettings />
      )}

      {/* Voucher Modal Preview */}
      {selectedVoucher && (
        <PrintableVoucherModal
          voucher={{
            bookingNumber: selectedVoucher.bookingNumber || selectedVoucher.id.slice(0, 8),
            leadPassengerName: user?.name || selectedVoucher.leadPassengerName || 'Guest Traveler',
            leadPhone: selectedVoucher.leadPhone || user?.phone,
            leadEmail: selectedVoucher.leadEmail || user?.email,
            tripTitle: selectedVoucher.tripTitle || selectedVoucher.name || 'Hurghada Red Sea VIP Trip',
            tripDate: selectedVoucher.travelDate || selectedVoucher.tripDate,
            pickupLocation: selectedVoucher.pickupLocation || selectedVoucher.hotelName,
            hotelName: selectedVoucher.hotelName,
            adults: selectedVoucher.adults || 1,
            children: selectedVoucher.children || 0,
            totalPrice: selectedVoucher.totalAmount || selectedVoucher.totalPrice || 0,
            currency: selectedVoucher.currency || 'USD',
            paymentMethod: selectedVoucher.paymentMethod || 'CASH',
            bookingStatus: selectedVoucher.status || selectedVoucher.bookingStatus || 'CONFIRMED',
            qrToken: selectedVoucher.qrToken
          }}
          onClose={() => setSelectedVoucher(null)}
        />
      )}

    </div>
  )
}

