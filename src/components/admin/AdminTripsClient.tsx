'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { uploadMedia } from '@/lib/cloudinary'
import { Plus, Edit3, Trash2, Upload, Sparkles, MapPin, Clock, Eye, Search } from 'lucide-react'

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
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  seoSlug?: string
  ogImage?: string
  isIndexed?: boolean
  canonicalUrl?: string
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
    maxSeats: 30,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoSlug: '',
    ogImage: '',
    isIndexed: true,
    canonicalUrl: ''
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

  const handleAutoGenerateSeo = () => {
    const title = formData.titleAr || formData.titleEn || 'رحلة سياحية في الغردقة'
    const desc = formData.descAr || formData.descEn || `احجز رحلة ${title} في الغردقة والبحر الأحمر بأفضل الأسعار المتاحة مع Mr.Raw Travel.`
    const generatedSlug = (formData.titleEn || 'hurghada-trip')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    setFormData((prev) => ({
      ...prev,
      seoTitle: `${title} | Mr.Raw Travel الغردقة`,
      seoDescription: desc.slice(0, 155),
      seoKeywords: `${title}, رحلات الغردقة, سنوركلينج الغردقة, رحلات سياحية الغردقة, ${formData.titleEn || 'Hurghada excursion'}, Mr.Raw Travel`,
      seoSlug: generatedSlug,
      ogImage: prev.coverImage || '',
      isIndexed: true,
      canonicalUrl: `https://mrrawtravel.com/trips/${generatedSlug}`
    }))
  }

  const handleAutoTranslate = async () => {
    if (!formData.titleAr && !formData.descAr) return
    setTranslating(true)
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: formData.titleAr,
          descAr: formData.descAr
        })
      })
      const data = await res.json()
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          titleEn: data.titleEn || prev.titleEn,
          descEn: data.descEn || prev.descEn
        }))
      }
    } catch (e) {
      console.error(e)
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
      alert('فشل رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  const handleOpenCreate = () => {
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
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      seoSlug: '',
      ogImage: '',
      isIndexed: true,
      canonicalUrl: ''
    })
    setEditingTrip(null)
    setIsCreating(true)
  }

  const handleEdit = (trip: TripItem) => {
    setFormData(trip)
    setEditingTrip(trip)
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من إخفاء هذه الرحلة؟ (لن تؤثر على الحجوزات السابقة)')) return
    try {
      const res = await fetch(`/api/admin/trips?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setTrips((prev) => prev.filter((t) => t.id !== id))
      } else {
        alert(data.error || 'فشل حذف الرحلة')
      }
    } catch (err) {
      alert('حدث خطأ أثناء الحذف')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const endpoint = '/api/admin/trips'
      const method = editingTrip ? 'PUT' : 'POST'
      const payload = editingTrip ? { ...formData, id: editingTrip.id } : formData

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.success) {
        setMsg('تم حفظ الرحلة بنجاح!')
        if (editingTrip) {
          setTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? data.trip : t)))
        } else {
          setTrips((prev) => [data.trip, ...prev])
        }
        setTimeout(() => {
          setIsCreating(false)
          setEditingTrip(null)
          setMsg('')
        }, 1000)
      } else {
        setMsg(`خطأ: ${data.error}`)
      }
    } catch (err) {
      setMsg('حدث خطأ بالسيرفر أثناء الحفظ.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader />

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <span>قائمة الرحلات المتاحة</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono">
            {trips.length} رحلة
          </span>
        </h2>
        <LuxuryButton onClick={handleOpenCreate} variant="gold" size="sm" className="flex items-center gap-2 font-bold">
          <Plus className="w-4 h-4" />
          <span>إضافة رحلة جديدة</span>
        </LuxuryButton>
      </div>

      {/* Trips Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition group flex flex-col justify-between">
            <div className="relative h-48 w-full overflow-hidden">
              <img src={trip.coverImage} alt={trip.titleAr || trip.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-black text-[#D4AF37] border border-[#D4AF37]/40">
                {trip.priceAdultEgp} ج.م / {trip.priceAdultUsd}$
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1">
              <h3 className="text-base font-bold text-white line-clamp-1">{trip.titleAr || trip.titleEn}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{trip.descAr || trip.descEn}</p>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {trip.duration}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {trip.location}</span>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
              <a href={`/trips/${trip.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
                <Eye className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(trip)} className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0F17] text-xs font-bold transition flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> تعديل
                </button>
                <button onClick={() => handleDelete(trip.id)} className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> إخفاء
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D121F] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-6 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                {editingTrip ? 'تعديل بيانات الرحلة' : 'إضافة رحلة جديدة بالصفحة الرئيسية'}
              </h3>
              <button onClick={() => { setIsCreating(false); setEditingTrip(null) }} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            {msg && <div className={`p-3 rounded-xl text-xs font-bold ${msg.includes('بنجاح') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">صورة الغلاف (Cover Image)</label>
                <div className="flex items-center gap-4">
                  <img src={formData.coverImage} alt="Cover Preview" className="w-24 h-16 object-cover rounded-xl border border-white/10" />
                  <label className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-bold text-white cursor-pointer transition flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>{uploading ? 'جاري الرفع...' : 'تغيير الصورة'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">اسم الرحلة بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: رحلة سنوركلينج أورنج باي VIP"
                    value={formData.titleAr || ''}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300 block">اسم الرحلة بالإنجليزي *</label>
                    <button type="button" onClick={handleAutoTranslate} className="text-[10px] text-[#D4AF37] font-bold hover:underline flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> ترجمة تلقائية
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Orange Bay Snorkeling & Sea Trip"
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">الوصف بالعربية</label>
                  <textarea
                    rows={3}
                    placeholder="وصف تفصيلي للرحلة..."
                    value={formData.descAr || ''}
                    onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">الوصف بالإنجليزي</label>
                  <textarea
                    rows={3}
                    placeholder="English description..."
                    value={formData.descEn || ''}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider block text-xs">أسعار الرحلة (بالعملات المختلفة)</span>
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

              {/* SEO Controls Section */}
              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#D4AF37]/40 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider block text-xs flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-[#D4AF37]" />
                    <span>إعدادات تحسين محركات البحث (SEO Settings)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSeo}
                    className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0F17] text-xs font-bold transition flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ توليد SEO تلقائياً</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">عنوان الـ SEO (SEO Title)</label>
                    <input
                      type="text"
                      placeholder="عنوان الصفحة لمحركات البحث..."
                      value={formData.seoTitle || ''}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">الرابط الدائم المخصص (SEO Slug)</label>
                    <input
                      type="text"
                      placeholder="e.g. orange-bay-hurghada"
                      value={formData.seoSlug || ''}
                      onChange={(e) => setFormData({ ...formData, seoSlug: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">وصف الميتا (Meta Description)</label>
                  <textarea
                    rows={2}
                    placeholder="وصف مختصر ومحفز يظهر في نتائج بحث جوجل (حتى 160 حرف)..."
                    value={formData.seoDescription || ''}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">الكلمات المفتاحية (SEO Keywords)</label>
                    <input
                      type="text"
                      placeholder="مفصولة بفاصلة: رحلات الغردقة, سنوركلينج, Orange Bay..."
                      value={formData.seoKeywords || ''}
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">رابط الصورة للمشاركة (OG Image URL)</label>
                    <input
                      type="text"
                      placeholder="رابط الصورة التي تظهر عند مشاركة الرابط..."
                      value={formData.ogImage || ''}
                      onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">رابط Canonical URL</label>
                    <input
                      type="text"
                      placeholder="https://mrrawtravel.com/trips/orange-bay-hurghada"
                      value={formData.canonicalUrl || ''}
                      onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <label className="text-xs font-bold text-slate-300 cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isIndexed !== false}
                        onChange={(e) => setFormData({ ...formData, isIndexed: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#D4AF37] focus:ring-0"
                      />
                      <span>السماح لمحركات البحث بفهرسة هذه الرحلة (Index / Allow in Search)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Trip Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1 text-xs">مدة الرحلة (Duration)</label>
                  <input
                    type="text"
                    placeholder="مثال: 6 Hours"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1 text-xs">المكان (Location)</label>
                  <input
                    type="text"
                    placeholder="Hurghada"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1 text-xs">عدد المقاعد</label>
                  <input
                    type="number"
                    value={formData.maxSeats || 30}
                    onChange={(e) => setFormData({ ...formData, maxSeats: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
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
