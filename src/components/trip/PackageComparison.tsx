'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { Check, X, Crown, Sparkles } from 'lucide-react'

export interface PackageData {
  id: string
  tripId: string
  nameEn: string
  nameAr: string
  nameDe: string
  descEn?: string | null
  descAr?: string | null
  descDe?: string | null
  priceAdultUsd: number
  priceChildUsd: number
  priceAdultEur: number
  priceChildEur: number
  priceAdultEgp: number
  priceChildEgp: number
  priceAdultGbp?: number
  priceChildGbp?: number
  oldPriceAdultUsd?: number | null
  oldPriceAdultEur?: number | null
  oldPriceAdultEgp?: number | null
  oldPriceAdultGbp?: number | null
  discountPercent: number
  currency: string
  includedEn?: string | null
  includedAr?: string | null
  includedDe?: string | null
  excludedEn?: string | null
  excludedAr?: string | null
  excludedDe?: string | null
  duration?: string | null
  capacity: number
  photos?: string | null
  video?: string | null
  badge?: string | null
  isPopular: boolean
  isRecommended: boolean
  isBestSeller: boolean
  order: number
  status: string
}

interface PackageComparisonProps {
  packages: PackageData[]
  selectedPackageId: string | null
  onSelectPackage: (pkg: PackageData) => void
}

export const PackageComparison: React.FC<PackageComparisonProps> = ({
  packages,
  selectedPackageId,
  onSelectPackage
}) => {
  const { language, currency } = useAppStore()
  const isArabic = language === 'ar'
  const isGerman = language === 'de'
  const [activeTab, setActiveTab] = useState<'cards' | 'table'>('cards')

  if (!packages || packages.length === 0) return null

  const getPackagePrice = (pkg: PackageData, isChild = false) => {
    switch (currency) {
      case 'EUR':
        return isChild ? pkg.priceChildEur : pkg.priceAdultEur
      case 'EGP':
        return isChild ? pkg.priceChildEgp : pkg.priceAdultEgp
      case 'GBP':
        return isChild ? (pkg.priceChildGbp || pkg.priceChildUsd) : (pkg.priceAdultGbp || pkg.priceAdultUsd)
      case 'USD':
      default:
        return isChild ? pkg.priceChildUsd : pkg.priceAdultUsd
    }
  }

  const getOldPackagePrice = (pkg: PackageData) => {
    switch (currency) {
      case 'EUR':
        return pkg.oldPriceAdultEur
      case 'EGP':
        return pkg.oldPriceAdultEgp
      case 'GBP':
        return pkg.oldPriceAdultGbp
      default:
        return pkg.oldPriceAdultUsd
    }
  }

  const getPackageName = (pkg: PackageData) =>
    isArabic ? pkg.nameAr : isGerman ? pkg.nameDe : pkg.nameEn

  const getPackageDesc = (pkg: PackageData) =>
    isArabic ? pkg.descAr : isGerman ? pkg.descDe : pkg.descEn

  const getIncludedList = (pkg: PackageData): string[] => {
    const raw = isArabic ? pkg.includedAr : isGerman ? pkg.includedDe : pkg.includedEn
    if (!raw) return []
    try {
      return JSON.parse(raw)
    } catch {
      return [raw]
    }
  }

  const getExcludedList = (pkg: PackageData): string[] => {
    const raw = isArabic ? pkg.excludedAr : isGerman ? pkg.excludedDe : pkg.excludedEn
    if (!raw) return []
    try {
      return JSON.parse(raw)
    } catch {
      return [raw]
    }
  }

  return (
    <div className="space-y-8 glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-2xl">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isArabic ? 'اختر باقة التميز المناسبة لك' : 'Select Your Desired Package'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isArabic ? 'باقات الرحلة ومقارنة المزايا' : 'Available Trip Packages & Feature Matrix'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isArabic ? 'جميع الباقات تشمل الانتقالات والتأمين وخدمة العملاء على مدار الساعة' : 'All packages include transfers, insurance, and 24/7 dedicated support.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cards' ? 'bg-[#D4AF37] text-[#0B0F17] shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isArabic ? 'بطاقات الباقات' : 'Package Cards'}
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'table' ? 'bg-[#D4AF37] text-[#0B0F17] shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isArabic ? 'جدول المقارنة' : 'Comparison Table'}
          </button>
        </div>
      </div>

      {/* View Mode 1: Package Cards */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id
            const priceAdult = getPackagePrice(pkg, false)
            const priceChild = getPackagePrice(pkg, true)
            const oldPrice = getOldPackagePrice(pkg)
            const included = getIncludedList(pkg)
            const excluded = getExcludedList(pkg)

            return (
              <div
                key={pkg.id}
                onClick={() => onSelectPackage(pkg)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#D4AF37]/20 to-[#0B0F17] border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.3)] scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10'
                }`}
              >
                {/* Badges */}
                <div className="absolute -top-3 left-4 flex flex-wrap gap-1">
                  {pkg.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0B0F17] text-[10px] font-black uppercase tracking-wider shadow">
                      {pkg.badge}
                    </span>
                  )}
                  {pkg.isBestSeller && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
                      {isArabic ? 'الأكثر مبيعاً' : 'Best Seller'}
                    </span>
                  )}
                  {pkg.isRecommended && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                      {isArabic ? 'موصى به' : 'Recommended'}
                    </span>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  {/* Name & Desc */}
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center justify-between">
                      <span>{getPackageName(pkg)}</span>
                      {isSelected && <Crown className="w-5 h-5 text-[#D4AF37]" />}
                    </h3>
                    {getPackageDesc(pkg) && (
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {getPackageDesc(pkg)}
                      </p>
                    )}
                  </div>

                  {/* Pricing Display */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#D4AF37]">
                        {formatCurrencyPrice(priceAdult, currency as Currency, language)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">/ {isArabic ? 'بالغ' : 'Adult'}</span>
                      {oldPrice && oldPrice > priceAdult && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatCurrencyPrice(oldPrice, currency as Currency, language)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 flex items-center justify-between">
                      <span>{isArabic ? 'سعر الطفل:' : 'Child Price:'}</span>
                      <span className="font-bold text-white">
                        {formatCurrencyPrice(priceChild, currency as Currency, language)}
                      </span>
                    </div>
                  </div>

                  {/* Included Highlights */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      {isArabic ? 'المزايا المشمولة:' : 'Included Privileges:'}
                    </span>
                    <ul className="space-y-1.5 text-slate-300">
                      {included.slice(0, 5).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                      {excluded.slice(0, 2).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-500 line-through">
                          <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Selection Action Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectPackage(pkg)
                    }}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'gold-gradient-btn text-[#0B0F17] shadow-lg shadow-[#D4AF37]/30'
                        : 'bg-white/10 text-white hover:bg-[#D4AF37] hover:text-[#0B0F17]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        {isArabic ? 'الباقة المختارة' : 'Selected Package'}
                      </>
                    ) : (
                      <>
                        {isArabic ? 'اختيار هذه الباقة' : 'Select Package'}
                      </>
                    )}
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* View Mode 2: Detailed Comparison Table */}
      {activeTab === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="bg-black/60 border-b border-white/10 text-white font-bold">
                <th className="p-4 min-w-[180px]">{isArabic ? 'اسم الميزة / الباقة' : 'Feature / Package'}</th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-4 text-center min-w-[200px] border-l border-white/10">
                    <div className="font-extrabold text-sm text-[#D4AF37]">{getPackageName(pkg)}</div>
                    <div className="text-base font-black text-white mt-1">
                      {formatCurrencyPrice(getPackagePrice(pkg, false), currency as Currency, language)}
                    </div>
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className={`mt-2 w-full py-1.5 rounded-lg text-[11px] font-bold uppercase transition ${
                        selectedPackageId === pkg.id
                          ? 'bg-[#D4AF37] text-[#0B0F17]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {selectedPackageId === pkg.id ? (isArabic ? 'محددة' : 'Selected') : (isArabic ? 'اختر' : 'Choose')}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-4 font-semibold text-white">{isArabic ? 'سعر الأطفال' : 'Child Price'}</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center border-l border-white/10 font-bold text-slate-200">
                    {formatCurrencyPrice(getPackagePrice(pkg, true), currency as Currency, language)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">{isArabic ? 'مدة الرحلة' : 'Duration'}</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center border-l border-white/10">
                    {pkg.duration || (isArabic ? 'يوم كامل' : 'Full Day')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">{isArabic ? 'المقاعد المتاحة' : 'Capacity'}</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center border-l border-white/10">
                    {pkg.capacity} {isArabic ? 'مقعد' : 'Guests'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">{isArabic ? 'المزايا المشمولة' : 'Included Features'}</td>
                {packages.map((pkg) => {
                  const inc = getIncludedList(pkg)
                  return (
                    <td key={pkg.id} className="p-4 text-left border-l border-white/10 align-top">
                      <ul className="space-y-1">
                        {inc.map((item, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-slate-200">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
