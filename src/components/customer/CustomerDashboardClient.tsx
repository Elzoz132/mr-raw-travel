'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useStore'
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
  ShieldCheck
} from 'lucide-react'

export const CustomerDashboardClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'
  const user = (useAppStore as any)().user || { name: 'VIP Traveler', email: 'customer@mrrawtravel.com' }

  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'reviews' | 'wishlist' | 'vouchers'>('bookings')
  const [bookings, setBookings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null)

  useEffect(() => {
    // Fetch Customer Bookings & Reviews
    Promise.all([
      fetch('/api/bookings').then((res) => res.json()).catch(() => ({ bookings: [] })),
      fetch('/api/reviews').then((res) => res.json()).catch(() => ({ reviews: [] }))
    ]).then(([bData, rData]) => {
      if (bData.bookings) setBookings(bData.bookings)
      if (rData.reviews) setReviews(rData.reviews)
      setLoading(false)
    })
  }, [])

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  const totalTripsCount = bookings.length

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
              Verified VIP Traveler
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isArabic ? `أهلاً بك، ${user?.name || 'المسافر'}` : `Welcome back, ${user?.name || 'VIP Traveler'}`}
            </h1>
            <p className="text-xs text-slate-300">
              {user?.email || 'customer@mrrawtravel.com'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 sm:gap-6 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs">
          <div className="text-center px-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{isArabic ? 'إجمالي الرحلات' : 'Total Trips'}</span>
            <span className="text-2xl font-black text-[#D4AF37]">{totalTripsCount}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center px-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{isArabic ? 'نقاط الولاء' : 'Loyalty Points'}</span>
            <span className="text-2xl font-black text-emerald-400">1,250 PTS</span>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto glass-panel p-2 rounded-2xl border border-white/10 text-xs font-bold">
        {[
          { key: 'bookings', labelEn: 'My Bookings', labelAr: 'حجوزاتي', icon: Calendar },
          { key: 'vouchers', labelEn: 'Trip Vouchers', labelAr: 'فواتير وتذاكر الرحلات', icon: QrCode },
          { key: 'reviews', labelEn: 'My Reviews', labelAr: 'تقييماتي الموثقة', icon: Star },
          { key: 'wishlist', labelEn: 'Saved Excursions', labelAr: 'المفضلة', icon: Heart },
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 max-w-xl space-y-4 text-xs">
          <h3 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
            Personal Information & Preferences
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <input type="text" defaultValue={user?.name || ''} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Email Address</label>
              <input type="email" defaultValue={user?.email || ''} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Phone Number (WhatsApp)</label>
              <input type="text" defaultValue="01070657476" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white" />
            </div>
            <button className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17]">
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* Voucher Modal Preview */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-[#D4AF37] shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">OFFICIAL TRIP VOUCHER</span>
              <h3 className="text-xl font-black text-white">{selectedVoucher.tripTitle || 'VIP Hurghada Cruise'}</h3>
              <p className="text-xs text-slate-300">Present this QR voucher code to your driver or boat captain.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VOUCHER-${selectedVoucher.id}`} alt="QR Code" className="w-36 h-36 mx-auto" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={() => window.print()} className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17]">
                Print Voucher
              </button>
              <button onClick={() => setSelectedVoucher(null)} className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
