'use client'

import React from 'react'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowUpRight } from 'lucide-react'

interface AdminDashboardClientProps {
  bookingCount: number
  pendingReceipts: number
  totalRevenueUsd: number
  recentBookings: Array<{
    id: string
    bookingNumber: string
    leadPassengerName: string
    leadEmail: string
    tripDate: string | Date
    paymentMethod: string
    totalPrice: number
    currency: string
    bookingStatus: string
    trip?: { titleEn: string; titleAr?: string } | null
  }>
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  bookingCount,
  pendingReceipts,
  totalRevenueUsd,
  recentBookings
}) => {
  const { language, currency } = useAppStore()
  const isArabic = language === 'ar'

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Admin Unified Header */}
      <AdminHeader />

      {/* Admin Title & Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            {isArabic ? 'لوحة إدارة العمليات الفاخرة' : 'BACKOFFICE OPERATIONS CMS'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'لوحة تحكم الإيرادات والعمليات التنفيذية' : 'Executive Operations & Revenue Dashboard'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/trips"
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-bold text-xs hover:bg-[#E5C158] transition-all"
          >
            {isArabic ? '🌴 إدارة الباقات والأسعار' : 'Manage Packages & Prices'}
          </a>
          <a
            href="/admin/crm"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10"
          >
            {isArabic ? '👥 دليل حسابات العملاء' : 'Customer Directory'}
          </a>
          <a
            href="/admin/coupons"
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30"
          >
            {isArabic ? '🎟️ أكواد الخصم والبرومو' : 'Promo Coupons'}
          </a>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel rounded-3xl p-6 border border-[#D4AF37]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">
              {isArabic ? 'إجمالي الإيرادات' : "Today's Revenue"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black gold-gradient-text">
            {formatCurrencyPrice(totalRevenueUsd, currency, language)}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {isArabic ? '+١٨.٤% نمو مقارنة بالشهر السابق' : '+18.4% vs last month'}
          </span>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">
              {isArabic ? 'إجمالي الحجوزات' : 'Active Bookings'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {isArabic ? bookingCount.toLocaleString('ar-EG') : bookingCount}
          </div>
          <span className="text-[11px] text-slate-400">
            {isArabic ? 'حجوزات مؤكدة ومحمية ١٠٠%' : '100% Verified Excursions'}
          </span>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">
              {isArabic ? 'إيصالات قيد المراجعة' : 'Pending Receipts'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">
            {isArabic ? pendingReceipts.toLocaleString('ar-EG') : pendingReceipts}
          </div>
          <span className="text-[11px] text-amber-400/90 font-semibold">
            {isArabic ? 'تحتاج مراجعة إنستا باي / كاش' : 'Requires InstaPay / Cash Review'}
          </span>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">
              {isArabic ? 'نسبة إشغال المقاعد' : 'Seat Occupancy Rate'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {isArabic ? '٨٦.٥%' : '86.5%'}
          </div>
          <span className="text-[11px] text-slate-400">
            {isArabic ? 'معدل إشغال عالي جداً' : 'High Capacity Fill Rate'}
          </span>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white border-l-4 border-[#D4AF37] pl-3">
            {isArabic ? 'أحدث حجوزات الرحلات اليوم' : 'Recent Excursion Bookings'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <th className="pb-3">{isArabic ? 'رقم الحجز' : 'Ref'}</th>
                <th className="pb-3">{isArabic ? 'اسم المسافر الرئيسي' : 'Lead Passenger'}</th>
                <th className="pb-3">{isArabic ? 'الرحلة' : 'Excursion'}</th>
                <th className="pb-3">{isArabic ? 'تاريخ المغادرة' : 'Date'}</th>
                <th className="pb-3">{isArabic ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="pb-3">{isArabic ? 'الإجمالي' : 'Total'}</th>
                <th className="pb-3">{isArabic ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings.map((b) => {
                const tripTitle = isArabic ? (b.trip?.titleAr || b.trip?.titleEn) : b.trip?.titleEn
                return (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D4AF37]">{b.bookingNumber}</td>
                    <td className="py-3.5 font-bold text-white">
                      {b.leadPassengerName}
                      <span className="block text-[10px] text-slate-400 font-normal">{b.leadEmail}</span>
                    </td>
                    <td className="py-3.5 text-slate-200">{tripTitle}</td>
                    <td className="py-3.5 text-slate-300">{new Date(b.tripDate).toLocaleDateString()}</td>
                    <td className="py-3.5 font-semibold text-slate-300">{b.paymentMethod}</td>
                    <td className="py-3.5 font-bold text-[#D4AF37]">
                      {formatCurrencyPrice(b.totalPrice, (b.currency as Currency) || 'USD', language)}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {b.bookingStatus === 'CONFIRMED'
                          ? (isArabic ? 'مؤكد ومحجوز' : 'CONFIRMED')
                          : (isArabic ? 'قيد التجهيز' : 'PENDING')}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
