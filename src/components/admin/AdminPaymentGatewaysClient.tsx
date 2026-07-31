'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { CreditCard, Check, Shield, AlertCircle, Smartphone, DollarSign } from 'lucide-react'

export const AdminPaymentGatewaysClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [gateways, setGateways] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchGateways = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gateways')
      const data = await res.json()
      if (data.success) setGateways(data.gateways)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGateways()
  }, [])

  const handleToggleGateway = async (gt: any, isEnabled: boolean) => {
    setSavingKey(gt.key)
    try {
      const res = await fetch('/api/admin/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...gt, isEnabled })
      })
      const data = await res.json()
      if (data.success) {
        setStatusMsg(isArabic ? 'تم تحديث حالة بوابة الدفع بنجاح' : 'Payment gateway status updated successfully!')
        fetchGateways()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            {isArabic ? 'إدارة بوابات الدفع الإلكتروني' : 'Payment Gateways & Checkout Manager'}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isArabic ? 'تفعيل وتعطيل وسائل الدفع المتاحة للعملاء' : 'Manage Active Payment Methods'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'تحكم في تفعيل أو إيقاف بوابات الدفع (Stripe, Paymob, PayPal, Vodafone Cash, InstaPay, Cash) وإرشادات الدفع.'
              : 'Enable or disable checkout payment gateways (Stripe, Paymob, PayPal, Vodafone Cash, InstaPay, Cash on Arrival) dynamically.'}
          </p>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-400 animate-pulse">
              Loading payment gateway configuration...
            </div>
          ) : (
            gateways.map((gt) => (
              <div
                key={gt.key}
                className={`glass-panel rounded-3xl p-6 border space-y-4 flex flex-col justify-between transition-all ${
                  gt.isEnabled
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-rose-500/30 opacity-60 bg-rose-500/5'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#D4AF37] font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      gt.isEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {gt.isEnabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{gt.name || gt.key}</h3>
                  {gt.instructionsEn && <p className="text-xs text-slate-300 leading-relaxed">{gt.instructionsEn}</p>}
                  {gt.instructionsAr && <p className="text-xs text-slate-400 font-arabic">{gt.instructionsAr}</p>}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Gateway Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gt.isEnabled}
                      onChange={(e) => handleToggleGateway(gt, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
