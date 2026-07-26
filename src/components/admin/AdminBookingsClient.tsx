'use client'

import React from 'react'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Printer } from 'lucide-react'

interface AdminBookingsClientProps {
  bookings: Array<{
    id: string
    bookingNumber: string
    leadPassengerName: string
    leadPhone: string
    leadEmail: string
    hotelName: string
    roomNumber?: string | null
    tripDate: string | Date
    paymentMethod: string
    paymentStatus: string
    totalPrice: number
    currency: string
    qrToken: string
    trip?: { titleEn: string; titleAr?: string } | null
  }>
}

export const AdminBookingsClient: React.FC<AdminBookingsClientProps> = ({ bookings }) => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Header Navbar */}
      <AdminHeader />

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            {isArabic ? 'إدارة العمليات وتوزيع السيارات' : 'BOOKING MANAGEMENT & DISPATCH'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'إدارة وتفاصيل حجوزات الرحلات' : 'Excursion Booking Operations'}
          </h1>
        </div>

        <a
          href="/api/export?type=bookings"
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-bold text-xs hover:bg-[#E5C158]"
        >
          {isArabic ? 'تصدير بيانات الحجوزات Excel' : 'Download CSV Export'}
        </a>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <th className="pb-3">{isArabic ? 'رقم الحجز' : 'Ref'}</th>
                <th className="pb-3">{isArabic ? 'المسافر الرئيسي' : 'Lead Passenger'}</th>
                <th className="pb-3">{isArabic ? 'الفندق والغرفة' : 'Hotel & Room'}</th>
                <th className="pb-3">{isArabic ? 'الرحلة والتاريخ' : 'Excursion & Date'}</th>
                <th className="pb-3">{isArabic ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="pb-3">{isArabic ? 'الإجمالي' : 'Total'}</th>
                <th className="pb-3">{isArabic ? 'رمز الـ QR' : 'Voucher QR'}</th>
                <th className="pb-3">{isArabic ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((b) => {
                const tripTitle = isArabic ? (b.trip?.titleAr || b.trip?.titleEn) : b.trip?.titleEn
                return (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono font-bold text-[#D4AF37]">{b.bookingNumber}</td>
                    <td className="py-4">
                      <span className="font-bold text-white block">{b.leadPassengerName}</span>
                      <span className="text-[10px] text-slate-400 block">{b.leadPhone}</span>
                      <span className="text-[10px] text-slate-400 block">{b.leadEmail}</span>
                    </td>
                    <td className="py-4 text-slate-300">
                      <span className="font-semibold text-white block">{b.hotelName}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {isArabic ? `غرفة: ${b.roomNumber || 'غير محدد'}` : `Room: ${b.roomNumber || 'N/A'}`}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-white block truncate max-w-xs">{tripTitle}</span>
                      <span className="text-[10px] text-[#D4AF37] block">{new Date(b.tripDate).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-slate-200 block">{b.paymentMethod}</span>
                      <span className={`text-[10px] font-bold block ${
                        b.paymentStatus === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {b.paymentStatus === 'APPROVED' ? (isArabic ? 'تمت الموافقة' : 'APPROVED') : (isArabic ? 'قيد المراجعة' : 'PENDING')}
                      </span>
                    </td>
                    <td className="py-4 font-black text-[#D4AF37]">
                      {formatCurrencyPrice(b.totalPrice, (b.currency as Currency) || 'USD', language)}
                    </td>
                    <td className="py-4 font-mono text-[10px] text-slate-400">
                      {b.qrToken?.slice(0, 14)}...
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/booking/confirmation?id=${b.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-[#D4AF37] hover:bg-white/10"
                          title={isArabic ? 'عرض وتأكيد الفوچر' : 'View / Print Voucher'}
                        >
                          <Printer className="w-4 h-4" />
                        </a>
                      </div>
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
