'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useStore'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Plus, Trash2, Ticket } from 'lucide-react'

interface CouponItem {
  id: string
  code: string
  type: string
  value: number
  maxUses: number
  usedCount: number
  isActive: boolean
}

interface AdminCouponsClientProps {
  initialCoupons: CouponItem[]
}

export const AdminCouponsClient: React.FC<AdminCouponsClientProps> = ({ initialCoupons }) => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '15',
    maxUses: '100'
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || !formData.value) return

    setLoading(true)
    setMsg('')

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create coupon.')
      }

      setCoupons([data.coupon, ...coupons])
      setIsModalOpen(false)
      setFormData({ code: '', type: 'PERCENTAGE', value: '15', maxUses: '100' })
      setMsg(isArabic ? 'تم إنشاء كود الخصم بنجاح!' : 'Coupon created successfully!')
    } catch (err: any) {
      setMsg(err.message || 'Error creating coupon.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm(isArabic ? 'هل أنت تأكد من حذف كود الخصم؟' : 'Delete coupon code?')) return

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id))
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
            {isArabic ? 'إدارة العروض الترويجية' : 'PROMOTIONS & DISCOUNTS CMS'}
          </span>
          <h1 className="text-3xl font-black text-white">
            {isArabic ? 'إدارة وإنشاء أكواد الخصم والبرومو كود' : 'Discount Coupons & Promo Codes'}
          </h1>
        </div>

        <LuxuryButton
          onClick={() => setIsModalOpen(true)}
          variant="gold"
          size="md"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة كود خصم جديد' : 'Create New Promo Code'}</span>
        </LuxuryButton>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          {msg}
        </div>
      )}

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-lg font-black font-mono text-white tracking-wider">{c.code}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold">
                {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `$${c.value} OFF`}
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>{isArabic ? `الاستخدامات: ${c.usedCount} من أصل ${c.maxUses}` : `Usage: ${c.usedCount} / ${c.maxUses} times`}</p>
              <p className="text-emerald-400 font-semibold">{isArabic ? 'حالة الكود: نشط ومفعل' : 'Status: Active & Valid'}</p>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => handleDeleteCoupon(c.id)}
                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isArabic ? 'حذف' : 'Delete'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-[#D4AF37]/40 space-y-6">
            <h3 className="text-xl font-bold text-white border-l-4 border-[#D4AF37] pl-3">
              {isArabic ? 'إنشاء كود خصم جديد' : 'Create Promo Coupon'}
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Coupon Code (e.g. SUMMER20)</label>
                <input
                  type="text"
                  placeholder="e.g. VIP2026"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono uppercase focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Discount Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Max Usage Count</label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <LuxuryButton type="button" onClick={() => setIsModalOpen(false)} variant="ghost" size="sm">
                  Cancel
                </LuxuryButton>
                <LuxuryButton type="submit" disabled={loading} variant="gold" size="sm">
                  {loading ? 'Creating...' : 'Save Coupon'}
                </LuxuryButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
