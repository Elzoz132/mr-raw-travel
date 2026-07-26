'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Users, Mail, Phone, Search, ShieldCheck, Download } from 'lucide-react'

interface AdminCrmClientProps {
  customers: Array<{
    id: string
    segment: string
    bookingCount: number
    totalSpendUsd: number
    tags?: string | null
    createdAt?: string | Date
    user?: {
      id?: string
      name?: string | null
      email: string
      phone?: string | null
      nationality?: string | null
    } | null
  }>
}

export const AdminCrmClient: React.FC<AdminCrmClientProps> = ({ customers }) => {
  const { language, currency } = useAppStore()
  const isArabic = language === 'ar'
  const [query, setQuery] = useState('')

  const filteredCustomers = customers.filter((c) => {
    const q = query.toLowerCase()
    const name = c.user?.name?.toLowerCase() || ''
    const email = c.user?.email?.toLowerCase() || ''
    const phone = c.user?.phone?.toLowerCase() || ''
    return name.includes(q) || email.includes(q) || phone.includes(q)
  })

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Header Navbar */}
      <AdminHeader />

      {/* Title Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            {isArabic ? 'قاعدة بيانات حسابات العملاء' : 'CUSTOMER ACCOUNTS DIRECTORY'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'دليل حسابات العملاء وأرقام التليفونات والإيميلات' : 'Registered Customer Directory & Contact Records'}
          </h1>
        </div>

        <a
          href="/api/export?type=customers"
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-bold text-xs hover:bg-[#E5C158] flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{isArabic ? 'تصدير قاعدة بيانات العملاء Excel' : 'Export Customer CSV'}</span>
        </a>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder={isArabic ? 'البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف...' : 'Search by name, email, or phone number...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <th className="pb-3">{isArabic ? 'اسم العميل' : 'Customer Name'}</th>
                <th className="pb-3">{isArabic ? 'البريد الإلكتروني (الإيميل)' : 'Email Address'}</th>
                <th className="pb-3">{isArabic ? 'رقم التليفون / الواتساب' : 'Phone Number'}</th>
                <th className="pb-3">{isArabic ? 'الجنسية' : 'Nationality'}</th>
                <th className="pb-3">{isArabic ? 'تصنيف العميل' : 'Segment'}</th>
                <th className="pb-3">{isArabic ? 'عدد الحجوزات' : 'Bookings'}</th>
                <th className="pb-3">{isArabic ? 'إجمالي الإنفاق (LTV)' : 'Total Spend'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map((c) => {
                const segmentLabel = c.segment === 'VIP' ? (isArabic ? 'عميل VIP 👑' : 'VIP') : c.segment === 'GOLD' ? (isArabic ? 'عميل ذهبي ⭐️' : 'GOLD') : (isArabic ? 'عميل أساسي' : 'STANDARD')

                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <span className="font-bold text-white block text-sm">{c.user?.name || (isArabic ? 'عميل مسجل' : 'Registered Customer')}</span>
                      <span className="text-[10px] font-mono text-[#D4AF37] block">ID: {c.user?.id?.slice(0, 12) || c.id.slice(0, 12)}</span>
                    </td>
                    <td className="py-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{c.user?.email}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono font-bold text-emerald-400">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{c.user?.phone || (isArabic ? 'غير مسجل' : 'N/A')}</span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-300">
                      {c.user?.nationality || (isArabic ? 'مصر / ألمانيا' : 'Egypt / Germany')}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        c.segment === 'VIP'
                          ? 'bg-[#D4AF37] text-[#0B0F17]'
                          : c.segment === 'GOLD'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {segmentLabel}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-white">
                      {isArabic ? c.bookingCount.toLocaleString('ar-EG') : c.bookingCount}
                    </td>
                    <td className="py-4 font-black text-[#D4AF37]">
                      {formatCurrencyPrice(c.totalSpendUsd, currency, language)}
                    </td>
                  </tr>
                )
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    {isArabic ? 'لا يوجد حسابات عملاء تطابق عملية البحث.' : 'No customer accounts matching your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
