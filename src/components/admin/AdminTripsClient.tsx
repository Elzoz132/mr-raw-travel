'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { uploadMedia } from '@/lib/cloudinary'
import { Plus, Edit3, Trash2, Upload, Sparkles, MapPin, Clock, Eye } from 'lucide-react'

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
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [trips, setTrips] = useState<TripItem[]>(initialTrips)
  const [editingTrip, setEditingTrip] = useState<TripItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [translating, setTranslating] = useState(false)

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
    maxSeats: 30
  })

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleEgpPriceChange = (egp: number) => {
    const usd = Math.round(egp / 48.5)
    const eur = Math.round(usd * 0.92)
    setFormData((prev) => ({
      ...prev,
      priceAdultEgp: egp,
      priceAdultUsd: usd,
      priceAdultEur: eur,
      priceChildEgp: Math.round(egp * 0.5),
      priceChildUsd: Math.round(usd * 0.5),
      priceChildEur: Math.round(eur * 0.5)
    }))
  }

  const handleAutoTranslate = async () => {
    const textToTranslate = formData.titleAr || formData.titleEn || formData.descAr || formData.descEn
    if (!textToTranslate) return
    setTranslating(true)
    try {
      if (formData.titleAr && !formData.titleEn) {
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: formData.titleAr, from: 'ar', to: 'en' })
        })
        const data = await res.json()
        if (data.translated) setFormData((prev) => ({ ...prev, titleEn: data.translated }))
      } else if (formData.titleEn && !formData.titleAr) {
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: formData.titleEn, from: 'en', to: 'ar' })
        })
        const data = await res.json()
        if (data.translated) setFormData((prev) => ({ ...prev, titleAr: data.translated }))
      }

      if (formData.descAr && !formData.descEn) {
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: formData.descAr, from: 'ar', to: 'en' })
        })
        const data = await res.json()
        if (data.translated) setFormData((prev) => ({ ...prev, descEn: data.translated }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTranslating(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadMedia(file)
      setFormData((prev) => ({ ...prev, coverImage: res.url }))
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

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
      maxSeats: 30
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
      setMsg(isArabic ? 'تم حفظ وتحديث الرحلة على الصفحة الرئيسية بنجاح!' : 'Excursion updated on Homepage successfully!')
    } catch (err: any) {
      setMsg(err.message || 'Error saving trip.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من حذف هذه الرحلة من الصفحة الرئيسية؟' : 'Delete excursion from homepage?')) return

    try {
      const res = await fetch(`/api/admin/trips?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTrips(trips.filter((t) => t.id !== id))
        setMsg(isArabic ? 'تم حذف الرحلة بنجاح من الصفحة الرئيسية!' : 'Trip deleted from homepage successfully!')
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
            {isArabic ? 'إدارة رحلات الصفحة الرئيسية والموقع' : 'HOMEPAGE EXCURSIONS CMS'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'رحلات الصفحة الرئيسية (تعديل، إضافة، حذف)' : 'Homepage Excursions Manager'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'من هنا يمكنك إضافة رحلات جديدة تظهر في الصفحة الرئيسية للموقع، تعديل أسعارها بالجنيه والدولار، رفع صورها، أو حذف أي رحلة.'
              : 'Add, edit, or remove excursion packages that appear on the homepage and catalog.'}
          </p>
        </div>

        <LuxuryButton
          onClick={openCreateModal}
          variant="gold"
          size="md"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة رحلة جديدة كارت بالصفحة الرئيسية' : 'Add New Homepage Trip'}</span>
        </LuxuryButton>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          {msg}
        </div>
      )}

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.length === 0 ? (
          <div className="col-span-full p-12 text-center glass-panel rounded-3xl space-y-4">
            <span className="text-4xl block">⛵</span>
            <h3 className="text-lg font-bold text-white">لا يوجد رحلات في الصفحة الرئيسية حالياً</h3>
            <p className="text-xs text-slate-400">اضغط "إضافة رحلة جديدة كارت بالصفحة الرئيسية" لبدء إضافة رحلاتك وأسعارك.</p>
            <button
              onClick={openCreateModal}
              className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black text-[#0B0F17]"
            >
              إضافة أول رحلة الآن
            </button>
          </div>
        ) : (
          trips.map((t) => {
            const title = isArabic ? t.titleAr : t.titleEn
            return (
              <div key={t.id} className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 group hover:border-[#D4AF37]/40 transition-all">
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={t.coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-[#0B0F17]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/40 text-xs font-black text-[#D4AF37]">
                    {t.priceAdultEgp ? `${t.priceAdultEgp} ج.م` : `$${t.priceAdultUsd}`} / شخص
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#0B0F17]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{t.duration || '4 Hours'}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{isArabic ? t.descAr : t.descEn}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => openEditModal(t)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#D4AF37] hover:text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'تعديل الرحلة' : 'Edit Trip'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTrip(t.id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition"
                      title="حذف الرحلة من الصفحة الرئيسية"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Edit / Create Modal */}
      {(isCreating || editingTrip) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
                {isCreating
                  ? isArabic ? 'إضافة رحلة جديدة بالصفحة الرئيسية' : 'Add New Homepage Trip'
                  : isArabic ? 'تعديل بيانات وأسعار الرحلة بالصفحة الرئيسية' : 'Edit Homepage Trip'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingTrip(null) }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4 text-xs">
              
              {/* Titles & Auto-Translate */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">
                    عنوان ومسمى الرحلة (اكتب بأي لغة واضغط ترجمة تلقائية)
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={translating}
                    className="px-3 py-1 rounded-lg bg-[#D4AF37] text-[#0B0F17] font-bold text-xs flex items-center gap-1 hover:bg-[#E5C158] transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{translating ? 'جاري الترجمة...' : '⚡ ترجمة تلقائية'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">اسم الرحلة بالعربي *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: رحلة يخت وسنوركلينج أورانج باي"
                      value={formData.titleAr || ''}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Trip Title (EN) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Orange Bay Yacht & Snorkeling Trip"
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Upload & URL */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">صورة غلاف الرحلة الرئيسي</span>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/15 flex-shrink-0 bg-black/40">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">لا يوجد صورة</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <label className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-600 transition w-full sm:w-auto inline-flex">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'جاري رفع الصورة...' : 'رفع صورة من الجهاز'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                    <input
                      type="text"
                      placeholder="أو ضع رابط الصورة المباشر هنا"
                      value={formData.coverImage || ''}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">وصف الرحلة بالعربي</label>
                  <textarea
                    rows={3}
                    placeholder="اكتب نبذة عن الرحلة وما يميزها..."
                    value={formData.descAr || ''}
                    onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Description (EN)</label>
                  <textarea
                    rows={3}
                    placeholder="Write a brief overview of the excursion..."
                    value={formData.descEn || ''}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
              </div>

              {/* Prices Grid */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider block">أسعار الرحلة (أسعار البالغين والأطفال بالعملات المختلفة)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const adultEgp = formData.priceAdultEgp || 0
                      const adultUsd = formData.priceAdultUsd || Math.round(adultEgp / 48.5)
                      const adultEur = formData.priceAdultEur || Math.round(adultUsd * 0.92)
                      setFormData({
                        ...formData,
                        priceChildEgp: Math.round(adultEgp * 0.5),
                        priceChildUsd: Math.round(adultUsd * 0.5),
                        priceChildEur: Math.round(adultEur * 0.5)
                      })
                    }}
                    className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0F17] text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>⚡ احتساب سعر الأطفال تلقائياً (50%)</span>
                  </button>
                </div>
                
                {/* Adult Prices Section */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1">
                    <span>👨‍👩‍👦 أسعار البالغين (Adult Prices):</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[#D4AF37] font-bold block mb-1 text-xs">سعر البالغ بالجنيه (EGP) *</label>
                      <input
                        type="number"
                        required
                        placeholder="2200"
                        value={formData.priceAdultEgp || 0}
                        onChange={(e) => handleEgpPriceChange(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[#D4AF37] text-white font-black text-emerald-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 text-xs">سعر البالغ بالدولار (Adult USD $)</label>
                      <input
                        type="number"
                        value={formData.priceAdultUsd || 0}
                        onChange={(e) => setFormData({ ...formData, priceAdultUsd: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 text-xs">سعر البالغ باليورو (Adult EUR €)</label>
                      <input
                        type="number"
                        value={formData.priceAdultEur || 0}
                        onChange={(e) => setFormData({ ...formData, priceAdultEur: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Child Prices Section */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                    <span>👶 أسعار الأطفال (Child Prices):</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-amber-400 font-bold block mb-1 text-xs">سعر الطفل بالجنيه (Child EGP - ج.م) *</label>
                      <input
                        type="number"
                        required
                        placeholder="1100"
                        value={formData.priceChildEgp || 0}
                        onChange={(e) => setFormData({ ...formData, priceChildEgp: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-amber-500/40 text-amber-300 font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 text-xs">سعر الطفل بالدولار (Child USD $)</label>
                      <input
                        type="number"
                        value={formData.priceChildUsd || 0}
                        onChange={(e) => setFormData({ ...formData, priceChildUsd: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 text-xs">سعر الطفل باليورو (Child EUR €)</label>
                      <input
                        type="number"
                        value={formData.priceChildEur || 0}
                        onChange={(e) => setFormData({ ...formData, priceChildEur: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">مدة الرحلة (Duration)</label>
                  <input
                    type="text"
                    placeholder="مثال: 6 Hours"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">المكان (Location)</label>
                  <input
                    type="text"
                    placeholder="Hurghada"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">عدد المقاعد</label>
                  <input
                    type="number"
                    value={formData.maxSeats || 30}
                    onChange={(e) => setFormData({ ...formData, maxSeats: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <LuxuryButton type="button" onClick={() => { setIsCreating(false); setEditingTrip(null) }} variant="ghost" size="sm">
                  إلغاء
                </LuxuryButton>
                <LuxuryButton type="submit" disabled={loading} variant="gold" size="sm">
                  {loading ? 'جاري الحفظ...' : 'حفظ الرحلة بالصفحة الرئيسية'}
                </LuxuryButton>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
