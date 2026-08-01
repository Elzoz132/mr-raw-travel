'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { PackageData } from '@/components/trip/PackageComparison'
import { uploadMedia } from '@/lib/cloudinary'
import {
  Palmtree,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Check,
  Star,
  Sparkles,
  DollarSign,
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export const AdminPackagesClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [trips, setTrips] = useState<any[]>([])
  const [selectedTripId, setSelectedTripId] = useState<string>('ALL')
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPkg, setEditingPkg] = useState<Partial<PackageData> | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [translating, setTranslating] = useState(false)

  const handleAutoTranslate = async () => {
    if (!editingPkg) return
    const sourceText = editingPkg.nameAr || editingPkg.nameEn || ''
    const sourceDesc = editingPkg.descAr || editingPkg.descEn || ''
    if (!sourceText && !sourceDesc) return

    setTranslating(true)
    try {
      const [nameEnRes, nameArRes, nameDeRes, descEnRes, descArRes, descDeRes] = await Promise.all([
        fetch('/api/admin/translate', { method: 'POST', body: JSON.stringify({ text: sourceText, targetLang: 'en' }) }).then(r => r.json()),
        fetch('/api/admin/translate', { method: 'POST', body: JSON.stringify({ text: sourceText, targetLang: 'ar' }) }).then(r => r.json()),
        fetch('/api/admin/translate', { method: 'POST', body: JSON.stringify({ text: sourceText, targetLang: 'de' }) }).then(r => r.json()),
        sourceDesc ? fetch('/api/admin/translate', { method: 'POST', body: JSON.stringify({ text: sourceDesc, targetLang: 'en' }) }).then(r => r.json()) : Promise.resolve({ translatedText: '' }),
        sourceDesc ? fetch('/api/admin/translate', { method: 'POST', body: JSON.stringify({ text: sourceDesc, targetLang: 'ar' }) }).then(r => r.json()) : Promise.resolve({ translatedText: '' }),
        sourceDesc ? fetch('/api/admin/translate', { method: 'POST', body: JSON.stringify({ text: sourceDesc, targetLang: 'de' }) }).then(r => r.json()) : Promise.resolve({ translatedText: '' })
      ])

      setEditingPkg({
        ...editingPkg,
        nameEn: nameEnRes.translatedText || editingPkg.nameEn || sourceText,
        nameAr: nameArRes.translatedText || editingPkg.nameAr || sourceText,
        nameDe: nameDeRes.translatedText || editingPkg.nameDe || sourceText,
        ...(sourceDesc && {
          descEn: descEnRes.translatedText || editingPkg.descEn,
          descAr: descArRes.translatedText || editingPkg.descAr,
          descDe: descDeRes.translatedText || editingPkg.descDe
        })
      })
    } catch (err) {
      console.error(err)
    } finally {
      setTranslating(false)
    }
  }

  const handleEgpPriceChange = (egpVal: number) => {
    if (!editingPkg) return
    const usd = Math.round(egpVal / 48)
    const eur = Math.round(egpVal / 52)
    const gbp = Math.round(egpVal / 60)
    setEditingPkg({
      ...editingPkg,
      priceAdultEgp: egpVal,
      priceAdultUsd: usd,
      priceAdultEur: eur,
      priceAdultGbp: gbp,
      priceChildEgp: Math.round(egpVal * 0.6),
      priceChildUsd: Math.round(usd * 0.6),
      priceChildEur: Math.round(eur * 0.6),
      priceChildGbp: Math.round(gbp * 0.6)
    })
  }

  // Fetch Trips & Packages
  const loadData = async () => {
    setLoading(true)
    try {
      const [tripsRes, pkgsRes] = await Promise.all([
        fetch('/api/admin/trips'),
        fetch(selectedTripId === 'ALL' ? '/api/admin/packages' : `/api/admin/packages?tripId=${selectedTripId}`)
      ])

      const tripsData = await tripsRes.json()
      const pkgsData = await pkgsRes.json()

      if (tripsData.trips) setTrips(tripsData.trips)
      if (pkgsData.packages) setPackages(pkgsData.packages)
    } catch (err) {
      console.error('Error loading package CMS data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedTripId])

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPkg) return

    setSaving(true)
    setStatusMsg('')

    try {
      const method = editingPkg.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/packages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPkg)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatusMsg(isArabic ? 'تم حفظ الباقة بنجاح!' : 'Package saved successfully!')
        setEditingPkg(null)
        loadData()
      } else {
        setStatusMsg(data.error || 'Failed to save package')
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Saving error')
    } finally {
      setSaving(false)
    }
  }

  const handleDuplicate = async (pkgId: string) => {
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pkgId, action: 'duplicate' })
      })
      const data = await res.json()
      if (data.success) {
        setStatusMsg(isArabic ? 'تم تكرار الباقة بنجاح!' : 'Package duplicated successfully!')
        loadData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (pkgId: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من حذف هذه الباقة؟' : 'Are you sure you want to delete this package?')) return
    try {
      const res = await fetch(`/api/admin/packages?id=${pkgId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setStatusMsg(isArabic ? 'تم حذف الباقة بنجاح' : 'Package deleted successfully')
        loadData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleStatus = async (pkg: PackageData) => {
    const nextStatus = pkg.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE'
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pkg.id, status: nextStatus })
      })
      const data = await res.json()
      if (data.success) {
        loadData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingPkg) return
    setUploadingPhoto(true)
    try {
      const res = await uploadMedia(file)
      let photosArr: string[] = []
      if (editingPkg.photos) {
        try {
          photosArr = JSON.parse(editingPkg.photos)
        } catch {
          photosArr = [editingPkg.photos]
        }
      }
      photosArr.push(res.url)
      setEditingPkg({ ...editingPkg, photos: JSON.stringify(photosArr) })
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingPhoto(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Palmtree className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة الباقات والرحلات المتعددة CMS' : 'Multi-Package System CMS'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'إدارة باقات الرحلات والأسعار' : 'Trip Package & Pricing Manager'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'أنشئ باقات متعددة داخل الرحلة الواحدة (Standard, Premium, VIP, Charter) مع تخصيص الأسعار بكل عملة والمزايا.'
                : 'Create and manage unlimited packages inside each trip (Standard, VIP, Private Charter) with multi-currency pricing and seating.'}
            </p>
          </div>

          <button
            onClick={() =>
              setEditingPkg({
                tripId: trips[0]?.id || '',
                nameEn: 'VIP Royal Charter',
                nameAr: 'باقة اليخت الملكي VIP',
                nameDe: 'VIP Königliches Ausflugspaket',
                descEn: 'Includes private driver, seafood buffet, and VIP lounge deck access.',
                descAr: 'تشمل توصيل خاص وبوفيه فواكه وجلسة ملكية خاصة.',
                descDe: 'Inklusive Privattransfer und Meeresfrüchte-Buffet.',
                priceAdultUsd: 65,
                priceChildUsd: 35,
                priceAdultEur: 60,
                priceChildEur: 30,
                priceAdultEgp: 3200,
                priceChildEgp: 1600,
                priceAdultGbp: 52,
                priceChildGbp: 28,
                discountPercent: 15,
                currency: 'USD',
                capacity: 30,
                status: 'ACTIVE',
                badge: 'BEST VALUE'
              })
            }
            className="px-6 py-3 rounded-xl gold-gradient-btn text-xs font-black uppercase tracking-wider text-[#0B0F17] flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? 'إضافة باقة جديدة' : 'Create New Package'}
          </button>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Filter Trip Selector */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
              {isArabic ? 'تصفية حسب الرحلة:' : 'Filter by Excursion:'}
            </span>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white font-bold w-full sm:w-80"
            >
              <option value="ALL" className="bg-[#0F172A]">All Excursions ({packages.length} Packages)</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0F172A]">
                  {t.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Total Active Packages: <span className="font-extrabold text-[#D4AF37]">{packages.filter((p) => p.status === 'ACTIVE').length}</span>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-400 animate-pulse">
              Loading package management data...
            </div>
          ) : packages.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-400">
              No packages found. Click "Create New Package" to add your first excursion package.
            </div>
          ) : (
            packages.map((pkg: any) => (
              <div
                key={pkg.id}
                className={`glass-panel rounded-3xl p-6 border space-y-4 flex flex-col justify-between transition-all ${
                  pkg.status === 'ACTIVE'
                    ? 'border-white/10 hover:border-[#D4AF37]/50'
                    : 'border-rose-500/30 opacity-60 bg-rose-500/5'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Badges & Trip Title */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/30 text-[10px] uppercase truncate max-w-[180px]">
                      {pkg.trip?.titleEn || 'Excursion Package'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pkg.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {pkg.status}
                    </span>
                  </div>

                  {/* Package Name */}
                  <h3 className="text-xl font-bold text-white flex items-center justify-between">
                    <span>{pkg.nameEn}</span>
                    {pkg.badge && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#D4AF37] text-[#0B0F17]">
                        {pkg.badge}
                      </span>
                    )}
                  </h3>

                  {pkg.descEn && (
                    <p className="text-xs text-slate-300 line-clamp-2">{pkg.descEn}</p>
                  )}

                  {/* Price Grid */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Adult USD</span>
                      <span className="font-bold text-[#D4AF37] text-sm">${pkg.priceAdultUsd}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Child USD</span>
                      <span className="font-bold text-white text-sm">${pkg.priceChildUsd}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Adult EGP</span>
                      <span className="font-bold text-emerald-400">{pkg.priceAdultEgp} EGP</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Capacity</span>
                      <span className="font-bold text-slate-200">{pkg.capacity} Seats</span>
                    </div>
                  </div>

                </div>

                {/* Actions Row */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingPkg(pkg)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0B0F17] text-white transition text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDuplicate(pkg.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition text-xs font-bold"
                      title="Duplicate Package"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(pkg)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition text-xs font-bold"
                      title="Toggle Visibility"
                    >
                      {pkg.status === 'ACTIVE' ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    title="Delete Package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Modal for Creating / Editing Package */}
        {editingPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingPkg.id ? 'Edit Package Configuration' : 'Create New Trip Package'}
                </h3>
                <button onClick={() => setEditingPkg(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-6">
                
                {/* Trip Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block">
                    الرحلة المستهدفة (Target Excursion) *
                  </label>
                  <select
                    required
                    value={editingPkg.tripId}
                    onChange={(e) => setEditingPkg({ ...editingPkg, tripId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-bold"
                  >
                    <option value="" className="bg-[#0F172A]">-- اختر الرحلة (مثل رحلات السفاري / الألعاب المائية) --</option>
                    {trips.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#0F172A]">
                        {t.titleAr ? `${t.titleAr} (${t.titleEn})` : t.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Package Name EN, AR, DE */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                      اسم ومسمى الباقة (اكتب بأي لغة واضغط ترجمة تلقائية)
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoTranslate}
                      disabled={translating}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 hover:bg-[#E5C158] transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{translating ? 'جاري الترجمة التلقائية...' : '⚡ ترجمة تلقائية لكل اللغات'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">الاسم بالعربية (AR) *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: باقة فاميلي سفاري الشاملة"
                        value={editingPkg.nameAr || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, nameAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Name (EN) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Family Safari Full Package"
                        value={editingPkg.nameEn || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, nameEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Name (DE)</label>
                      <input
                        type="text"
                        placeholder="z.B. Familien-Safari Paket"
                        value={editingPkg.nameDe || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, nameDe: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Package Description (وصف الباقة الشامل) */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    وصف وتفاصيل الباقة (Package Full Description)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">الوصف بالعربية (AR)</label>
                      <textarea
                        rows={3}
                        placeholder="أدخل وصف الباقة وتفاصيل ما تحتوي عليه من عشاء وركوب خيل وكواد وشاي بدوي..."
                        value={editingPkg.descAr || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, descAr: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Description (EN)</label>
                      <textarea
                        rows={3}
                        placeholder="Enter full package highlights, activities, dinner, quad biking, and transfers..."
                        value={editingPkg.descEn || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, descEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration & Meeting Point Details (مدة الرحلة، المواعيد، مكان التنقلات) */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    مدة الباقة ومكان التجمع والتنقلات (Duration & Pickup Details)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1">مدة الرحلة (Duration)</label>
                      <input
                        type="text"
                        placeholder="مثال: 4 ساعات (15:00 - 19:00)"
                        value={editingPkg.duration || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">وقت البدء (Start Time)</label>
                      <input
                        type="text"
                        placeholder="03:00 PM"
                        value={editingPkg.startTime || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, startTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">وقت الانتهاء (End Time)</label>
                      <input
                        type="text"
                        placeholder="07:00 PM"
                        value={editingPkg.endTime || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, endTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">مكان التجمع والتنقلات</label>
                      <input
                        type="text"
                        placeholder="جميع فنادق الغردقة والجونة وسهل حشيش"
                        value={editingPkg.meetingPointAr || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, meetingPointAr: e.target.value, meetingPointEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Package Photos Upload Gallery (صور الباقة) */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                      معرض صور الباقة والرحلة (Package Photo Gallery)
                    </span>
                    <label className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-600 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? 'جاري رفع الصورة...' : 'إضافة صورة جديدة'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Photo Thumbnails Preview */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {(() => {
                      let arr: string[] = []
                      if (editingPkg.photos) {
                        try {
                          arr = typeof editingPkg.photos === 'string' ? JSON.parse(editingPkg.photos) : editingPkg.photos
                        } catch {
                          arr = [editingPkg.photos]
                        }
                      }
                      if (arr.length === 0) {
                        return <span className="text-slate-400 text-xs">لا يوجد صور مرفوعة لهذه الباقة حالياً. اضغط "إضافة صورة جديدة" لرفع صورك.</span>
                      }
                      return arr.map((url: string, index: number) => (
                        <div key={index} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/15">
                          <img src={url} alt={`Photo ${index}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const filtered = arr.filter((_, i) => i !== index)
                              setEditingPkg({ ...editingPkg, photos: JSON.stringify(filtered) })
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    })()}
                  </div>
                </div>

                {/* Multi-Currency Pricing Inputs */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                      أسعار الباقة (ادخل السعر بالجنيه المصري ليتم التحويل تلقائياً)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">السعر بالجنيه (EGP) *</label>
                      <input
                        type="number"
                        required
                        placeholder="800"
                        value={editingPkg.priceAdultEgp || 0}
                        onChange={(e) => handleEgpPriceChange(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-[#D4AF37] text-white font-black text-emerald-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Adult USD ($)</label>
                      <input
                        type="number"
                        required
                        value={editingPkg.priceAdultUsd || 0}
                        onChange={(e) => setEditingPkg({ ...editingPkg, priceAdultUsd: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Adult EUR (€)</label>
                      <input
                        type="number"
                        required
                        value={editingPkg.priceAdultEur || 0}
                        onChange={(e) => setEditingPkg({ ...editingPkg, priceAdultEur: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Adult GBP (£)</label>
                      <input
                        type="number"
                        value={editingPkg.priceAdultGbp || 0}
                        onChange={(e) => setEditingPkg({ ...editingPkg, priceAdultGbp: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Badge & Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">شارة الباقة (Badge) (مثلاً: VIP SAFARI)</label>
                    <input
                      type="text"
                      placeholder="VIP SAFARI"
                      value={editingPkg.badge || ''}
                      onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">سعة المقاعد (Capacity)</label>
                    <input
                      type="number"
                      value={editingPkg.capacity || 20}
                      onChange={(e) => setEditingPkg({ ...editingPkg, capacity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">الحالة (Status)</label>
                    <select
                      value={editingPkg.status || 'ACTIVE'}
                      onChange={(e) => setEditingPkg({ ...editingPkg, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    >
                      <option value="ACTIVE" className="bg-[#0F172A]">نشط (ACTIVE)</option>
                      <option value="HIDDEN" className="bg-[#0F172A]">مخفي (HIDDEN)</option>
                      <option value="ARCHIVED" className="bg-[#0F172A]">مؤرشف (ARCHIVED)</option>
                    </select>
                  </div>
                </div>

                {/* Submit buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingPkg(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-black uppercase text-[#0B0F17]"
                  >
                    {saving ? 'Saving...' : 'Save Package'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
