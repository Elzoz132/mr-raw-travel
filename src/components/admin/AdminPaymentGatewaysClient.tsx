'use client'

import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAppStore } from '@/store/useStore'
import { CreditCard, Check, Smartphone, Building2, Wallet, DollarSign, Save, ShieldCheck, HelpCircle } from 'lucide-react'

interface GatewayDetails {
  phoneNumber?: string
  accountName?: string
  username?: string
  bankName?: string
  accountHolder?: string
  accountNumber?: string
  iban?: string
  swiftCode?: string
}

export const AdminPaymentGatewaysClient: React.FC = () => {
  const { language } = useAppStore()
  const isArabic = language === 'ar'

  const [gateways, setGateways] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState('')

  // Local editable form state for gateway details & instructions
  const [formDataMap, setFormDataMap] = useState<Record<string, {
    isEnabled: boolean
    instructionsAr: string
    instructionsEn: string
    details: GatewayDetails
  }>>({})

  const fetchGateways = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gateways')
      const data = await res.json()
      if (data.success && data.gateways) {
        setGateways(data.gateways)
        
        const map: Record<string, any> = {}
        data.gateways.forEach((gt: any) => {
          let parsedDetails: GatewayDetails = {}
          try {
            if (gt.details) {
              parsedDetails = typeof gt.details === 'string' ? JSON.parse(gt.details) : gt.details
            }
          } catch (e) {}

          map[gt.key] = {
            isEnabled: gt.isEnabled !== false,
            instructionsAr: gt.instructionsAr || '',
            instructionsEn: gt.instructionsEn || '',
            details: parsedDetails
          }
        })
        setFormDataMap(map)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGateways()
  }, [])

  const handleSaveGateway = async (key: string) => {
    const item = formDataMap[key]
    if (!item) return

    setSavingKey(key)
    setStatusMsg('')

    try {
      const res = await fetch('/api/admin/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          isEnabled: item.isEnabled,
          instructionsAr: item.instructionsAr,
          instructionsEn: item.instructionsEn,
          details: item.details
        })
      })
      const data = await res.json()
      if (data.success) {
        setStatusMsg(isArabic ? `تم حفظ وتعديل بيانات طريقة الدفع (${key}) بنجاح! 💳` : `Updated ${key} settings successfully!`)
        setTimeout(() => setStatusMsg(''), 4000)
        fetchGateways()
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setSavingKey(null)
    }
  }

  const updateDetailField = (key: string, field: keyof GatewayDetails, value: string) => {
    setFormDataMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        details: {
          ...prev[key]?.details,
          [field]: value
        }
      }
    }))
  }

  const updateInstructionField = (key: string, field: 'instructionsAr' | 'instructionsEn', value: string) => {
    setFormDataMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }))
  }

  const toggleGatewayStatus = (key: string, enabled: boolean) => {
    setFormDataMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isEnabled: enabled
      }
    }))
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white pb-20">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <CreditCard className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة وحسابات وسائل الدفع والتحويل المالي' : 'Payment Gateways & Accounts Manager'}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isArabic ? 'تعديل أرقام فودافون كاش، إنستا باي، والحسابات البنكية' : 'Payment Gateways Configuration'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic
                ? 'تحكم في تفعيل أو إيقاف طرق الدفع وتعديل أرقام فودافون كاش، اسم ومعرف إنستا باي، ورقم الحساب البنكي والـ IBAN.'
                : 'Configure numbers for Vodafone Cash, InstaPay IDs/accounts, and bank wire transfer details.'}
            </p>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 animate-pulse">
            جاري تحميل إعدادات بوابات وطرق الدفع...
          </div>
        ) : (
          <div className="space-y-8">

            {/* 1. VODAFONE CASH SECTION */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">📱 فودافون كاش (Vodafone Cash Mobile Wallet)</h2>
                    <p className="text-xs text-slate-400">تعديل رقم المحفظة وتعليمات الإيداع للعميل</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <span className="text-slate-300">{formDataMap['VODAFONE_CASH']?.isEnabled ? 'تفعيل' : 'تعطيل'}</span>
                    <input
                      type="checkbox"
                      checked={formDataMap['VODAFONE_CASH']?.isEnabled ?? true}
                      onChange={(e) => toggleGatewayStatus('VODAFONE_CASH', e.target.checked)}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                  </label>
                  <button
                    onClick={() => handleSaveGateway('VODAFONE_CASH')}
                    disabled={savingKey === 'VODAFONE_CASH'}
                    className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-extrabold text-xs flex items-center gap-2 hover:bg-[#E5C158]"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingKey === 'VODAFONE_CASH' ? 'جاري الحفظ...' : 'حفظ تعديلات فودافون كاش'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">رقم تليفون محفظة فودافون كاش *</label>
                  <input
                    type="text"
                    value={formDataMap['VODAFONE_CASH']?.details?.phoneNumber || ''}
                    onChange={(e) => updateDetailField('VODAFONE_CASH', 'phoneNumber', e.target.value)}
                    placeholder="e.g. 01022392428"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">اسم صاحب المحفظة (اختياري)</label>
                  <input
                    type="text"
                    value={formDataMap['VODAFONE_CASH']?.details?.accountName || ''}
                    onChange={(e) => updateDetailField('VODAFONE_CASH', 'accountName', e.target.value)}
                    placeholder="e.g. Mr.Raw Travel"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-300">تعليمات الإيداع المكتوبة للعميل صفحة الحجز</label>
                  <textarea
                    rows={2}
                    value={formDataMap['VODAFONE_CASH']?.instructionsAr || ''}
                    onChange={(e) => updateInstructionField('VODAFONE_CASH', 'instructionsAr', e.target.value)}
                    placeholder="يرجى تحويل قيمة العربون إلى رقم فودافون كاش وأرفق صورة الإيصال لتأكيد الحجز فوراً."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* 2. INSTAPAY SECTION */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">⚡ إنستا باي (InstaPay Egypt Direct Transfer)</h2>
                    <p className="text-xs text-slate-400">تعديل اسم الحساب، معرف IPA، ورقم التليفون لإنستا باي</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <span className="text-slate-300">{formDataMap['INSTAPAY']?.isEnabled ? 'تفعيل' : 'تعطيل'}</span>
                    <input
                      type="checkbox"
                      checked={formDataMap['INSTAPAY']?.isEnabled ?? true}
                      onChange={(e) => toggleGatewayStatus('INSTAPAY', e.target.checked)}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                  </label>
                  <button
                    onClick={() => handleSaveGateway('INSTAPAY')}
                    disabled={savingKey === 'INSTAPAY'}
                    className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-extrabold text-xs flex items-center gap-2 hover:bg-[#E5C158]"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingKey === 'INSTAPAY' ? 'جاري الحفظ...' : 'حفظ تعديلات إنستا باي'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">اسم الحساب على InstaPay *</label>
                  <input
                    type="text"
                    value={formDataMap['INSTAPAY']?.details?.accountName || ''}
                    onChange={(e) => updateDetailField('INSTAPAY', 'accountName', e.target.value)}
                    placeholder="e.g. Mr.Raw Luxury Travel"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">معرف إنستا باي / IPA Address *</label>
                  <input
                    type="text"
                    value={formDataMap['INSTAPAY']?.details?.username || ''}
                    onChange={(e) => updateDetailField('INSTAPAY', 'username', e.target.value)}
                    placeholder="e.g. mrraw@instapay"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">رقم الهاتف المرتبط بإنستا باي *</label>
                  <input
                    type="text"
                    value={formDataMap['INSTAPAY']?.details?.phoneNumber || ''}
                    onChange={(e) => updateDetailField('INSTAPAY', 'phoneNumber', e.target.value)}
                    placeholder="e.g. 01022392428"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="font-bold text-slate-300">تعليمات تحويل إنستا باي للعميل</label>
                  <textarea
                    rows={2}
                    value={formDataMap['INSTAPAY']?.instructionsAr || ''}
                    onChange={(e) => updateInstructionField('INSTAPAY', 'instructionsAr', e.target.value)}
                    placeholder="افتح تطبيق InstaPay وقم بالتحويل إلى معرف الـ IPA أو اسم الحساب ثم ارفع الإيصال."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* 3. BANK TRANSFER SECTION */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">🏛️ بيانات الحساب البنكي (Bank Wire Transfer)</h2>
                    <p className="text-xs text-slate-400">تعديل اسم البنك، اسم صاحب الحساب، رقم الحساب، الـ IBAN، وسويفت كود</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <span className="text-slate-300">{formDataMap['BANK_TRANSFER']?.isEnabled ? 'تفعيل' : 'تعطيل'}</span>
                    <input
                      type="checkbox"
                      checked={formDataMap['BANK_TRANSFER']?.isEnabled ?? true}
                      onChange={(e) => toggleGatewayStatus('BANK_TRANSFER', e.target.checked)}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                  </label>
                  <button
                    onClick={() => handleSaveGateway('BANK_TRANSFER')}
                    disabled={savingKey === 'BANK_TRANSFER'}
                    className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0F17] font-extrabold text-xs flex items-center gap-2 hover:bg-[#E5C158]"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingKey === 'BANK_TRANSFER' ? 'جاري الحفظ...' : 'حفظ بيانات الحساب البنكي'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">اسم البنك (Bank Name) *</label>
                  <input
                    type="text"
                    value={formDataMap['BANK_TRANSFER']?.details?.bankName || ''}
                    onChange={(e) => updateDetailField('BANK_TRANSFER', 'bankName', e.target.value)}
                    placeholder="e.g. البنك الأهلي المصري (National Bank of Egypt)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">اسم صاحب الحساب (Account Holder) *</label>
                  <input
                    type="text"
                    value={formDataMap['BANK_TRANSFER']?.details?.accountHolder || ''}
                    onChange={(e) => updateDetailField('BANK_TRANSFER', 'accountHolder', e.target.value)}
                    placeholder="e.g. Mr.Raw Luxury Travel"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">رقم الحساب البنكي (Account Number) *</label>
                  <input
                    type="text"
                    value={formDataMap['BANK_TRANSFER']?.details?.accountNumber || ''}
                    onChange={(e) => updateDetailField('BANK_TRANSFER', 'accountNumber', e.target.value)}
                    placeholder="e.g. 1234567890123456"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">رقم الـ IBAN الدولي *</label>
                  <input
                    type="text"
                    value={formDataMap['BANK_TRANSFER']?.details?.iban || ''}
                    onChange={(e) => updateDetailField('BANK_TRANSFER', 'iban', e.target.value)}
                    placeholder="e.g. EG380002000100001234567890123"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">كود السويفت SWIFT / BIC Code</label>
                  <input
                    type="text"
                    value={formDataMap['BANK_TRANSFER']?.details?.swiftCode || ''}
                    onChange={(e) => updateDetailField('BANK_TRANSFER', 'swiftCode', e.target.value)}
                    placeholder="e.g. NBEGEGCX"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                  <label className="font-bold text-slate-300">ملاحظات وتعليمات التحويل البنكي للعميل</label>
                  <textarea
                    rows={2}
                    value={formDataMap['BANK_TRANSFER']?.instructionsAr || ''}
                    onChange={(e) => updateInstructionField('BANK_TRANSFER', 'instructionsAr', e.target.value)}
                    placeholder="يرجى كتابة رقم الحجز في خانة ملاحظات التحويل البنكي وإرفاق الإيصال."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* 4. OTHER ONLINE PAYMENT GATEWAYS (CASH, CARD, STRIPE, PAYPAL) */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">
                💳 باقي وسائل وبوابات الدفع (الدفع كاش عند الاستقبال، البطاقات، Stripe، PayPal)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'CASH', title: '💵 الدفع كاش عند الاستقبال (Cash on Arrival)', defaultDesc: 'الدفع نقداً بالدولار، اليورو، أو الجنيه لمندوب الشركة.' },
                  { key: 'CARD', title: '💳 البطاقات البنكية الائتمانية (Online Credit Card)', defaultDesc: 'الدفع الإلكتروني عبر فيزا أو ماستر كارد.' },
                  { key: 'STRIPE', title: '🌐 بوابة Stripe العالمية', defaultDesc: 'ربط الحساب بـ Stripe Payments' },
                  { key: 'PAYPAL', title: '🅿️ حساب PayPal Express', defaultDesc: 'الدفع السريع عبر حساب PayPal' }
                ].map((gtItem) => (
                  <div key={gtItem.key} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{gtItem.title}</h3>
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <span className="text-slate-400">{formDataMap[gtItem.key]?.isEnabled ? 'مفعل' : 'معطل'}</span>
                        <input
                          type="checkbox"
                          checked={formDataMap[gtItem.key]?.isEnabled ?? true}
                          onChange={(e) => toggleGatewayStatus(gtItem.key, e.target.checked)}
                          className="w-4 h-4 accent-[#D4AF37]"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="text-slate-300 font-bold">تعليمات وتوضيحات طريقة الدفع</label>
                      <input
                        type="text"
                        value={formDataMap[gtItem.key]?.instructionsAr || ''}
                        onChange={(e) => updateInstructionField(gtItem.key, 'instructionsAr', e.target.value)}
                        placeholder={gtItem.defaultDesc}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      onClick={() => handleSaveGateway(gtItem.key)}
                      disabled={savingKey === gtItem.key}
                      className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingKey === gtItem.key ? 'جاري الحفظ...' : 'حفظ'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
