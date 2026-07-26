'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { formatCurrencyPrice, Currency } from '@/lib/currency'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Plus, Edit3, Trash2 } from 'lucide-react'

interface TripItem {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  descEn: string
  descAr: string
  coverImage: string
  priceAdultUsd: number
  priceChildUsd: number
  priceAdultEur: number
  priceChildEur: number
  priceAdultEgp: number
  priceChildEgp: number
  duration: string
  location: string
  maxSeats: number
  includedEn?: string
  includedAr?: string
  excludedEn?: string
  excludedAr?: string
  itineraryEn?: string
  itineraryAr?: string
}

interface AdminTripsClientProps {
  initialTrips: TripItem[]
}

export const AdminTripsClient: React.FC<AdminTripsClientProps> = ({ initialTrips }) => {
  const { language, currency } = useAppStore()
  const isArabic = language === 'ar'

  const [trips, setTrips] = useState<TripItem[]>(initialTrips)
  const [editingTrip, setEditingTrip] = useState<TripItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState<Partial<TripItem>>({
    titleEn: '',
    titleAr: '',
    descEn: '',
    descAr: '',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    priceAdultUsd: 45,
    priceChildUsd: 25,
    priceAdultEur: 42,
    priceChildEur: 23,
    priceAdultEgp: 2200,
    priceChildEgp: 1200,
    duration: '6 Hours',
    location: 'Hurghada',
    maxSeats: 30,
    includedEn: '["VIP Hotel Transfers", "Lunch Buffet", "Snorkeling Equipment"]',
    includedAr: '["انتقالات الفندق VIP", "بوفيه غداء مأكولات بحرية", "معدات السنوركلنج"]',
    excludedEn: '["Personal Expenses", "Tips / Gratuities"]',
    excludedAr: '["المصاريف الشخصية", "الإكراميات"]',
    itineraryEn: '[{"time":"08:00 AM","title":"Hotel Pickup","desc":"Transfer in VIP AC Bus"},{"time":"09:00 AM","title":"Snorkeling","desc":"First stop at Coral Reefs"}]',
    itineraryAr: '[{"time":"08:00 ص","title":"التحرك من الفندق","desc":"الانتقال بالباص الفاخر"},{"time":"09:00 ص","title":"السنوركلنج","desc":"الوقفة الأولى للشعاب المرجانية"}]'
  })

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const openCreateModal = () => {
    setEditingTrip(null)
    setIsCreating(true)
    setFormData({
      titleEn: '',
      titleAr: '',
      descEn: '',
      descAr: '',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      priceAdultUsd: 45,
      priceChildUsd: 25,
      priceAdultEur: 42,
      priceChildEur: 23,
      priceAdultEgp: 2200,
      priceChildEgp: 1200,
      duration: '6 Hours',
      location: 'Hurghada',
      maxSeats: 30,
      includedEn: '["VIP Hotel Transfers", "Lunch Buffet", "Snorkeling Equipment"]',
      includedAr: '["انتقالات الفندق VIP", "بوفيه غداء مأكولات بحرية", "معدات السنوركلنج"]',
      excludedEn: '["Personal Expenses", "Tips / Gratuities"]',
      excludedAr: '["المصاريف الشخصية", "الإكراميات"]',
      itineraryEn: '[{"time":"08:00 AM","title":"Hotel Pickup","desc":"Transfer in VIP AC Bus"},{"time":"09:00 AM","title":"Snorkeling","desc":"First stop at Coral Reefs"}]',
      itineraryAr: '[{"time":"08:00 ص","title":"التحرك من الفندق","desc":"الانتقال بالباص الفاخر"},{"time":"09:00 ص","title":"السنوركلنج","desc":"الوقفة الأولى للشعاب المرجانية"}]'
    })
  }

  const openEditModal = (t: TripItem) => {
    setIsCreating(false)
    setEditingTrip(t)
    setFormData(t)
  }

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const url = '/api/admin/trips'
      const method = isCreating ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isCreating ? formData : { id: editingTrip?.id, ...formData })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save excursion package.')
      }

      if (isCreating) {
        setTrips([data.trip, ...trips])
      } else {
        setTrips(trips.map((t) => (t.id === data.trip.id ? data.trip : t)))
      }

      setIsCreating(false)
      setEditingTrip(null)
      setMsg(isArabic ? 'تم حفظ وتعديل بيانات الرحلة بنجاح!' : 'Excursion package saved successfully!')
    } catch (err: any) {
      setMsg(err.message || 'Error saving trip.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من حذف الرحلة؟' : 'Delete excursion package?')) return

    try {
      const res = await fetch(`/api/admin/trips?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTrips(trips.filter((t) => t.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Header Navbar */}
      <AdminHeader />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            {isArabic ? 'لوحة التعديل على الباقات والرحلات' : 'EXCURSIONS CMS MODULE'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'تعديل وإنشاء باقات وأسعار الرحلات' : 'Excursion Packages & Pricing Manager'}
          </h1>
        </div>

        <LuxuryButton
          onClick={openCreateModal}
          variant="gold"
          size="md"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة باقة رحلة جديدة' : 'Add New Excursion Package'}</span>
        </LuxuryButton>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          {msg}
        </div>
      )}

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((t) => {
          const title = isArabic ? t.titleAr : t.titleEn
          return (
            <div key={t.id} className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10">
              <div className="relative h-48 w-full overflow-hidden">
                <img src={t.coverImage} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-[#0B0F17]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-[#D4AF37]">
                  ${t.priceAdultUsd} / {t.priceAdultEgp} EGP
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{isArabic ? t.descAr : t.descEn}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(t)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#D4AF37] hover:text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تعديل الكامل' : 'Full Edit'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTrip(t.id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit / Create Modal */}
      {(isCreating || editingTrip) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
              {isCreating
                ? isArabic ? 'إضافة باقة رحلة جديدة' : 'Add New Excursion Package'
                : isArabic ? 'تعديل تفاصيل وأسعار الرحلة' : 'Edit Excursion Package'}
            </h3>

            <form onSubmit={handleSaveTrip} className="space-y-4 text-xs">
              
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Trip Title (English) *</label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">عنوان الرحلة (بالعربي) *</label>
                  <input
                    type="text"
                    value={formData.titleAr || ''}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Cover Image URL *</label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Description (English)</label>
                  <textarea
                    rows={3}
                    value={formData.descEn || ''}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">وصف وتفاصيل الرحلة (بالعربي)</label>
                  <textarea
                    rows={3}
                    value={formData.descAr || ''}
                    onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Prices Grid */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="font-bold text-[#D4AF37] uppercase block">Price Breakdown Across Currencies</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block">Adult USD ($)</label>
                    <input
                      type="number"
                      value={formData.priceAdultUsd || 0}
                      onChange={(e) => setFormData({ ...formData, priceAdultUsd: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block">Child USD ($)</label>
                    <input
                      type="number"
                      value={formData.priceChildUsd || 0}
                      onChange={(e) => setFormData({ ...formData, priceChildUsd: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block">Adult EUR (€)</label>
                    <input
                      type="number"
                      value={formData.priceAdultEur || 0}
                      onChange={(e) => setFormData({ ...formData, priceAdultEur: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block">Child EUR (€)</label>
                    <input
                      type="number"
                      value={formData.priceChildEur || 0}
                      onChange={(e) => setFormData({ ...formData, priceChildEur: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block">Adult EGP (ج.م)</label>
                    <input
                      type="number"
                      value={formData.priceAdultEgp || 0}
                      onChange={(e) => setFormData({ ...formData, priceAdultEgp: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block">Child EGP (ج.م)</label>
                    <input
                      type="number"
                      value={formData.priceChildEgp || 0}
                      onChange={(e) => setFormData({ ...formData, priceChildEgp: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">السعر يشمل (JSON Array بالعربي)</label>
                  <textarea
                    rows={2}
                    value={formData.includedAr || ''}
                    onChange={(e) => setFormData({ ...formData, includedAr: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">السعر لا يشمل (JSON Array بالعربي)</label>
                  <textarea
                    rows={2}
                    value={formData.excludedAr || ''}
                    onChange={(e) => setFormData({ ...formData, excludedAr: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <LuxuryButton type="button" onClick={() => { setIsCreating(false); setEditingTrip(null) }} variant="ghost" size="sm">
                  Cancel
                </LuxuryButton>
                <LuxuryButton type="submit" disabled={loading} variant="gold" size="sm">
                  {loading ? 'Saving Package...' : 'Save Excursion Package'}
                </LuxuryButton>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
