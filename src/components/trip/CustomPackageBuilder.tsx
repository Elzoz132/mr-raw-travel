'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Sparkles, Check, Plus, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react'

interface AddonItem {
  id: string
  nameEn: string
  nameAr: string
  nameDe?: string
  descEn?: string
  descAr?: string
  category: string
  priceEgp: number
  priceUsd: number
  priceEur: number
  icon?: string
  isCustomable: boolean
}

export const CustomPackageBuilder: React.FC = () => {
  const router = useRouter()
  const { language, currency, updateBookingDraft } = useAppStore()
  const isArabic = language === 'ar'

  const [availableItems, setAvailableItems] = useState<AddonItem[]>([])
  const [selectedItems, setSelectedItems] = useState<AddonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/addons')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.addons) {
          setAvailableItems(data.addons.filter((a: AddonItem) => a.isCustomable))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleItem = (item: AddonItem) => {
    setErrorMsg('')
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }

  const getItemPrice = (item: AddonItem) => {
    switch (currency) {
      case 'EUR':
        return item.priceEur || Math.round(item.priceEgp / 52)
      case 'USD':
        return item.priceUsd || Math.round(item.priceEgp / 48)
      case 'EGP':
      default:
        return item.priceEgp
    }
  }

  const totalPerPerson = selectedItems.reduce((acc, curr) => acc + getItemPrice(curr), 0)

  const handleProceedToBooking = () => {
    if (selectedItems.length < 4) {
      setErrorMsg(
        isArabic
          ? 'يجب اختيار ٤ عناصر على الأقل لبناء باقتك المخصصة!'
          : 'You must select at least 4 items to create your custom package!'
      )
      return
    }

    updateBookingDraft({
      tripTitle: isArabic ? 'باقتي المخصصة (Custom VIP Package)' : 'Custom VIP Package',
      packageNameAr: `باقتي المخصصة (${selectedItems.length} أنشطة)`,
      packageNameEn: `Custom VIP Package (${selectedItems.length} Activities)`,
      isCustomPackage: true,
      priceAdultEgp: selectedItems.reduce((acc, i) => acc + i.priceEgp, 0),
      priceAdultUsd: selectedItems.reduce((acc, i) => acc + (i.priceUsd || Math.round(i.priceEgp / 48)), 0),
      priceAdultEur: selectedItems.reduce((acc, i) => acc + (i.priceEur || Math.round(i.priceEgp / 52)), 0),
      priceChildEgp: Math.round(selectedItems.reduce((acc, i) => acc + i.priceEgp, 0) * 0.6),
      priceChildUsd: Math.round(selectedItems.reduce((acc, i) => acc + (i.priceUsd || Math.round(i.priceEgp / 48)), 0) * 0.6),
      priceChildEur: Math.round(selectedItems.reduce((acc, i) => acc + (i.priceEur || Math.round(i.priceEgp / 52)), 0) * 0.6),
      selectedAddons: selectedItems.map((i) => ({
        id: i.id,
        nameEn: i.nameEn,
        nameAr: i.nameAr,
        priceEgp: i.priceEgp,
        priceUsd: i.priceUsd,
        priceEur: i.priceEur
      })),
      adults: 2,
      children: 0,
      tripDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    })

    router.push('/booking')
  }

  const categoryLabels: Record<string, { ar: string; en: string }> = {
    SAFARI: { ar: 'أنشطة الصحراء والسفاري', en: 'Desert & Safari Activities' },
    WATER_SPORTS: { ar: 'الألعاب المائية والإثارة', en: 'Water Sports & Thrills' },
    YACHT: { ar: 'رحلات اليخت والسنوركلينج', en: 'Yacht & Snorkeling Trips' },
    HORSE: { ar: 'ركوب الخيل', en: 'Horse Riding' },
    GENERAL: { ar: 'خدمات وإضافات عامة', en: 'General Services & Addons' }
  }

  const categories = Array.from(new Set(availableItems.map((i) => i.category)))

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/40 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isArabic ? 'صمم تجربتك الخاصة' : 'DESIGN YOUR OWN EXPERIENCE'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isArabic ? 'اصنع باقتك بنفسك (Custom VIP Package)' : 'Build Your Own Custom VIP Package'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isArabic
              ? 'اختر الأنشطة والتجارب المفضلة لديك (يشترط اختيار ٤ عناصر على الأقل للباقة).'
              : 'Pick your favorite activities and build a custom package (minimum 4 items required).'}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">
            {isArabic ? 'العناصر المختارة' : 'Selected Items'}
          </span>
          <span className={`text-2xl font-black ${selectedItems.length >= 4 ? 'text-emerald-400' : 'text-[#D4AF37]'}`}>
            {selectedItems.length} / 4+
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-bold animate-pulse">
          {isArabic ? 'جاري تحميل الأنشطة المتاحة...' : 'Loading available items...'}
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catItems = availableItems.filter((i) => i.category === cat)
            const label = categoryLabels[cat] || { ar: cat, en: cat }
            return (
              <div key={cat} className="space-y-4">
                <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider border-l-4 border-[#D4AF37] pl-2">
                  {isArabic ? label.ar : label.en}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catItems.map((item) => {
                    const isSelected = selectedItems.some((i) => i.id === item.id)
                    const itemPrice = getItemPrice(item)
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)] scale-[1.02]'
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {isArabic ? item.nameAr : item.nameEn}
                          </h4>
                          <span className="text-sm font-black text-[#D4AF37] block">
                            {formatCurrencyPrice(itemPrice, currency as Currency, language)}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#D4AF37] text-[#0B0F17]'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs text-slate-400 block font-medium">
            {isArabic ? 'تكلفة الباقة المخصصة للفرد:' : 'Custom Package Per Person:'}
          </span>
          <span className="text-3xl font-black text-[#D4AF37]">
            {formatCurrencyPrice(totalPerPerson, currency as Currency, language)}
          </span>
        </div>

        <LuxuryButton
          onClick={handleProceedToBooking}
          disabled={selectedItems.length < 4}
          variant="gold"
          size="lg"
          className="w-full sm:w-auto font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {isArabic
              ? selectedItems.length < 4
                ? `اختر ${4 - selectedItems.length} أنشطة إضافية للحجز`
                : 'حجز الباقة المخصصة الآن'
              : selectedItems.length < 4
              ? `Select ${4 - selectedItems.length} more items`
              : 'Proceed with Custom Package'}
          </span>
          <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
        </LuxuryButton>
      </div>

    </div>
  )
}
