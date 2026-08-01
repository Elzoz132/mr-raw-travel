'use client'

import React, { useState, useEffect } from 'react'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Plus, Trash2, Edit, Sparkles, Check, DollarSign, Layers } from 'lucide-react'

import { AdminHeader } from '@/components/admin/AdminHeader'

interface Addon {
  id: string
  nameEn: string
  nameAr: string
  category: string
  priceEgp: number
  priceUsd: number
  priceEur: number
  isCustomable: boolean
  isAddon: boolean
}

export const AdminAddonsClient: React.FC = () => {
  const [addons, setAddons] = useState<Addon[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    nameAr: '',
    nameEn: '',
    category: 'SAFARI',
    priceEgp: '',
    priceUsd: '',
    priceEur: '',
    isCustomable: true,
    isAddon: true
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchAddons = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/addons')
      const data = await res.json()
      if (data.success && Array.isArray(data.addons)) {
        setAddons(data.addons)
      }
    } catch {
      setAddons([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddons()
  }, [])

  const handleOpenCreate = () => {
    setFormData({
      id: '',
      nameAr: '',
      nameEn: '',
      category: 'SAFARI',
      priceEgp: '',
      priceUsd: '',
      priceEur: '',
      isCustomable: true,
      isAddon: true
    })
    setError('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (addon: Addon) => {
    setFormData({
      id: addon.id,
      nameAr: addon.nameAr,
      nameEn: addon.nameEn,
      category: addon.category,
      priceEgp: addon.priceEgp.toString(),
      priceUsd: addon.priceUsd.toString(),
      priceEur: addon.priceEur.toString(),
      isCustomable: addon.isCustomable,
      isAddon: addon.isAddon
    })
    setError('')
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من حذف هذا النشاط/الإضافة نهائياً؟')) return
    try {
      await fetch(`/api/admin/addons?id=${id}`, { method: 'DELETE' })
      fetchAddons()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const method = formData.id ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/addons', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priceEgp: Number(formData.priceEgp),
          priceUsd: Number(formData.priceUsd) || Math.round(Number(formData.priceEgp) / 48),
          priceEur: Number(formData.priceEur) || Math.round(Number(formData.priceEgp) / 52)
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save item')
      }

      setIsModalOpen(false)
      fetchAddons()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <AdminHeader />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 border border-[#D4AF37]/30">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
            ADDONS & CUSTOM BUILDER CONTROL
          </span>
          <h1 className="text-2xl font-black text-white">
            إدارة الإضافات وأنشطة الباقة المخصصة
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تحكم في تسعير وتخصيص كل نشاط أو ميزة إضافية تظهر للعميل في اختيار الباقات وفي محرك "اصنع باقتك بنفسك".
          </p>
        </div>

        <LuxuryButton onClick={handleOpenCreate} variant="gold" size="md" className="flex items-center gap-2 font-bold">
          <Plus className="w-4 h-4" />
          <span>إضافة نشاط / ميزة جديدة</span>
        </LuxuryButton>
      </div>

      {/* Addons List Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-bold animate-pulse">
          جاري تحميل الإضافات...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4 space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-2">{item.nameAr}</h3>
                <span className="text-xs text-slate-400 block font-mono">{item.nameEn}</span>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">السعر بالفرد:</span>
                <span className="text-lg font-black text-[#D4AF37]">
                  {item.priceEgp} ج.م <span className="text-[10px] text-slate-400 font-normal">(${item.priceUsd})</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6">
            
            <h2 className="text-xl font-bold text-white text-center">
              {formData.id ? 'تعديل نشاط / إضافة' : 'إضافة نشاط جديد لتسعير الباقات'}
            </h2>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">الاسم باللغة العربية *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عشاء بدوي فاخر"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">الاسم باللغة الإنجليزية</label>
                <input
                  type="text"
                  placeholder="e.g. Bedouin BBQ Dinner"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">القسم (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="SAFARI">سفاري (SAFARI)</option>
                    <option value="WATER_SPORTS">ألعاب مائية (WATER_SPORTS)</option>
                    <option value="YACHT">يخت وسنوركلينج (YACHT)</option>
                    <option value="HORSE">ركوب خيل (HORSE)</option>
                    <option value="GENERAL">عام (GENERAL)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">السعر بالجنيه (EGP) *</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={formData.priceEgp}
                    onChange={(e) => setFormData({ ...formData, priceEgp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold hover:text-white"
                >
                  إلغاء
                </button>
                <LuxuryButton type="submit" disabled={saving} variant="gold" size="md">
                  {saving ? 'جاري الحفظ...' : 'حفظ النشاط'}
                </LuxuryButton>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
