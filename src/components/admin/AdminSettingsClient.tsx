'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useStore'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { LuxuryButton } from '@/components/ui/LuxuryButton'
import { Phone, MessageSquare, Check, Settings } from 'lucide-react'

export const AdminSettingsClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [whatsappNumber, setWhatsappNumber] = useState('01070657476')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.whatsapp_number) {
          setWhatsappNumber(data.settings.whatsapp_number)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'whatsapp_number', value: whatsappNumber })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 4000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
  const formattedWaUrl = `https://wa.me/${cleanNumber.startsWith('0') ? '2' + cleanNumber : cleanNumber}`

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Unified Admin Header */}
      <AdminHeader />

      {/* Title */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          {isArabic ? 'إعدادات المنصة ووسائل التواصل' : 'PLATFORM & SUPPORT CONFIGURATION'}
        </span>
        <h1 className="text-3xl font-black text-white mt-1">
          {isArabic ? 'تعديل رقم الواتساب الرسمي والدعم الفني' : 'Manage Official Support WhatsApp Number'}
        </h1>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{isArabic ? 'تم حفظ رقم الواتساب الرسمي وتطبيقه على كافة أجزاء الموقع وحسابات العملاء بنجاح!' : 'Official WhatsApp number updated successfully across the entire system!'}</span>
        </div>
      )}

      {/* WhatsApp Configuration Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 max-w-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isArabic ? 'رقم الواتساب الرسمي لخدمة العملاء' : 'Official WhatsApp Customer Support Number'}
            </h3>
            <p className="text-xs text-slate-400">
              {isArabic ? 'هذا الرقم سيظهر للعملاء في الباقات وحسابات العملاء والزر العائم للدردشة المباشرة.' : 'This number will be used across client dashboards, booking vouchers, and floating chat widgets.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              {isArabic ? 'رقم الهاتف (الواتساب)' : 'WhatsApp Phone Number'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 01070657476"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">
              {isArabic ? 'معاينة رابط الدردشة المباشر (Direct Link Preview):' : 'Direct Link Preview:'}
            </span>
            <a
              href={formattedWaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-emerald-400 hover:underline block truncate"
            >
              {formattedWaUrl}
            </a>
          </div>

          <div className="pt-2 flex justify-end">
            <LuxuryButton type="submit" disabled={loading} variant="gold" size="md">
              {loading ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ وتحديث الرقم' : 'Save WhatsApp Number')}
            </LuxuryButton>
          </div>
        </form>
      </div>

    </div>
  )
}
